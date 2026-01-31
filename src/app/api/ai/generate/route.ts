import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getPlanLimits, PlanType } from '@/lib/permissions';
import { logSystem } from '@/lib/system-log';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, label, currentDescription, productType, tone } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 1. Resolve Team and Plan
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const team = project.team;
    
    // Check if team is blocked from using AI
    if (team.aiBlocked) {
      await logSystem('WARN', 'AI', 'Blocked team attempted generation', { teamId: team.id, userId: session.userId });
      return NextResponse.json({ error: 'AI generation has been temporarily disabled for your team. Please contact support.' }, { status: 403 });
    }

    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const limits = getPlanLimits(plan);

    // 2. Check Feature Access
    if (!limits.canGenerateAI && plan !== PlanType.FREE) { // Allow FREE to try a bit if we set limit > 0
        // If limit is 0, then blocked.
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan. Please upgrade.' }, { status: 403 });
        }
    }

    // 3. Rate Limiting (Abuse Prevention - Short Term)
    // Limit: 10 requests per minute per user
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentUserRequests = await prisma.aIUsageLog.count({
      where: {
        teamId: team.id, // We track by team in usage log, but let's check user abuse? 
        // AIUsageLog doesn't have userId currently? Let's check schema.
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    // Note: AIUsageLog schema: id, teamId, action, inputTokens, outputTokens, model, createdAt.
    // It doesn't store userId. We should probably add userId to AIUsageLog for better tracking, 
    // but for now we'll rate limit the TEAM for abuse (which is also valid).
    if (recentUserRequests >= 20) { // 20 per minute per team
        await logSystem('WARN', 'AI', 'Rate limit exceeded', { teamId: team.id });
        return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    // 4. Quota Enforcement (Monthly Limit)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await prisma.aIUsageLog.count({
      where: {
        teamId: team.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (monthlyUsage >= limits.maxAIGenerationsPerMonth) {
      await logSystem('WARN', 'AI', 'Monthly quota exceeded', { teamId: team.id, plan });
      return NextResponse.json({ 
        error: `Monthly AI limit reached (${monthlyUsage}/${limits.maxAIGenerationsPerMonth}). Please upgrade your plan.` 
      }, { status: 403 });
    }

    // 5. "Generate" Content (Mock)
    // In a real app, call OpenAI/Anthropic here.
    const generatedContent = `[${productType} - ${tone}] Generated description for "${label}". 
This feature is critical for the ${productType} platform. 
It ensures that users can achieve their goals efficiently.
    
Acceptance Criteria:
1. Verify that ${label} works as expected.
2. Ensure error states are handled.
3. Validate performance under load.`;

    // 6. Log Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'generate_user_story',
        inputTokens: 50, // Mock token count
        outputTokens: 150, // Mock token count
        model: 'gpt-mock',
      },
    });

    return NextResponse.json({ 
      content: generatedContent,
      usage: {
        used: monthlyUsage + 1,
        limit: limits.maxAIGenerationsPerMonth
      }
    });

  } catch (error) {
    console.error('AI Generation error:', error);
    await logSystem('ERROR', 'AI', 'Generation failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

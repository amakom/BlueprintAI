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

    const { projectId, description } = await req.json();

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
    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan. Please upgrade.' }, { status: 403 });
        }
    }

    // 3. Rate Limiting (Abuse Prevention - Short Term)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentUserRequests = await prisma.aIUsageLog.count({
      where: {
        teamId: team.id,
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    if (recentUserRequests >= 20) {
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

    // 5. "Generate" OKRs (Mock)
    // In a real app, we would prompt the LLM to generate JSON.
    // Prompt: "Generate 3 OKRs for a project with description: ${description || project.description}"
    
    const contextDescription = description || project.description || "A new innovative product";

    const mockOKRs = [
      {
        objective: "Launch MVP successfully",
        keyResults: ["Acquire 1000 active users", "Achieve 20% retention rate", "Maintain <1% crash rate"]
      },
      {
        objective: "Validate Product-Market Fit",
        keyResults: ["Conduct 50 user interviews", "Secure 5 paid pilot customers", "Achieve NPS of 40+"]
      },
      {
        objective: "Establish Operational Excellence",
        keyResults: ["Reduce deployment time to <10 mins", "Implement comprehensive monitoring", "Document core workflows"]
      }
    ];

    // 6. Log Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'generate_okrs',
        inputTokens: 100,
        outputTokens: 300,
        model: 'gpt-mock-okr',
      },
    });

    return NextResponse.json({ 
      okrs: mockOKRs,
      usage: {
        used: monthlyUsage + 1,
        limit: limits.maxAIGenerationsPerMonth
      }
    });

  } catch (error) {
    console.error('AI OKR Generation error:', error);
    await logSystem('ERROR', 'AI', 'OKR Generation failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

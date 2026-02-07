import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getPlanLimits, PlanType } from '@/lib/permissions';
import { logSystem } from '@/lib/system-log';
import { generateAI, isAIConfigured, AI_MODEL } from '@/lib/openai';

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

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const userRole = user?.role;
    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const limits = getPlanLimits(plan, userRole);

    // 2. Check Feature Access
    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan. Please upgrade.' }, { status: 403 });
        }
    }

    // 3. Rate Limiting
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

    // 4. Quota Enforcement
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

    // 5. Generate Content
    if (!isAIConfigured()) {
      // Mock fallback when API key is missing
      const generatedContent = `[${productType || 'Web App'} - ${tone || 'Standard'}] Generated description for "${label}".
This feature is critical for the ${productType || 'Web App'} platform.
It ensures that users can achieve their goals efficiently.

Acceptance Criteria:
1. Verify that ${label} works as expected.
2. Ensure error states are handled.
3. Validate performance under load.`;

      await prisma.aIUsageLog.create({
        data: {
          teamId: team.id,
          action: 'generate_user_story_mock',
          inputTokens: 0,
          outputTokens: 0,
          model: 'mock',
        },
      });

      return NextResponse.json({
        content: generatedContent,
        warning: 'Using demo data. Configure GEMINI_API_KEY for real AI generation.',
        usage: { used: monthlyUsage + 1, limit: limits.maxAIGenerationsPerMonth }
      });
    }

    try {
      const systemPrompt = `You are an expert Product Manager and UX Writer.
Generate a detailed user story description for a software feature.
The output should be professional and actionable, written in the style appropriate for a ${productType || 'Web App'} with a ${tone || 'Standard'} tone.

Include:
- A clear description of the feature/user story
- Acceptance criteria (3-5 items)
- Edge cases to consider
- Any relevant technical notes

Output plain text, not JSON or Markdown code blocks.`;

      const userPrompt = `Project: ${project.name}
Feature/User Story: ${label}
${currentDescription ? `Current Description: ${currentDescription}` : ''}
Product Type: ${productType || 'Web App'}
Tone: ${tone || 'Standard'}

Generate a comprehensive user story description.`;

      const aiResponse = await generateAI(systemPrompt, userPrompt, { temperature: 0.7 });

      // Log Usage
      await prisma.aIUsageLog.create({
        data: {
          teamId: team.id,
          action: 'generate_user_story',
          inputTokens: aiResponse.usage.inputTokens,
          outputTokens: aiResponse.usage.outputTokens,
          model: AI_MODEL,
        },
      });

      return NextResponse.json({
        content: aiResponse.text,
        usage: { used: monthlyUsage + 1, limit: limits.maxAIGenerationsPerMonth }
      });

    } catch (aiError) {
      console.error('AI Generation Error:', aiError);
      await logSystem('ERROR', 'AI', 'Failed to generate user story', { error: String(aiError) });
      return NextResponse.json({ error: 'Failed to generate content. Please try again later.' }, { status: 500 });
    }

  } catch (error) {
    console.error('AI Generation error:', error);
    await logSystem('ERROR', 'AI', 'Generation failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

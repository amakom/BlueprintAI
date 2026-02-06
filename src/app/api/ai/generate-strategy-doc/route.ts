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

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const userRole = user?.role;

    const { projectId, description } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

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

    if (team.aiBlocked) {
      await logSystem('WARN', 'AI', 'Blocked team attempted generation', { teamId: team.id, userId: session.userId });
      return NextResponse.json({ error: 'AI generation has been temporarily disabled for your team. Please contact support.' }, { status: 403 });
    }

    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const limits = getPlanLimits(plan, userRole);

    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan. Please upgrade.' }, { status: 403 });
        }
    }

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

    const contextDescription = description || project.description || "A new innovative product";

    if (!isAIConfigured()) {
      // Mock Fallback
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockDoc = `
# Product Strategy: ${project.name}

## Executive Summary
${contextDescription} This product aims to revolutionize the market by providing a seamless and integrated experience for users.

## Vision Statement
To become the leading platform in the industry, empowering users to achieve more with less effort.

## Target Market
- Small to Medium Businesses (SMBs)
- Enterprise Clients looking for scalability
- Tech-savvy professionals

## Value Proposition
1. **Efficiency**: Streamline workflows and reduce manual overhead.
2. **Scalability**: Grow with your business needs.
3. **Integration**: Works seamlessly with existing tools.

## Key Features
- Real-time collaboration
- AI-powered insights
- Advanced analytics dashboard

## Go-to-Market Strategy
- Content marketing via blog and social media.
- Strategic partnerships with key industry players.
- Free tier to drive adoption and product-led growth.
      `.trim();

      await prisma.aIUsageLog.create({
        data: {
          teamId: team.id,
          action: 'GENERATE_STRATEGY_DOC',
          inputTokens: 0,
          outputTokens: 0,
          model: 'mock',
        },
      });

      return NextResponse.json({ doc: { text: mockDoc } });
    }

    // Real AI Generation
    const systemPrompt = "You are an expert Product Manager. Generate a comprehensive Product Strategy Document in Markdown format. The output must be a JSON object with a single key 'text' containing the Markdown string. The document should include sections: Executive Summary, Vision Statement, Target Market, Value Proposition, Key Features, and Go-to-Market Strategy.";
    const userPrompt = `Project Name: ${project.name}\nDescription: ${contextDescription}\n\nGenerate the strategy document.`;

    const aiResponse = await generateAI(systemPrompt, userPrompt, { jsonMode: true });
    const result = JSON.parse(aiResponse.text);

    // Log AI Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'GENERATE_STRATEGY_DOC',
        inputTokens: aiResponse.usage.inputTokens,
        outputTokens: aiResponse.usage.outputTokens,
        model: aiResponse.usage.model,
      },
    });

    return NextResponse.json({ doc: result });

  } catch (error) {
    console.error('Error generating strategy doc:', error);

    let errorMsg = error instanceof Error ? error.message : 'Unknown AI error';
    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        errorMsg = "AI API quota exceeded. Please try again later.";
    }

    return NextResponse.json({ error: `AI Generation Failed: ${errorMsg}` }, { status: 500 });
  }
}

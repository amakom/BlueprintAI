import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getPlanLimits, PlanType } from '@/lib/permissions';
import { openai, isAIConfigured } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId, prompt, context } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          include: { subscription: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const team = project.team;

    if (team.aiBlocked) {
      return NextResponse.json({ error: 'AI generation has been temporarily disabled for your team.' }, { status: 403 });
    }

    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const limits = getPlanLimits(plan, user?.role);

    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
      return NextResponse.json({ error: 'AI generation is not available on your plan.' }, { status: 403 });
    }

    // Rate Limiting
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentRequests = await prisma.aIUsageLog.count({
      where: { teamId: team.id, createdAt: { gte: oneMinuteAgo } },
    });

    if (recentRequests >= 20) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    if (!isAIConfigured()) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 });
    }

    const systemPrompt = `You are BlueprintAI, an expert AI planning assistant for software products.

Your job is to help users plan their projects BEFORE they start coding. When a user describes what they want to build, you should ask smart clarifying questions to understand scope, users, and requirements better.

Generate 2-4 focused clarifying questions that will help produce a better plan. Each question should:
- Have a clear, specific question text
- Provide 2-4 concrete answer options the user can pick from
- Focus on aspects that will significantly impact the blueprint (target users, platform, core features, monetization, etc.)

Output Format (strict JSON):
{
  "message": "Brief acknowledgment of their idea (1-2 sentences)",
  "questions": [
    {
      "id": "q1",
      "question": "The question text",
      "options": [
        { "label": "Option 1", "value": "option_1" },
        { "label": "Option 2", "value": "option_2" }
      ]
    }
  ]
}

Rules:
- Keep questions practical and product-focused
- Options should cover common real scenarios
- Focus on decisions that affect architecture, user flows, or tech stack
- Always include questions about target users and core features
- Be specific, not generic`;

    const userPrompt = `Project: ${project.name}
${project.description ? `Description: ${project.description}` : ''}
User's request: ${prompt}
${context ? `Previous context: ${JSON.stringify(context)}` : ''}

Generate clarifying questions to help plan this better.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Log usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'ask_clarifying_questions',
        inputTokens: completion.usage?.prompt_tokens || 0,
        outputTokens: completion.usage?.completion_tokens || 0,
        model: completion.model,
      },
    });

    return NextResponse.json({
      message: result.message || "Let me ask a few questions to build a better plan.",
      questions: result.questions || [],
    });

  } catch (error) {
    console.error('Ask Questions API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

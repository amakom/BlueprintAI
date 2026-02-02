import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getPlanLimits, PlanType } from '@/lib/permissions';
import { logSystem } from '@/lib/system-log';
import { openai, isAIConfigured } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to get global role (for God Mode access)
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const userRole = user?.role;

    const { projectId, prompt } = await req.json();

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
      return NextResponse.json({ error: 'AI generation has been temporarily disabled for your team.' }, { status: 403 });
    }

    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const limits = getPlanLimits(plan, userRole);

    // 2. Check Feature Access
    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan.' }, { status: 403 });
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
      return NextResponse.json({ 
        error: `Monthly AI limit reached (${monthlyUsage}/${limits.maxAIGenerationsPerMonth}). Please upgrade.` 
      }, { status: 403 });
    }

    // 5. Generate User Flow (Real AI Only)
    let nodes: any[] = [];
    let edges: any[] = [];
    let usageLog = { inputTokens: 0, outputTokens: 0, model: 'unknown' };

    if (!isAIConfigured()) {
        return NextResponse.json({ error: 'OPENAI_API_KEY is not configured in environment variables.' }, { status: 500 });
    }

    try {
        const systemPrompt = `You are an expert UX Designer and Product Manager.
Create a user flow diagram for a software feature.

Node Types:
- 'userStory': Represents a user action, step, or decision.
- 'screen': Represents a visible UI screen or page.

Output Format (JSON):
{
  "nodes": [
    { "id": "string", "type": "userStory" | "screen", "label": "string", "description": "string", "x": number, "y": number }
  ],
  "edges": [
    { "source": "nodeId", "target": "nodeId", "label": "optional label" }
  ]
}

Layout Rules:
- Arrange nodes from left to right.
- Start at x=100, y=100.
- Space nodes horizontally by roughly 300px.
- Keep the flow logical and linear where possible, branching if necessary.
- Provide unique string IDs for each node.
`;

        const userPrompt = `Project: ${project.name}
Request: ${prompt}

Generate a detailed user flow including key screens and user actions.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');
        
        // Transform to React Flow format
        nodes = (result.nodes || []).map((n: any) => ({
          id: n.id,
          type: n.type,
          position: { x: n.x || 0, y: n.y || 0 },
          data: { label: n.label, description: n.description, userName: 'AI' }
        }));

        edges = (result.edges || []).map((e: any) => ({
          id: `e${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: 'deletable',
          animated: true
        }));
        
        usageLog = {
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
          model: completion.model
        };

    } catch (aiError) {
        console.error('OpenAI generation failed:', aiError);
        const errorMsg = aiError instanceof Error ? aiError.message : 'Unknown AI error';
        return NextResponse.json({ error: `AI Generation Failed: ${errorMsg}` }, { status: 500 });
    }

    // 6. Log Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'generate_user_flow',
        inputTokens: usageLog.inputTokens,
        outputTokens: usageLog.outputTokens,
        model: usageLog.model,
      },
    });

    return NextResponse.json({ 
      nodes, 
      edges, 
      usage: {
        used: monthlyUsage + 1,
        limit: limits.maxAIGenerationsPerMonth
      }
    });

  } catch (error) {
    console.error('AI User Flow Generation error:', error);
    await logSystem('ERROR', 'AI', 'User Flow Generation failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

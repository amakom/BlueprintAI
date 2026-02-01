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

    // 5. "Generate" User Flow (Mock)
    // Create a simple flow: Start -> User Story -> Screen -> End
    const startId = Math.random().toString(36).substr(2, 9);
    const storyId = Math.random().toString(36).substr(2, 9);
    const screenId = Math.random().toString(36).substr(2, 9);
    
    const mockNodes = [
      {
        id: startId,
        type: 'userStory',
        position: { x: 100, y: 100 },
        data: { label: 'Start: User logs in', description: 'User opens the app and enters credentials', userName: 'AI' }
      },
      {
        id: storyId,
        type: 'userStory',
        position: { x: 400, y: 100 },
        data: { label: 'Action: Authenticate', description: 'System validates credentials against database', userName: 'AI' }
      },
      {
        id: screenId,
        type: 'screen',
        position: { x: 400, y: 300 },
        data: { label: 'Dashboard Screen', description: 'Main user dashboard with overview metrics', userName: 'AI' }
      }
    ];

    const mockEdges = [
      { id: `e${startId}-${storyId}`, source: startId, target: storyId, type: 'deletable', animated: true },
      { id: `e${storyId}-${screenId}`, source: storyId, target: screenId, type: 'deletable', animated: true }
    ];

    // 6. Log Usage
    await prisma.aIUsageLog.create({
      data: {
        teamId: team.id,
        action: 'generate_user_flow',
        inputTokens: 150,
        outputTokens: 500,
        model: 'gpt-mock-flow',
      },
    });

    return NextResponse.json({ 
      nodes: mockNodes,
      edges: mockEdges,
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

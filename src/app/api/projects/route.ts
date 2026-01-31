import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { PLAN_LIMITS, PlanType } from '@/lib/permissions';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name = 'Untitled Project', description, type, aiPrompt } = await req.json();

    // Find user's first team (for now)
    const membership = await prisma.teamMember.findFirst({
      where: { userId: session.userId },
      include: { team: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'No team found. Please create a team first.' },
        { status: 400 }
      );
    }

    // Enforce Plan Limits
    const subscription = await prisma.subscription.findUnique({
        where: { teamId: membership.teamId }
    });

    const plan = (subscription?.plan as PlanType) || PlanType.FREE;
    const limits = PLAN_LIMITS[plan];

    if (limits.maxProjects !== Infinity) {
        const projectCount = await prisma.project.count({
            where: { teamId: membership.teamId }
        });
        
        if (projectCount >= limits.maxProjects) {
            return NextResponse.json(
                { error: `Plan limit reached. Upgrade to create more projects.` },
                { status: 403 }
            );
        }
    }

    // Append metadata to description if provided
    let finalDescription = description || '';
    if (type) finalDescription += `\n\n[Type: ${type}]`;
    if (aiPrompt) finalDescription += `\n[AI Prompt: ${aiPrompt}]`;

    // Create Project and Initial Document in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          name,
          description: finalDescription.trim(),
          teamId: membership.teamId,
        },
      });

      // Generate initial content based on AI prompt
      let initialContent = { nodes: [], edges: [] };
      
      if (aiPrompt) {
        // Simple heuristic for "AI generation" since we don't have the LLM backend connected here
        // In a real implementation, this would call the AI service
        initialContent = {
          nodes: [
            {
              id: 'ai-1',
              type: 'userStory',
              position: { x: 100, y: 100 },
              data: { 
                title: 'User Registration', 
                role: 'User', 
                goal: 'create an account', 
                benefit: 'access the platform' 
              }
            },
            {
              id: 'ai-2',
              type: 'userStory',
              position: { x: 500, y: 100 },
              data: { 
                title: 'Login', 
                role: 'User', 
                goal: 'log in securely', 
                benefit: 'access my data' 
              }
            },
            {
              id: 'ai-3',
              type: 'userStory',
              position: { x: 300, y: 300 },
              data: { 
                title: 'Core Feature', 
                role: 'User', 
                goal: 'use the main feature', 
                benefit: 'solve my problem' 
              }
            }
          ],
          edges: [
            { id: 'e1-2', source: 'ai-1', target: 'ai-2', animated: true },
            { id: 'e2-3', source: 'ai-2', target: 'ai-3', animated: true }
          ]
        } as any;
      }

      // Create default Canvas document
      await tx.document.create({
        data: {
          title: 'Project Canvas',
          type: 'CANVAS',
          content: initialContent,
          projectId: project.id,
          authorId: session.userId,
        },
      });

      return project;
    });

    return NextResponse.json({ success: true, project: result });
  } catch (error) {
    console.error('Create Project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user's team memberships
    const memberships = await prisma.teamMember.findMany({
      where: { userId: session.userId },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);

    const projects = await prisma.project.findMany({
      where: {
        teamId: { in: teamIds },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        team: { select: { name: true } },
        _count: { select: { documents: true } },
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Fetch Projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project to find teamId
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      select: { teamId: true },
    });

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check membership
    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: session.userId,
          teamId: project.teamId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this project\'s team' }, { status: 403 });
    }

    const logs = await prisma.activityLog.findMany({
      where: { projectId: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 recent events
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Get Activity Log error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

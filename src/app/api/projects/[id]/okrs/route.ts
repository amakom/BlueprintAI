import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const projectId = id;
    const { okrs } = await req.json();

    if (!okrs || !Array.isArray(okrs)) {
      return NextResponse.json({ error: 'Invalid OKRs data' }, { status: 400 });
    }

    // Verify project access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is member of the team
    const isMember = project.team.members.some(m => m.userId === session.userId);
    if (!isMember && session.role !== 'ADMIN' && session.role !== 'OWNER') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create OKRs in transaction
    const createdOKRs = await prisma.$transaction(
      okrs.map((okr: any) => 
        prisma.oKR.create({
          data: {
            projectId,
            objective: okr.objective,
            keyResults: okr.keyResults, // Prisma handles Json
            status: 'DRAFT',
          },
        })
      )
    );

    return NextResponse.json({ okrs: createdOKRs });
  } catch (error) {
    console.error('Failed to save OKRs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const projectId = id;

    const okrs = await prisma.oKR.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ okrs });
  } catch (error) {
    console.error('Failed to fetch OKRs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

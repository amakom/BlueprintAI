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
    const { competitors } = await req.json();

    if (!competitors || !Array.isArray(competitors)) {
      return NextResponse.json({ error: 'Invalid Competitors data' }, { status: 400 });
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

    // Create Competitors in transaction
    const createdCompetitors = await prisma.$transaction(
      competitors.map((comp: any) => 
        prisma.competitor.create({
          data: {
            projectId,
            name: comp.name,
            website: comp.website,
            strengths: comp.strengths || [],
            weaknesses: comp.weaknesses || [],
          },
        })
      )
    );

    return NextResponse.json({ competitors: createdCompetitors });
  } catch (error) {
    console.error('Failed to save Competitors:', error);
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

    const competitors = await prisma.competitor.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ competitors });
  } catch (error) {
    console.error('Failed to fetch Competitors:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

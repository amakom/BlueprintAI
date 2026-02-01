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
    const { kpis } = await req.json();

    if (!kpis || !Array.isArray(kpis)) {
      return NextResponse.json({ error: 'Invalid KPIs data' }, { status: 400 });
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

    // Create KPIs in transaction
    const createdKPIs = await prisma.$transaction(
      kpis.map((kpi: any) => 
        prisma.kPI.create({
          data: {
            projectId,
            name: kpi.name,
            target: kpi.target,
            status: kpi.status || 'ON_TRACK',
          },
        })
      )
    );

    return NextResponse.json({ kpis: createdKPIs });
  } catch (error) {
    console.error('Failed to save KPIs:', error);
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

    const kpis = await prisma.kPI.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ kpis });
  } catch (error) {
    console.error('Failed to fetch KPIs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

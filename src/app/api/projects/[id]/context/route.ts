import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { DocType } from '@prisma/client';

// GET /api/projects/[id]/context — fetch ALL project data for AI agent export
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: { include: { members: true } },
        personas: { orderBy: { createdAt: 'asc' } },
        okrs: { orderBy: { createdAt: 'asc' } },
        kpis: { orderBy: { createdAt: 'asc' } },
        competitors: { orderBy: { createdAt: 'asc' } },
        strategyDocs: { take: 1, orderBy: { updatedAt: 'desc' } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember = project.team.members.some(m => m.userId === session.userId);
    if (!isMember && session.role !== 'ADMIN' && session.role !== 'OWNER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch canvas data
    const canvasDoc = await prisma.document.findFirst({
      where: { projectId, type: DocType.CANVAS },
    });

    // Fetch spec data
    const specDoc = await prisma.document.findFirst({
      where: { projectId, type: DocType.SPEC },
    });

    return NextResponse.json({
      project: {
        name: project.name,
        description: project.description,
      },
      personas: project.personas,
      okrs: project.okrs,
      kpis: project.kpis,
      competitors: project.competitors,
      strategyDoc: project.strategyDocs[0] || null,
      canvas: canvasDoc?.content || null,
      spec: specDoc?.content || null,
    });
  } catch (error) {
    console.error('Context export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

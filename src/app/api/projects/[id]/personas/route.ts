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
    const { personas } = await req.json();

    if (!personas || !Array.isArray(personas)) {
      return NextResponse.json({ error: 'Invalid Personas data' }, { status: 400 });
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

    // Create Personas in transaction
    const createdPersonas = await prisma.$transaction(
      personas.map((persona: any) => 
        prisma.persona.create({
          data: {
            projectId,
            name: persona.name,
            role: persona.role,
            bio: persona.bio,
            goals: persona.goals,
            frustrations: persona.frustrations,
            imageUrl: persona.imageUrl,
          },
        })
      )
    );

    return NextResponse.json({ personas: createdPersonas });
  } catch (error) {
    console.error('Failed to save Personas:', error);
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

    const personas = await prisma.persona.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ personas });
  } catch (error) {
    console.error('Failed to fetch Personas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

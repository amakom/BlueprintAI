import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember = project.team.members.some(m => m.userId === session.userId);
    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const specDoc = await prisma.document.findFirst({
      where: {
        projectId,
        type: 'SPEC'
      }
    });

    return NextResponse.json({ spec: specDoc });
  } catch (error) {
    console.error('Error fetching spec:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projectId = params.id;

  try {
    const { content } = await req.json(); // content should be { markdown: string }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const isMember = project.team.members.some(m => m.userId === session.userId);
    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upsert Spec Document
    const existingSpec = await prisma.document.findFirst({
      where: { projectId, type: 'SPEC' }
    });

    let specDoc;
    if (existingSpec) {
      specDoc = await prisma.document.update({
        where: { id: existingSpec.id },
        data: { content, updatedAt: new Date() }
      });
    } else {
      specDoc = await prisma.document.create({
        data: {
          title: 'Engineering Spec',
          type: 'SPEC',
          content,
          projectId,
          authorId: session.userId,
        }
      });
    }

    return NextResponse.json({ spec: specDoc });
  } catch (error) {
    console.error('Error saving spec:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

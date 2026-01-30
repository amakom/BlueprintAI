import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { DocType } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find or create the CANVAS document for this project
    let document = await prisma.document.findFirst({
      where: {
        projectId: params.id,
        type: DocType.CANVAS,
      },
    });

    if (!document) {
      // Verify project access first
      const project = await prisma.project.findUnique({
        where: { id: params.id },
      });
      
      if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      
      const membership = await prisma.teamMember.findFirst({
        where: { userId: session.userId, teamId: project.teamId },
      });

      if (!membership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

      // Create default canvas doc
      document = await prisma.document.create({
        data: {
          title: 'Main Canvas',
          type: DocType.CANVAS,
          projectId: params.id,
          authorId: session.userId,
          content: { nodes: [], edges: [] },
        },
      });
    }

    return NextResponse.json({ success: true, content: document.content });
  } catch (error) {
    console.error('Get Canvas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { nodes, edges } = await req.json();

    // Verify access
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    const membership = await prisma.teamMember.findFirst({
      where: { userId: session.userId, teamId: project.teamId },
    });

    if (!membership) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Update document
    const document = await prisma.document.findFirst({
      where: { projectId: params.id, type: DocType.CANVAS },
    });

    if (document) {
      await prisma.document.update({
        where: { id: document.id },
        data: { content: { nodes, edges } },
      });
    } else {
       await prisma.document.create({
        data: {
          title: 'Main Canvas',
          type: DocType.CANVAS,
          projectId: params.id,
          authorId: session.userId,
          content: { nodes, edges },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save Canvas error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

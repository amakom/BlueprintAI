import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Check access
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          members: true
        }
      },
      strategyDocs: {
        take: 1,
        orderBy: { updatedAt: 'desc' }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const isMember = project.team.members.some(m => m.userId === session.userId);
  if (!isMember) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Return the most recent doc or null
  const doc = project.strategyDocs[0] || null;

  return NextResponse.json({ doc });
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const { content, title } = await req.json();

  // Check access
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      team: {
        include: {
          members: true
        }
      }
    }
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const isMember = project.team.members.some(m => m.userId === session.userId);
  if (!isMember) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Create or Update. Since we usually have one main doc, we can upsert or just create new versions.
  // For simplicity, let's just create a new one for now (version history style) or update the latest.
  // Let's find the existing one and update it, or create if none.
  
  const existingDoc = await prisma.strategyDoc.findFirst({
    where: { projectId: id },
    orderBy: { updatedAt: 'desc' }
  });

  let doc;
  if (existingDoc) {
    doc = await prisma.strategyDoc.update({
      where: { id: existingDoc.id },
      data: {
        content: content, // content is Json
        title: title || existingDoc.title
      }
    });
  } else {
    doc = await prisma.strategyDoc.create({
      data: {
        projectId: id,
        title: title || 'Product Strategy',
        content: content || {}
      }
    });
  }

  return NextResponse.json({ doc });
}

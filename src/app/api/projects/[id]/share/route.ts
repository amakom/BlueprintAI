import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Verify access to project
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { team: { include: { members: true } } },
  });

  if (!project) {
    return new NextResponse('Project not found', { status: 404 });
  }

  const isMember = project.team.members.some(
    (m) => m.userId === session.userId
  );
  if (!isMember) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const shareLink = await prisma.shareLink.findUnique({
    where: { projectId: params.id },
  });

  return NextResponse.json(shareLink || { token: null });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Verify access
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { team: { include: { members: true } } },
  });

  if (!project) {
    return new NextResponse('Project not found', { status: 404 });
  }

  const member = project.team.members.find((m) => m.userId === session.userId);
  if (!member || (member.role === 'VIEWER')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Generate new token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const shareLink = await prisma.shareLink.upsert({
    where: { projectId: params.id },
    create: {
      projectId: params.id,
      token,
    },
    update: {
      token,
      createdAt: new Date(),
    },
  });

  return NextResponse.json(shareLink);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session?.userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { team: { include: { members: true } } },
  });

  if (!project) {
    return new NextResponse('Project not found', { status: 404 });
  }

  const member = project.team.members.find((m) => m.userId === session.userId);
  if (!member || (member.role === 'VIEWER')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  await prisma.shareLink.delete({
    where: { projectId: params.id },
  });

  return new NextResponse(null, { status: 204 });
}

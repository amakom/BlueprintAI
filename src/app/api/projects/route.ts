import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name = 'Untitled Project', description } = await req.json();

    // Find user's first team (for now)
    const membership = await prisma.teamMember.findFirst({
      where: { userId: session.userId },
      include: { team: true },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'No team found. Please create a team first.' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        teamId: membership.teamId,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Create Project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user's team memberships
    const memberships = await prisma.teamMember.findMany({
      where: { userId: session.userId },
      select: { teamId: true },
    });

    const teamIds = memberships.map((m) => m.teamId);

    const projects = await prisma.project.findMany({
      where: {
        teamId: { in: teamIds },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        team: { select: { name: true } },
        _count: { select: { documents: true } },
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('List Projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { TeamRole } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role = 'VIEWER' } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check permissions
    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: session.userId,
          teamId: params.teamId,
        },
      },
    });

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        user: { email },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 });
    }

    // Check pending invitation
    const existingInvite = await prisma.teamInvitation.findUnique({
      where: {
        teamId_email: {
          teamId: params.teamId,
          email,
        },
      },
    });

    if (existingInvite) {
        return NextResponse.json({ error: 'Invitation already pending' }, { status: 409 });
    }

    // Create Invitation
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.teamInvitation.create({
      data: {
        teamId: params.teamId,
        email,
        role: role as TeamRole,
        token,
        expires,
        inviterId: session.userId,
      },
    });

    // TODO: Send email
    console.log(`[Email Service] Invitation sent to ${email} with token ${token}`);

    return NextResponse.json(invitation);

  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
    req: Request,
    { params }: { params: { teamId: string } }
) {
    // List invitations
     try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permissions
    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: session.userId,
          teamId: params.teamId,
        },
      },
    });

    if (!membership || (membership.role !== 'OWNER' && membership.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const invitations = await prisma.teamInvitation.findMany({
        where: { teamId: params.teamId },
        orderBy: { createdAt: 'desc' },
        include: { inviter: { select: { name: true, email: true } } }
    });

    return NextResponse.json(invitations);

     } catch (error) {
    console.error('Get Invites error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

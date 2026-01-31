import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check membership
    const membership = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: session.userId,
          teamId: params.teamId,
        },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 });
    }

    const members = await prisma.teamMember.findMany({
      where: { teamId: params.teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Get Members error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { teamId: string } }
) {
    // Remove member (or leave team)
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');

        if (!memberId) {
             return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
        }

        // Check requester permissions
        const requester = await prisma.teamMember.findUnique({
            where: {
                userId_teamId: {
                    userId: session.userId,
                    teamId: params.teamId,
                },
            },
        });

        if (!requester) {
            return NextResponse.json({ error: 'Not a member' }, { status: 403 });
        }

        const targetMember = await prisma.teamMember.findUnique({
            where: { id: memberId },
        });

        if (!targetMember) {
             return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        // Logic:
        // 1. User can remove themselves (Leave team) - unless they are the last OWNER
        // 2. OWNER/ADMIN can remove others (lower rank)
        
        const isSelf = targetMember.userId === session.userId;
        
        if (!isSelf) {
             if (requester.role !== 'OWNER' && requester.role !== 'ADMIN') {
                 return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
             }
             if (requester.role === 'ADMIN' && targetMember.role === 'OWNER') {
                 return NextResponse.json({ error: 'Cannot remove owner' }, { status: 403 });
             }
        } else {
            // Leaving team
            if (targetMember.role === 'OWNER') {
                // Check if there are other owners
                const ownersCount = await prisma.teamMember.count({
                    where: { teamId: params.teamId, role: 'OWNER' }
                });
                if (ownersCount <= 1) {
                     return NextResponse.json({ error: 'Cannot leave as the only owner. Transfer ownership first.' }, { status: 400 });
                }
            }
        }

        await prisma.teamMember.delete({
            where: { id: memberId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Member error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

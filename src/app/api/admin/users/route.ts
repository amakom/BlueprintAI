import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            createdDocs: true,
            teamMembers: true,
          }
        },
        teamMembers: {
            take: 1,
            include: {
                team: {
                    include: {
                        subscription: true
                    }
                }
            }
        }
      },
    });

    // Flatten data for table
    const formattedUsers = users.map(user => ({
        ...user,
        plan: user.teamMembers[0]?.team?.subscription?.plan || 'FREE',
        subscriptionStatus: user.teamMembers[0]?.team?.subscription?.status || 'NONE',
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

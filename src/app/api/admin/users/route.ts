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
                        subscription: true,
                        _count: {
                            select: {
                                projects: true,
                                aiUsageLogs: true
                            }
                        }
                    }
                }
            }
        }
      },
    });

    // Flatten data for table
    const formattedUsers = users.map(user => {
        const primaryTeam = user.teamMembers[0]?.team;
        return {
            ...user,
            plan: primaryTeam?.subscription?.plan || 'FREE',
            subscriptionStatus: primaryTeam?.subscription?.status || 'NONE',
            projectCount: primaryTeam?._count.projects || 0,
            aiUsageCount: primaryTeam?._count.aiUsageLogs || 0,
        };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

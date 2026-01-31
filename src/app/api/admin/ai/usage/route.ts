
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET() {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    // 1. Total Stats
    const totalRequests = await prisma.aIUsageLog.count();
    const totalTokens = await prisma.aIUsageLog.aggregate({
      _sum: {
        inputTokens: true,
        outputTokens: true,
      }
    });

    // 2. Recent Usage Logs
    const recentLogs = await prisma.aIUsageLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        team: {
          select: { name: true }
        }
      }
    });

    // 3. Usage by Team (Top 10) - This requires grouping which Prisma supports
    const teamUsage = await prisma.aIUsageLog.groupBy({
      by: ['teamId'],
      _count: {
        _all: true,
      },
      _sum: {
        inputTokens: true,
        outputTokens: true,
      },
      orderBy: {
        _count: {
          teamId: 'desc'
        }
      },
      take: 10
    });

    // Fetch team names for the grouped data
    const teamIds = teamUsage.map(t => t.teamId);
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
      select: { id: true, name: true }
    });

    const formattedTeamUsage = teamUsage.map(usage => {
      const team = teams.find(t => t.id === usage.teamId);
      return {
        teamId: usage.teamId,
        teamName: team?.name || 'Unknown',
        requests: usage._count._all,
        totalTokens: (usage._sum.inputTokens || 0) + (usage._sum.outputTokens || 0)
      };
    });

    return NextResponse.json({
      stats: {
        requests: totalRequests,
        tokens: (totalTokens._sum.inputTokens || 0) + (totalTokens._sum.outputTokens || 0),
      },
      recentLogs: recentLogs.map(log => ({
        id: log.id,
        teamName: log.team.name,
        action: log.action,
        model: log.model,
        tokens: log.inputTokens + log.outputTokens,
        createdAt: log.createdAt,
      })),
      topTeams: formattedTeamUsage
    });

  } catch (error) {
    console.error('Admin AI usage error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

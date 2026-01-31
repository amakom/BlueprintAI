import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalUsers, 
        totalProjects, 
        revenueToday,
        revenueMonth,
        recentSignups,
        recentErrors,
        activeUsers7d,
        activeUsers30d,
        aiCallsToday
    ] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { 
                status: 'successful',
                createdAt: { gte: startOfDay }
            }
        }),
        prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { 
                status: 'successful',
                createdAt: { gte: startOfMonth }
            }
        }),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true, email: true, createdAt: true }
        }),
        prisma.systemLog.count({
            where: {
                level: 'ERROR',
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                }
            }
        }),
        // Active users based on AuditLog activity
        prisma.auditLog.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: sevenDaysAgo },
                userId: { not: null }
            }
        }),
        prisma.auditLog.groupBy({
            by: ['userId'],
            where: {
                createdAt: { gte: thirtyDaysAgo },
                userId: { not: null }
            }
        }),
        prisma.aIUsageLog.count({
            where: {
                createdAt: { gte: startOfDay }
            }
        })
    ]);

    return NextResponse.json({
        totalUsers,
        totalProjects,
        revenueToday: revenueToday._sum.amount || 0,
        revenueMonth: revenueMonth._sum.amount || 0,
        aiCallsToday,
        activeUsers7d: activeUsers7d.length,
        activeUsers30d: activeUsers30d.length,
        recentErrors,
        recentSignups
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

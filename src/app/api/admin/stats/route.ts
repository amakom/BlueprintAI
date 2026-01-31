import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const [
        totalUsers, 
        totalProjects, 
        totalRevenue, // This requires aggregation on invoices
        recentSignups,
        recentErrors
    ] = await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { status: 'successful' } // Assuming 'successful' is the status string from Flutterwave
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
        })
    ]);

    // AI Usage Stats (Mock or real aggregation)
    // Since we don't have AIUsageLog populated yet, we'll just count rows if any
    const totalAIRequests = await prisma.aIUsageLog.count();

    return NextResponse.json({
        totalUsers,
        totalProjects,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalAIRequests,
        recentErrors,
        recentSignups
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

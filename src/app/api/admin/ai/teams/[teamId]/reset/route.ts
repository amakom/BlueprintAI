import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';
import { logAudit } from '@/lib/audit';

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Delete logs for this team in current month
    const deleted = await prisma.aIUsageLog.deleteMany({
      where: {
        teamId: params.teamId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    await logAudit({
      userId: session.userId,
      action: 'reset_ai_usage',
      resource: 'admin_ai',
      metadata: { teamId: params.teamId, count: deleted.count }
    });

    return NextResponse.json({ success: true, deletedCount: deleted.count });
  } catch (error) {
    console.error('Admin reset AI error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

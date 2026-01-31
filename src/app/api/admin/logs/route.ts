import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const [systemLogs, webhookLogs, auditLogs] = await Promise.all([
        prisma.systemLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        }),
        prisma.webhookLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        }),
        prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: { select: { email: true } }
            }
        })
    ]);

    return NextResponse.json({ systemLogs, webhookLogs, auditLogs });
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

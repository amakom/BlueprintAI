import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { teamId, plan, status } = await req.json();

    if (!teamId || !plan) {
        return NextResponse.json({ error: 'Team ID and Plan are required' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { subscription: true }
    });

    if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });

    let subscription = team.subscription;

    if (subscription) {
        subscription = await prisma.subscription.update({
            where: { id: subscription.id },
            data: { plan, status: status || 'ACTIVE', updatedAt: new Date() }
        });
    } else {
        subscription = await prisma.subscription.create({
            data: {
                teamId,
                plan,
                status: status || 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });
    }

    await logAudit({
      userId: session.userId,
      action: 'manual_plan_grant',
      resource: 'admin_billing',
      metadata: { teamId, plan, status }
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('Grant plan error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

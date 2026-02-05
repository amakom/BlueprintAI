import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { SubscriptionStatus, PlanType } from '@prisma/client';
import { logAudit } from '@/lib/audit';
import { logSystem } from '@/lib/system-log';
import { z } from 'zod';

const cancelSchema = z.object({
  teamId: z.string().min(1, 'Team ID is required'),
  cancelAtPeriodEnd: z.boolean().optional().default(true), // Cancel at end of period by default
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = cancelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { teamId, cancelAtPeriodEnd } = validation.data;

    // Verify user is team owner or admin
    const membership = await prisma.teamMember.findFirst({
      where: {
        userId: session.userId,
        teamId,
        role: { in: ['OWNER', 'ADMIN'] },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'You must be a team owner or admin to cancel the subscription' }, { status: 403 });
    }

    // Get current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { teamId },
    });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      return NextResponse.json({ error: 'Subscription is already cancelled' }, { status: 400 });
    }

    if (subscription.plan === PlanType.FREE) {
      return NextResponse.json({ error: 'Cannot cancel a free plan' }, { status: 400 });
    }

    // Update subscription
    if (cancelAtPeriodEnd) {
      // Cancel at end of billing period - user keeps access until then
      await prisma.subscription.update({
        where: { teamId },
        data: {
          cancelAtPeriodEnd: true,
        },
      });

      await logAudit({
        userId: session.userId,
        action: 'cancel_subscription',
        resource: 'billing',
        metadata: { teamId, cancelAtPeriodEnd: subscription.currentPeriodEnd, scheduled: true },
      });

      await logSystem('INFO', 'BILLING', 'Subscription scheduled for cancellation', {
        teamId,
        cancelAt: subscription.currentPeriodEnd,
      });

      return NextResponse.json({
        success: true,
        message: `Your subscription will be cancelled on ${subscription.currentPeriodEnd?.toLocaleDateString()}. You will retain access until then.`,
        cancelAt: subscription.currentPeriodEnd,
      });
    } else {
      // Immediate cancellation - downgrade to free plan
      await prisma.subscription.update({
        where: { teamId },
        data: {
          status: SubscriptionStatus.CANCELLED,
          plan: PlanType.FREE,
          cancelAtPeriodEnd: false,
        },
      });

      await logAudit({
        userId: session.userId,
        action: 'cancel_subscription',
        resource: 'billing',
        metadata: { teamId, immediate: true },
      });

      await logSystem('INFO', 'BILLING', 'Subscription cancelled immediately', { teamId });

      return NextResponse.json({
        success: true,
        message: 'Your subscription has been cancelled and your account has been downgraded to the free plan.',
      });
    }
  } catch (error) {
    console.error('Cancel subscription error:', error);
    await logSystem('ERROR', 'BILLING', 'Failed to cancel subscription', {
      error: error instanceof Error ? error.message : 'Unknown',
    });
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}

// GET - Check cancellation status
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });
    }

    // Verify user is team member
    const membership = await prisma.teamMember.findFirst({
      where: {
        userId: session.userId,
        teamId,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { teamId },
      select: {
        status: true,
        plan: true,
        cancelAtPeriodEnd: true,
        currentPeriodEnd: true,
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({
      subscription: {
        ...subscription,
        willCancel: subscription.cancelAtPeriodEnd,
        cancelDate: subscription.cancelAtPeriodEnd ? subscription.currentPeriodEnd : null,
      },
    });
  } catch (error) {
    console.error('Get cancellation status error:', error);
    return NextResponse.json({ error: 'Failed to get subscription status' }, { status: 500 });
  }
}

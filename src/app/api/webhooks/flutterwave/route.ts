import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';
import { logSystem } from '@/lib/system-log';

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers.get('verif-hash');

  // Verify signature if secret hash is configured
  if (secretHash && signature !== secretHash) {
    await logSystem('WARN', 'BILLING', 'Invalid webhook signature', { signature });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { event, data } = body;

    console.log('Flutterwave Webhook received:', event);
    await logSystem('INFO', 'BILLING', `Webhook received: ${event}`, { eventType: event });

    if (event === 'charge.completed' && data.status === 'successful') {
      const { meta, customer, id, tx_ref } = data;
      const teamId = meta?.teamId;
      const planId = meta?.planId;

      if (teamId && planId) {
        let planEnum: PlanType = PlanType.FREE;
        if (planId === 'pro') planEnum = PlanType.PRO;
        if (planId === 'team') planEnum = PlanType.TEAM;
        if (planId === 'enterprise') planEnum = PlanType.ENTERPRISE;

        // Update subscription in database
        await prisma.subscription.upsert({
          where: { teamId },
          update: {
            status: SubscriptionStatus.ACTIVE,
            plan: planEnum,
            flutterwaveSubscriptionId: `${id}`, // Storing Transaction ID as ref
            flutterwaveCustomerId: `${customer.id}`,
            amount: data.amount,
            currency: data.currency === 'NGN' ? 'NGN' : 'USD',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Add 30 days
            updatedAt: new Date(),
          },
          create: {
            teamId,
            status: SubscriptionStatus.ACTIVE,
            plan: planEnum,
            flutterwaveSubscriptionId: `${id}`,
            flutterwaveCustomerId: `${customer.id}`,
            amount: data.amount,
            currency: data.currency === 'NGN' ? 'NGN' : 'USD',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        // Audit Log
        // Find user by email to associate log
        const user = await prisma.user.findUnique({ where: { email: customer.email } });
        await logAudit({
          userId: user?.id,
          action: 'invoice_paid',
          resource: 'billing',
          metadata: { teamId, planId, amount: data.amount, tx_ref },
        });

        await logSystem('INFO', 'BILLING', `Team upgraded via webhook`, { teamId, plan: planEnum, amount: data.amount });
        console.log(`Successfully upgraded team ${teamId} to ${planEnum}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    await logSystem('ERROR', 'BILLING', 'Webhook processing failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

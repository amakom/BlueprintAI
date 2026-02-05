import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';
import { logSystem } from '@/lib/system-log';
import { verifyWebhookSignature, LemonSqueezyEventType } from '@/lib/lemonsqueezy';

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  const signature = req.headers.get('x-signature');

  // Get raw body for signature verification
  const rawBody = await req.text();
  let body: any;

  try {
    body = JSON.parse(rawBody);
  } catch {
    await logSystem('WARN', 'BILLING', 'Invalid webhook JSON payload');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Verify signature if webhook secret is configured
  if (webhookSecret) {
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      await logSystem('WARN', 'BILLING', 'Invalid webhook signature', {
        receivedSignature: signature?.substring(0, 10) + '...',
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  try {
    const eventType = body.meta?.event_name as LemonSqueezyEventType;
    const data = body.data;
    const customData = body.meta?.custom_data || {};

    console.log('Lemonsqueezy Webhook received:', eventType);
    await logSystem('INFO', 'BILLING', `Webhook received: ${eventType}`, { eventType });

    // Log the webhook for debugging/auditing
    await prisma.webhookLog.create({
      data: {
        provider: 'lemonsqueezy',
        eventType: eventType,
        payload: body,
        status: 'received',
      }
    });

    const teamId = customData.team_id;
    const planId = customData.plan_id;

    // Handle subscription created or updated
    if (eventType === 'subscription_created' || eventType === 'subscription_updated') {
      const attrs = data.attributes;
      const subscriptionId = data.id;
      const customerEmail = attrs.user_email;
      const status = attrs.status; // active, on_trial, paused, past_due, unpaid, cancelled, expired

      if (teamId && planId) {
        let planEnum: PlanType = PlanType.FREE;
        if (planId === 'pro') planEnum = PlanType.PRO;
        if (planId === 'team') planEnum = PlanType.TEAM;
        if (planId === 'enterprise') planEnum = PlanType.ENTERPRISE;

        let subStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;
        if (status === 'cancelled' || status === 'expired') {
          subStatus = SubscriptionStatus.CANCELLED;
        } else if (status === 'past_due' || status === 'unpaid') {
          subStatus = SubscriptionStatus.PAST_DUE;
        } else if (status === 'paused') {
          subStatus = SubscriptionStatus.PAUSED;
        }

        // Update subscription in database
        const subscription = await prisma.subscription.upsert({
          where: { teamId },
          update: {
            status: subStatus,
            plan: planEnum,
            lemonSubscriptionId: subscriptionId,
            lemonCustomerId: attrs.customer_id?.toString(),
            amount: attrs.first_subscription_item?.price / 100 || 0,
            currency: 'USD',
            currentPeriodStart: attrs.current_period_start ? new Date(attrs.current_period_start) : new Date(),
            currentPeriodEnd: attrs.current_period_end ? new Date(attrs.current_period_end) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: attrs.cancelled || false,
            updatedAt: new Date(),
          },
          create: {
            teamId,
            status: subStatus,
            plan: planEnum,
            lemonSubscriptionId: subscriptionId,
            lemonCustomerId: attrs.customer_id?.toString(),
            amount: attrs.first_subscription_item?.price / 100 || 0,
            currency: 'USD',
            currentPeriodStart: attrs.current_period_start ? new Date(attrs.current_period_start) : new Date(),
            currentPeriodEnd: attrs.current_period_end ? new Date(attrs.current_period_end) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        // Mark webhook as processed
        await prisma.webhookLog.updateMany({
          where: {
            provider: 'lemonsqueezy',
            eventType: eventType,
            status: 'received',
          },
          data: { status: 'processed' }
        });

        // Audit Log
        const user = customerEmail ? await prisma.user.findUnique({ where: { email: customerEmail } }) : null;
        await logAudit({
          userId: user?.id,
          action: 'subscribe',
          resource: 'billing',
          metadata: { teamId, planId, subscriptionId },
        });

        await logSystem('INFO', 'BILLING', `Team subscription updated via webhook`, { teamId, plan: planEnum, status: subStatus });
        console.log(`Successfully updated team ${teamId} to ${planEnum}`);
      }
    }

    // Handle subscription payment success
    if (eventType === 'subscription_payment_success') {
      const attrs = data.attributes;

      if (teamId) {
        // Create invoice record
        const subscription = await prisma.subscription.findUnique({ where: { teamId } });

        if (subscription) {
          await prisma.invoice.create({
            data: {
              subscriptionId: subscription.id,
              amount: attrs.total / 100 || 0,
              currency: 'USD',
              status: 'PAID',
              lemonOrderId: data.id,
            }
          });

          await logAudit({
            action: 'invoice_paid',
            resource: 'billing',
            metadata: { teamId, amount: attrs.total / 100, orderId: data.id },
          });
        }
      }
    }

    // Handle subscription cancelled
    if (eventType === 'subscription_cancelled') {
      if (teamId) {
        await prisma.subscription.update({
          where: { teamId },
          data: {
            status: SubscriptionStatus.CANCELLED,
            cancelAtPeriodEnd: true,
          }
        });

        await logAudit({
          action: 'cancel_subscription',
          resource: 'billing',
          metadata: { teamId },
        });

        await logSystem('INFO', 'BILLING', `Subscription cancelled via webhook`, { teamId });
      }
    }

    // Handle subscription expired
    if (eventType === 'subscription_expired') {
      if (teamId) {
        await prisma.subscription.update({
          where: { teamId },
          data: {
            status: SubscriptionStatus.CANCELLED,
            plan: PlanType.FREE,
          }
        });

        await logSystem('INFO', 'BILLING', `Subscription expired - downgraded to free`, { teamId });
      }
    }

    // Handle payment failure
    if (eventType === 'subscription_payment_failed') {
      if (teamId) {
        await prisma.subscription.update({
          where: { teamId },
          data: {
            status: SubscriptionStatus.PAST_DUE,
          }
        });

        await logAudit({
          action: 'invoice_failed',
          resource: 'billing',
          metadata: { teamId },
        });

        await logSystem('WARN', 'BILLING', `Payment failed for team`, { teamId });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    await logSystem('ERROR', 'BILLING', 'Webhook processing failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

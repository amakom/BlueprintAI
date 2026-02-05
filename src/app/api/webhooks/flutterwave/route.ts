import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';
import { logSystem } from '@/lib/system-log';
import crypto from 'crypto';

// Verify Flutterwave webhook signature using HMAC
function verifyWebhookSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  // Flutterwave uses the verif-hash header which should match the secret hash
  // Method 1: Simple hash comparison (Flutterwave's default)
  if (signature === secret) {
    return true;
  }

  // Method 2: HMAC-SHA256 verification (if using custom webhook signature)
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers.get('verif-hash');

  // Get raw body for signature verification
  const rawBody = await req.text();
  let body: any;

  try {
    body = JSON.parse(rawBody);
  } catch {
    await logSystem('WARN', 'BILLING', 'Invalid webhook JSON payload');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Verify signature if secret hash is configured
  if (secretHash) {
    const isValid = verifyWebhookSignature(rawBody, signature, secretHash);
    if (!isValid) {
      await logSystem('WARN', 'BILLING', 'Invalid webhook signature', {
        receivedSignature: signature?.substring(0, 10) + '...',
      });
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  try {
    const { event, data } = body;

    console.log('Flutterwave Webhook received:', event);
    await logSystem('INFO', 'BILLING', `Webhook received: ${event}`, { eventType: event });

    // Log the webhook for debugging/auditing
    await prisma.webhookLog.create({
      data: {
        provider: 'flutterwave',
        eventType: event,
        payload: body,
        status: 'received',
      }
    });

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
        const subscription = await prisma.subscription.upsert({
          where: { teamId },
          update: {
            status: SubscriptionStatus.ACTIVE,
            plan: planEnum,
            flutterwaveSubscriptionId: `${id}`,
            flutterwaveCustomerId: `${customer.id}`,
            amount: data.amount,
            currency: data.currency === 'NGN' ? 'NGN' : 'USD',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancelAtPeriodEnd: false,
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

        // Create invoice record
        await prisma.invoice.create({
          data: {
            subscriptionId: subscription.id,
            amount: data.amount,
            currency: data.currency === 'NGN' ? 'NGN' : 'USD',
            status: 'PAID',
            flutterwaveRef: tx_ref || `${id}`,
          }
        });

        // Mark webhook as processed
        await prisma.webhookLog.updateMany({
          where: {
            provider: 'flutterwave',
            eventType: event,
            status: 'received',
          },
          data: { status: 'processed' }
        });

        // Audit Log
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

    // Handle subscription cancellation
    if (event === 'subscription.cancelled') {
      const { meta } = data;
      const teamId = meta?.teamId;

      if (teamId) {
        await prisma.subscription.update({
          where: { teamId },
          data: {
            status: SubscriptionStatus.CANCELLED,
            cancelAtPeriodEnd: true,
          }
        });

        await logSystem('INFO', 'BILLING', `Subscription cancelled via webhook`, { teamId });
      }
    }

    // Handle payment failure
    if (event === 'charge.failed') {
      const { meta, customer } = data;
      const teamId = meta?.teamId;

      if (teamId) {
        await prisma.subscription.update({
          where: { teamId },
          data: {
            status: SubscriptionStatus.PAST_DUE,
          }
        });

        await logSystem('WARN', 'BILLING', `Payment failed for team`, { teamId, email: customer?.email });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    await logSystem('ERROR', 'BILLING', 'Webhook processing failed', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

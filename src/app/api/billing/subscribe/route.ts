import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, isLemonSqueezyConfigured } from '@/lib/lemonsqueezy';
import { SUBSCRIPTION_PLANS } from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { planId, teamId, userEmail, userName } = await req.json();

    if (!teamId || !userEmail) {
      return NextResponse.json({ error: 'Missing teamId or userEmail' }, { status: 400 });
    }

    // Find the plan
    const planKey = Object.keys(SUBSCRIPTION_PLANS).find(
      key => SUBSCRIPTION_PLANS[key].id === planId
    );

    if (!planKey) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const planConfig = SUBSCRIPTION_PLANS[planKey];

    if (!planConfig.lemonVariantId) {
      return NextResponse.json({ error: 'This plan is not available for purchase' }, { status: 400 });
    }

    // Check if Lemonsqueezy is configured
    if (!isLemonSqueezyConfigured()) {
      // Return mock checkout for development/demo
      console.log('Lemonsqueezy not configured - returning demo checkout');
      return NextResponse.json({
        link: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/billing?status=demo&plan=${planId}`,
        warning: 'Demo mode - configure Lemonsqueezy for real payments'
      });
    }

    // Create Lemonsqueezy checkout
    const { checkoutUrl } = await createCheckout({
      variantId: planConfig.lemonVariantId,
      email: userEmail,
      name: userName,
      teamId,
      planId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/billing?status=success`,
    });

    // Audit log attempt
    const user = await prisma.user.findUnique({ where: { email: userEmail } });

    await logAudit({
      userId: user?.id,
      action: 'subscribe',
      resource: 'billing',
      metadata: { planId, teamId },
    });

    return NextResponse.json({ link: checkoutUrl });

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Internal Server Error'
    }, { status: 500 });
  }
}

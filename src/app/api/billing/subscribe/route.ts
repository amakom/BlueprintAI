import { NextRequest, NextResponse } from 'next/server';
import flw from '@/lib/flutterwave';
import { SUBSCRIPTION_PLANS } from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { planId, teamId, userEmail, userName } = await req.json();

    if (!teamId || !userEmail) {
      return NextResponse.json({ error: 'Missing teamId or userEmail' }, { status: 400 });
    }

    const planConfig = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const finalAmount = planConfig.price;

    const tx_ref = `bp_${teamId}_${planId}_${Date.now()}`;

    // Payload for Flutterwave
    const payload = {
      tx_ref,
      amount: finalAmount,
      currency: 'USD',
      payment_options: 'card,banktransfer,mobilemoney',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings/billing?status=success`,
      customer: {
        email: userEmail,
        name: userName || 'BlueprintAI User',
      },
      meta: {
        teamId,
        planId,
      },
      customizations: {
        title: `BlueprintAI ${planConfig.name} Plan`,
        description: `Monthly subscription for ${planConfig.name}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://blueprintai.dev'}/logo.svg`,
      },
      // Note: For recurring, we normally need a plan ID from Flutterwave.
      // If we don't pass payment_plan, it's a one-time payment.
      // We should use plan ID if available.
      payment_plan: planConfig.flutterwavePlanId, 
    };

    const response = await flw.Payment.standard(payload);

    if (response.status === 'success') {
      // Audit log attempt
      // Since we don't have userId here easily without lookup or passing it, we can skip userId or fetch it.
      // Assuming we can rely on teamId/email.
      // We'll leave userId undefined for now or try to find it.
      // Let's find user by email to be thorough.
      const user = await prisma.user.findUnique({ where: { email: userEmail } });

      await logAudit({
        userId: user?.id,
        action: 'subscribe',
        resource: 'billing',
        metadata: { planId, teamId, tx_ref },
      });

      return NextResponse.json({ link: response.data.link });
    } else {
        return NextResponse.json({ error: 'Failed to initiate payment', details: response }, { status: 500 });
    }

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

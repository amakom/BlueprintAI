import { NextRequest, NextResponse } from 'next/server';
import flw from '@/lib/flutterwave';
import { SUBSCRIPTION_PLANS } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { planId, currency, teamId, userEmail, userName } = await req.json();

    if (!teamId || !userEmail) {
      return NextResponse.json({ error: 'Missing teamId or userEmail' }, { status: 400 });
    }

    const planConfig = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get price based on currency
    const amount = currency === 'NGN' && planConfig.currency === 'USD' 
        ? planConfig.price * 1500 // Simple conversion rate assumption for demo
        : planConfig.price;
    
    // In a real app, fetch dynamic exchange rate or define NGN prices explicitly
    const finalAmount = currency === 'NGN' ? (planId === 'pro' ? 15000 : 60000) : planConfig.price;

    const tx_ref = `bp_${teamId}_${planId}_${Date.now()}`;

    // Payload for Flutterwave
    const payload = {
      tx_ref,
      amount: finalAmount,
      currency: currency || 'USD',
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
        logo: 'https://blueprint-ai.com/logo.png', // Placeholder
      },
      // Note: For recurring, we normally need a plan ID from Flutterwave.
      // If we don't pass payment_plan, it's a one-time payment.
      // We should use plan ID if available.
      payment_plan: planConfig.flutterwavePlanId, 
    };

    const response = await flw.Payment.standard(payload);

    if (response.status === 'success') {
      return NextResponse.json({ link: response.data.link });
    } else {
        return NextResponse.json({ error: 'Failed to initiate payment', details: response }, { status: 500 });
    }

  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

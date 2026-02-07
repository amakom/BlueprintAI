import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, name, source } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Re-subscribe
        await prisma.subscriber.update({
          where: { email: normalizedEmail },
          data: {
            status: 'active',
            unsubscribedAt: null,
            name: name || existing.name,
            source: source || 'landing_page',
          },
        });
        return NextResponse.json({ message: 'Welcome back! You have been re-subscribed.' });
      }
      return NextResponse.json({ message: 'You are already subscribed!' });
    }

    await prisma.subscriber.create({
      data: {
        email: normalizedEmail,
        name: name || null,
        source: source || 'landing_page',
      },
    });

    return NextResponse.json({ message: 'Successfully subscribed! We\'ll keep you updated.' });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

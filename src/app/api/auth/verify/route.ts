
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { token, email } = await req.json();

    if (!token || !email) {
      return NextResponse.json({ error: 'Missing token or email' }, { status: 400 });
    }

    // Find token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Verify user
    const user = await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token,
        },
      },
    });

    // Log audit
    await logAudit({
      userId: user.id,
      action: 'verify_email',
      resource: 'auth',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

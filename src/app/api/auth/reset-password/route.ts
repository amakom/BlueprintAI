
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Find token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: 'Token expired' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
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
      action: 'reset_password',
      resource: 'auth',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

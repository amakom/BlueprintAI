
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { logAudit } from '@/lib/audit';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Delete existing tokens for this user (optional cleanup)
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send Email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'Reset your password for BlueprintAI',
      text: `Hello ${user.name || 'User'}, Click here to reset your password: ${resetLink}. This link expires in 1 hour.`,
      html: `
        <h1>Reset Password</h1>
        <p>Hello ${user.name || 'User'},</p>
        <p>You requested a password reset. Click the link below to proceed:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    await logAudit({
      userId: user.id,
      action: 'forgot_password',
      resource: 'auth',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

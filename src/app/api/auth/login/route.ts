import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setSession, signToken } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Auto-promote to OWNER if email matches env var
    let role = user.role;
    if (process.env.OWNER_EMAIL && user.email === process.env.OWNER_EMAIL && role !== 'OWNER') {
      console.log(`Auto-promoting ${user.email} to OWNER`);
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'OWNER' }
      });
      role = 'OWNER' as any;
    }

    // Create Session
    const token = await signToken({ 
      userId: user.id, 
      email: user.email,
      role: role 
    });
    await setSession(token);

    // Log audit
    await logAudit({
      userId: user.id,
      action: 'login',
      resource: 'auth',
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

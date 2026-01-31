import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, setSession, signToken } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { logSystem } from '@/lib/system-log';

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
      await logSystem('WARN', 'AUTH', 'Failed login attempt - User not found or no password', { email });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      await logSystem('WARN', 'AUTH', 'Failed login attempt - Invalid password', { email });
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
      await logSystem('INFO', 'AUTH', 'User auto-promoted to OWNER', { email: user.email });
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

    await logSystem('INFO', 'AUTH', 'User logged in', { userId: user.id, email: user.email });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Login error:', error);
    await logSystem('ERROR', 'AUTH', 'Login error', { error: error instanceof Error ? error.message : 'Unknown' });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

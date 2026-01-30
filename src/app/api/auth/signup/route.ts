import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSession, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Transaction: Create User -> Create Team -> Add Member
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // 2. Create Default Team
      const team = await tx.team.create({
        data: {
          name: `${name}'s Team`,
          slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000),
        },
      });

      // 3. Add User to Team as Owner
      await tx.teamMember.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: 'OWNER',
        },
      });

      return { user, team };
    });

    // 4. Create Session
    const token = await signToken({ userId: result.user.id, email: result.user.email });
    await setSession(token);

    return NextResponse.json({ success: true, user: result.user, team: result.team });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

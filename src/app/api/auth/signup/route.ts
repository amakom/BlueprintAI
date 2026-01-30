import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSession, signToken } from '@/lib/auth';

export async function POST(req: Request) {
  console.log('Signup request started');
  
  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    return NextResponse.json({ error: 'Configuration Error: Missing DATABASE_URL' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Request body parsed', { email: body.email, name: body.name });
    
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed');

    // Create User & Team
    console.log('Starting transaction...');
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const teamName = `${name}'s Team`;
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(Math.random() * 1000)}`;
      
      const team = await tx.team.create({
        data: {
          name: teamName,
          slug,
        },
      });

      await tx.teamMember.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: 'OWNER',
        },
      });

      return { user, team };
    });
    console.log('Transaction completed', result.user.id);

    // Create Session
    console.log('Signing token...');
    const token = await signToken({ userId: result.user.id, email: result.user.email });
    console.log('Setting session...');
    await setSession(token);
    console.log('Session set');

    return NextResponse.json({ success: true, user: result.user, team: result.team });
  } catch (error: any) {
    console.error('Signup error full object:', error);
    const errorMessage = error?.message || 'Unknown error occurred';
    const errorStack = error?.stack || 'No stack trace';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: 'Check Vercel logs for full stack trace', 
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined 
      },
      { status: 500 }
    );
  }
}

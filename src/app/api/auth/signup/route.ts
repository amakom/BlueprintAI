import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSession, signToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';
import { logSystem } from '@/lib/system-log';
import { z } from 'zod';

// Input validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export async function POST(req: Request) {
  console.log('Signup request started');

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    await logSystem('ERROR', 'SYSTEM', 'Missing DATABASE_URL configuration');
    return NextResponse.json({ error: 'Configuration Error: Missing DATABASE_URL' }, { status: 500 });
  }

  try {
    const body = await req.json();

    // Validate input
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, email, password } = validation.data;
    console.log('Request body validated', { email, name });

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

      const isOwner = email === process.env.OWNER_EMAIL;
      const role = isOwner ? 'OWNER' : 'USER';

      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as any,
        },
      });

      // Create Verification Token
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // Send Verification Email using new helper
      await sendVerificationEmail(email, name, token);

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

      // Auto-create first project
      const project = await tx.project.create({
        data: {
          name: 'My First Project',
          description: 'Welcome to your first BlueprintAI project! This project was automatically created to help you get started.',
          teamId: team.id,
        },
      });

      // Log audit
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'signup',
          resource: 'auth',
          metadata: { email },
        },
      });

      // Seed with initial Canvas Document
      const initialContent = {
        nodes: [
          {
            id: 'welcome-1',
            type: 'userStory',
            position: { x: 100, y: 100 },
            data: {
              title: 'Welcome to BlueprintAI',
              role: 'Builder',
              goal: 'visualize my product requirements',
              benefit: 'I can build faster'
            }
          },
          {
            id: 'welcome-2',
            type: 'userStory',
            position: { x: 500, y: 100 },
            data: {
              title: 'Try AI Generation',
              role: 'Product Owner',
              goal: 'use the AI assistant',
              benefit: 'I can generate stories automatically'
            }
          }
        ],
        edges: [
            {
                id: 'e1-2',
                source: 'welcome-1',
                target: 'welcome-2',
                animated: true,
            }
        ]
      };

      await tx.document.create({
        data: {
          title: 'Project Canvas',
          type: 'CANVAS',
          content: initialContent,
          projectId: project.id,
          authorId: user.id,
        },
      });

      return { user, team };
    });
    console.log('Transaction completed', result.user.id);

    await logSystem('INFO', 'AUTH', 'New user signed up', { email, userId: result.user.id });

    // Create Session
    console.log('Signing token...');
    const token = await signToken({
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role
    });
    console.log('Setting session...');
    await setSession(token);
    console.log('Session set');

    const { password: _, ...safeUser } = result.user;
    return NextResponse.json({ success: true, user: safeUser, team: result.team });
  } catch (error: any) {
    console.error('Signup error full object:', error);
    await logSystem('ERROR', 'AUTH', 'Signup failed', { error: error.message || 'Unknown' });
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

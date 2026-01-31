import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSession, signToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { logAudit } from '@/lib/audit';
import crypto from 'crypto';

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

      // Send Verification Email (Async, non-blocking for transaction speed ideally, but here we wait to ensure it works)
      // Note: In production, consider moving this out of the transaction or using a queue
      // For now, we'll construct the link. Assuming localhost:3000 if not set.
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const verifyLink = `${baseUrl}/verify?token=${token}&email=${encodeURIComponent(email)}`;

      await sendEmail({
        to: email,
        subject: 'Verify your email for BlueprintAI',
        text: `Welcome ${name}! Please verify your email by clicking here: ${verifyLink}`,
        html: `
          <h1>Welcome to BlueprintAI, ${name}!</h1>
          <p>Please verify your email address to secure your account.</p>
          <p><a href="${verifyLink}">Verify Email</a></p>
          <p>Or copy this link: ${verifyLink}</p>
        `,
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

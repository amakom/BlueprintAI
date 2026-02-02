import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { getPlanLimits, PlanType } from '@/lib/permissions';
import { logSystem } from '@/lib/system-log';
import { openai, isAIConfigured } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user to get global role (for God Mode access)
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    const userRole = user?.role;

    const { projectId, description } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // 1. Resolve Team and Plan
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          include: {
            subscription: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const team = project.team;
    
    // Check if team is blocked from using AI
    if (team.aiBlocked) {
      await logSystem('WARN', 'AI', 'Blocked team attempted generation', { teamId: team.id, userId: session.userId });
      return NextResponse.json({ error: 'AI generation has been temporarily disabled for your team. Please contact support.' }, { status: 403 });
    }

    const plan = (team.subscription?.plan as PlanType) || PlanType.FREE;
    const limits = getPlanLimits(plan, userRole);

    // 2. Check Feature Access
    if (!limits.canGenerateAI && plan !== PlanType.FREE) {
        if (limits.maxAIGenerationsPerMonth === 0) {
            return NextResponse.json({ error: 'AI generation is not available on your plan. Please upgrade.' }, { status: 403 });
        }
    }

    // 3. Rate Limiting (Abuse Prevention - Short Term)
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentUserRequests = await prisma.aIUsageLog.count({
      where: {
        teamId: team.id,
        createdAt: {
          gte: oneMinuteAgo,
        },
      },
    });

    if (recentUserRequests >= 20) {
        await logSystem('WARN', 'AI', 'Rate limit exceeded', { teamId: team.id });
        return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
    }

    // 4. Quota Enforcement (Monthly Limit)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyUsage = await prisma.aIUsageLog.count({
      where: {
        teamId: team.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (monthlyUsage >= limits.maxAIGenerationsPerMonth) {
      await logSystem('WARN', 'AI', 'Monthly quota exceeded', { teamId: team.id, plan });
      return NextResponse.json({ 
        error: `Monthly AI limit reached (${monthlyUsage}/${limits.maxAIGenerationsPerMonth}). Please upgrade your plan.` 
      }, { status: 403 });
    }

    // 5. Generate Personas using Real AI
    const contextDescription = description || project.description || "A new innovative product";

    if (!isAIConfigured()) {
       console.warn('OpenAI API Key missing, falling back to mock data');
       const mockPersonas = [
        {
          name: "Sarah the Starter (Mock)",
          role: "Small Business Owner",
          bio: "Sarah runs a local bakery and needs simple tools to manage her inventory and orders. She is not tech-savvy.",
          goals: ["Save time on admin", "Increase sales", "Understand customer trends"],
          frustrations: ["Complex software", "High costs", "Lack of mobile support"]
        }
       ];
       return NextResponse.json({ personas: mockPersonas });
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview", 
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are an expert User Researcher. Generate 3 detailed User Personas for the product described by the user. Return a JSON object with a single key 'personas' containing an array of objects. Each object must have 'name', 'role', 'bio', 'goals' (array of strings), and 'frustrations' (array of strings)."
          },
          {
            role: "user",
            content: `Product Description: ${contextDescription}`
          }
        ]
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("No content received from AI");
      }

      const result = JSON.parse(content);

      // Log usage
      await prisma.aIUsageLog.create({
        data: {
          teamId: team.id,
          action: 'GENERATE_PERSONAS',
          model: 'gpt-4-turbo-preview',
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
        }
      });

      return NextResponse.json(result);

    } catch (error) {
      console.error('AI Generation Error:', error);
      await logSystem('ERROR', 'AI', 'Failed to generate Personas', { error: String(error) });
      return NextResponse.json({ error: 'Failed to generate Personas. Please try again later.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Request Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

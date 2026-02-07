import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { generateAI, isAIConfigured, AI_MODEL } from '@/lib/openai';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { projectId, description } = await req.json();

  if (!projectId) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { team: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  let okrs: { objective: string; keyResults: string[] }[];

  if (isAIConfigured()) {
    try {
      const systemPrompt = "You are an expert Product Manager. Generate 3-5 strategic OKRs (Objectives and Key Results) for the product. Return a JSON object with a single key 'okrs' containing an array of objects. Each object must have 'objective' (string) and 'keyResults' (array of strings, 2-4 items each).";
      const userPrompt = `Project: ${project.name}\nDescription: ${description || project.description || 'A new product'}`;

      const aiResponse = await generateAI(systemPrompt, userPrompt, { jsonMode: true });
      const result = JSON.parse(aiResponse.text);
      okrs = result.okrs || [];

      await prisma.aIUsageLog.create({
        data: {
          teamId: project.teamId,
          action: 'generate_okr',
          inputTokens: aiResponse.usage.inputTokens,
          outputTokens: aiResponse.usage.outputTokens,
          model: AI_MODEL,
        },
      });
    } catch (aiError) {
      console.error('AI OKR generation failed:', aiError);
      okrs = [
        { objective: "Launch MVP", keyResults: ["Complete Auth System", "Deploy to Production", "Onboard first 10 users"] },
        { objective: "Validate Market Fit", keyResults: ["Achieve 20% retention", "Collect 50 feedback responses"] }
      ];
    }
  } else {
    okrs = [
      { objective: "Launch MVP", keyResults: ["Complete Auth System", "Deploy to Production", "Onboard first 10 users"] },
      { objective: "Validate Market Fit", keyResults: ["Achieve 20% retention", "Collect 50 feedback responses"] }
    ];
  }

  // Save OKRs to DB
  await prisma.$transaction(
    okrs.map(okr =>
      prisma.oKR.create({
        data: {
          projectId,
          objective: okr.objective,
          keyResults: okr.keyResults,
          status: 'DRAFT'
        }
      })
    )
  );

  return NextResponse.json({ okrs });
}

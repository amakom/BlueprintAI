import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { projectId, description } = await req.json();

  // Mock AI Generation logic
  // In real implementation, this would call OpenAI/Anthropic
  const okrs = [
    { 
      objective: "Launch MVP", 
      keyResults: ["Complete Auth System", "Deploy to Production", "Onboard first 10 users"] 
    },
    { 
      objective: "Validate Market Fit", 
      keyResults: ["Achieve 20% retention", "Collect 50 feedback responses"] 
    }
  ];

  // TODO: Save to DB once Schema is updated
  /*
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
  */

  return NextResponse.json({ okrs });
}

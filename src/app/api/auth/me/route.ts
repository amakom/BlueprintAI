import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true }
  });

  const member = await prisma.teamMember.findFirst({
    where: { userId: session.userId },
    include: { team: true }
  });

  return NextResponse.json({
    user,
    teamId: member?.teamId,
    teamName: member?.team?.name,
    role: member?.role
  });
}

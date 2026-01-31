import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';
import { logAudit } from '@/lib/audit';

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { blocked } = await req.json();

    const team = await prisma.team.update({
      where: { id: params.teamId },
      data: { aiBlocked: blocked },
    });

    await logAudit({
      userId: session.userId,
      action: blocked ? 'block_ai' : 'unblock_ai',
      resource: 'admin_ai',
      metadata: { teamId: team.id, teamName: team.name }
    });

    return NextResponse.json({ success: true, team });
  } catch (error) {
    console.error('Admin block AI error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

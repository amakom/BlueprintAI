import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const level = searchParams.get('level');
  const category = searchParams.get('category');

  try {
    const whereClause: any = {};
    if (level && level !== 'ALL') whereClause.level = level;
    if (category && category !== 'ALL') whereClause.category = category;

    const logs = await prisma.systemLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('System logs fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

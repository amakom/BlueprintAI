import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'all'; // 'auth', 'billing', 'all'
    
    let whereClause = {};
    if (type !== 'all') {
        whereClause = { resource: type };
    }

    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
            select: { email: true, name: true }
        }
      }
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Admin logs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

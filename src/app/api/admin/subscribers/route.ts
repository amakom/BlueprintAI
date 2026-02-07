import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

// GET /api/admin/subscribers — list all subscribers
export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';

    const subscribers = await prisma.subscriber.findMany({
      where: status === 'all' ? {} : { status },
      orderBy: { subscribedAt: 'desc' },
    });

    const counts = await prisma.subscriber.groupBy({
      by: ['status'],
      _count: true,
    });

    const total = counts.reduce((acc, c) => acc + c._count, 0);
    const active = counts.find(c => c.status === 'active')?._count || 0;
    const unsubscribed = counts.find(c => c.status === 'unsubscribed')?._count || 0;

    return NextResponse.json({
      subscribers,
      stats: { total, active, unsubscribed },
    });
  } catch (error) {
    console.error('Admin subscribers error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

// DELETE /api/admin/subscribers — remove a subscriber
export async function DELETE(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
    }

    await prisma.subscriber.delete({ where: { id } });
    return NextResponse.json({ message: 'Subscriber removed' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}

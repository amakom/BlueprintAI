import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET() {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        subscription: {
            include: {
                team: {
                    select: { name: true }
                }
            }
        }
      }
    });

    // Flatten data for easier consumption
    const formatted = invoices.map(inv => ({
        id: inv.id,
        amount: inv.amount,
        currency: inv.currency,
        status: inv.status,
        teamName: inv.subscription.team.name,
        date: inv.createdAt,
        ref: inv.flutterwaveRef
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

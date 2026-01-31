
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET() {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            team: {
              select: { name: true }
            }
          }
        }
      },
      take: 100
    });

    const formattedInvoices = invoices.map(inv => ({
      id: inv.id,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status,
      ref: inv.flutterwaveRef,
      teamName: inv.subscription.team.name,
      createdAt: inv.createdAt,
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error('Admin billing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
                    include: {
                        members: {
                            where: { role: 'OWNER' },
                            include: { user: { select: { email: true } } }
                        }
                    }
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
        teamName: inv.subscription?.team?.name || 'Unknown Team',
        userEmail: inv.subscription?.team?.members[0]?.user.email || 'Unknown',
        plan: inv.subscription?.plan || 'UNKNOWN',
        date: inv.createdAt,
        ref: inv.flutterwaveRef
    }));
    
    return NextResponse.json({ invoices: formatted });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

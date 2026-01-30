import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    if (!teamId) return NextResponse.json({ error: 'Missing teamId' }, { status: 400 });

    const subscription = await prisma.subscription.findFirst({
        where: { teamId },
        include: { invoices: { orderBy: { createdAt: 'desc' }, take: 5 } }
    });

    return NextResponse.json({ subscription });
}

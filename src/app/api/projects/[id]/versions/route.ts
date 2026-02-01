import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { DocType } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Find the Canvas Document for this project
    const document = await prisma.document.findFirst({
      where: {
        projectId: params.id,
        type: DocType.CANVAS,
      },
      select: { id: true }
    });

    if (!document) {
      return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }

    // 2. Fetch versions for this document
    const versions = await prisma.version.findMany({
      where: { documentId: document.id },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to last 20 versions for now
      select: {
        id: true,
        createdAt: true,
        commitMsg: true,
        // We don't fetch full content in the list to save bandwidth
      }
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

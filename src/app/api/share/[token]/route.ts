import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const shareLink = await prisma.shareLink.findUnique({
    where: { token: params.token },
    include: {
      project: {
        include: {
          documents: {
            where: { type: 'CANVAS' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!shareLink) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const project = shareLink.project;
  const canvasDoc = project.documents[0];

  return NextResponse.json({
    id: project.id,
    name: project.name,
    description: project.description,
    updatedAt: project.updatedAt,
    canvas: canvasDoc ? {
      content: canvasDoc.content,
    } : null,
  });
}

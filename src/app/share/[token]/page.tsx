import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { SharedCanvasWrapper } from './SharedCanvasWrapper';

export default async function SharedPage({ params }: { params: { token: string } }) {
  const shareLink = await prisma.shareLink.findUnique({
    where: { token: params.token },
    include: {
      project: {
        include: {
          documents: {
            where: { type: 'CANVAS' },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    }
  });

  if (!shareLink) {
    notFound();
  }

  const project = shareLink.project;
  const canvasDoc = project.documents[0];
  const initialData = (canvasDoc?.content as any) || { nodes: [], edges: [] };

  return (
    <SharedCanvasWrapper 
      projectId={project.id} 
      projectName={project.name}
      initialData={initialData}
    />
  );
}

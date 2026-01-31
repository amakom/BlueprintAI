
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function GET() {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        team: {
          include: {
            members: {
              where: { role: 'OWNER' },
              include: { user: { select: { email: true, name: true } } }
            }
          }
        },
        _count: {
          select: { documents: true }
        }
      },
      take: 50 // Pagination later if needed
    });

    const formattedProjects = projects.map(p => ({
      id: p.id,
      name: p.name,
      teamName: p.team.name,
      ownerEmail: p.team.members[0]?.user.email || 'Unknown',
      documentCount: p._count.documents,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Admin projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

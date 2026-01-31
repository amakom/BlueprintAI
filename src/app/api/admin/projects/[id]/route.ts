import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { id } = params;
    await prisma.project.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin project delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

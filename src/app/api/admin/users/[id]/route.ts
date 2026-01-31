import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';
import { UserRole } from '@/lib/permissions';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { role, status } = await req.json();
    
    // Prevent changing own role/status to avoid lockout
    if (params.id === session.userId) {
        return NextResponse.json({ error: 'Cannot modify your own admin status' }, { status: 400 });
    }

    // Only OWNER can assign ADMIN/OWNER roles (optional strictness, but let's allow ADMIN to manage others for now, maybe restrict OWNER creation)
    if (role === UserRole.OWNER && session.role !== UserRole.OWNER) {
         return NextResponse.json({ error: 'Only Owners can promote to Owner' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const session = await checkAdminAccess();
    if (!session) return unauthorized();
  
    try {
      if (params.id === session.userId) {
          return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
      }
  
      await prisma.user.delete({
        where: { id: params.id },
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Admin user delete error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

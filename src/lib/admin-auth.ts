import { getSession } from '@/lib/auth';
import { UserRole } from '@/lib/permissions';
import { NextResponse } from 'next/server';

export async function checkAdminAccess() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  // Check if role is ADMIN or OWNER
  if (session.role !== UserRole.ADMIN && session.role !== UserRole.OWNER) {
    return null;
  }

  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ token: null }, { status: 401 });
    }

    // Return the token for socket authentication
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Socket token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

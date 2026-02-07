import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email) {
      return new Response(unsubscribePage('Invalid unsubscribe link.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const subscriber = await prisma.subscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (!subscriber || subscriber.status === 'unsubscribed') {
      return new Response(unsubscribePage('This email is not subscribed or has already been removed.', false), {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    await prisma.subscriber.update({
      where: { email: normalizedEmail },
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      },
    });

    return new Response(unsubscribePage('You have been successfully unsubscribed.', true), {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new Response(unsubscribePage('Something went wrong. Please try again.', false), {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function unsubscribePage(message: string, success: boolean) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribe - BlueprintAI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0B1F33; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 48px; text-align: center; max-width: 400px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    p { color: #94a3b8; font-size: 14px; }
    a { color: #2EE6D6; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? '&#10003;' : '&#9888;'}</div>
    <h1>${message}</h1>
    <p style="margin-top: 24px;"><a href="/">Back to BlueprintAI</a></p>
  </div>
</body>
</html>`;
}

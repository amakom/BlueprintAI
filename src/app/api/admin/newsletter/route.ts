import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAccess, unauthorized } from '@/lib/admin-auth';
import { sendEmail } from '@/lib/email';

// POST /api/admin/newsletter — send a newsletter to all active subscribers
export async function POST(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const { subject, body } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 });
    }

    // Get all active subscribers
    const subscribers = await prisma.subscriber.findMany({
      where: { status: 'active' },
      select: { email: true, name: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers to send to' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Send emails one by one (Resend free tier: 100/day)
    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      const unsubscribeUrl = `${appUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`;
      const personalizedHtml = getNewsletterHtml(subject, body, sub.name || 'there', unsubscribeUrl);

      const result = await sendEmail({
        to: sub.email,
        subject,
        text: body,
        html: personalizedHtml,
      });

      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Log the campaign
    await prisma.newsletterCampaign.create({
      data: {
        subject,
        body,
        sentBy: session.userId,
        recipientCount: successCount,
        status: failCount === 0 ? 'sent' : 'sent',
      },
    });

    return NextResponse.json({
      message: `Newsletter sent to ${successCount} subscriber${successCount !== 1 ? 's' : ''}`,
      successCount,
      failCount,
      total: subscribers.length,
    });
  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}

// GET /api/admin/newsletter — list past campaigns
export async function GET(req: Request) {
  const session = await checkAdminAccess();
  if (!session) return unauthorized();

  try {
    const campaigns = await prisma.newsletterCampaign.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Newsletter list error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

function getNewsletterHtml(subject: string, body: string, name: string, unsubscribeUrl: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f6f8fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0B1F33; border-radius: 8px 8px 0 0;">
              <div style="width: 48px; height: 48px; background-color: #2EE6D6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: #0B1F33; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">BlueprintAI</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0B1F33; margin: 0 0 16px; font-size: 20px;">Hi ${name}!</h2>
              <div style="color: #64748b; font-size: 16px; line-height: 1.6;">
                ${body.replace(/\n/g, '<br>')}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px;">
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 0 0 16px;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
                You received this because you subscribed to BlueprintAI updates.<br>
                <a href="${unsubscribeUrl}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

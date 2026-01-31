
export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  // In a real production app, use a provider like Resend, SendGrid, or AWS SES
  // For now, we'll log to console to simulate sending
  console.log('--------------------------------------------------');
  console.log(`[Email Service] Sending email to: ${to}`);
  console.log(`[Email Service] Subject: ${subject}`);
  console.log(`[Email Service] Body: ${text}`);
  if (html) {
    console.log(`[Email Service] HTML content present (length: ${html.length})`);
  }
  console.log('--------------------------------------------------');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { success: true };
}

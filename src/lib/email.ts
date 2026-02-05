import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.FROM_EMAIL || 'BlueprintAI <noreply@blueprintai.dev>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  // If Resend is not configured, log to console (development mode)
  if (!resend) {
    console.log('--------------------------------------------------');
    console.log(`[Email Service - DEV MODE] Sending email to: ${to}`);
    console.log(`[Email Service] Subject: ${subject}`);
    console.log(`[Email Service] Body: ${text}`);
    console.log('--------------------------------------------------');
    return { success: true, dev: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      text,
      html: html || text,
    });

    if (error) {
      console.error('[Email Service] Failed to send email:', error);
      return { success: false, error: error.message };
    }

    console.log(`[Email Service] Email sent successfully to ${to}, ID: ${data?.id}`);
    return { success: true, id: data?.id };
  } catch (error) {
    console.error('[Email Service] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Email Templates
export function getVerificationEmailHtml(name: string, verifyUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f8fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0B1F33; border-radius: 8px 8px 0 0;">
              <div style="width: 48px; height: 48px; background-color: #2EE6D6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: #0B1F33; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">BlueprintAI</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0B1F33; margin: 0 0 16px; font-size: 20px;">Welcome, ${name}!</h2>
              <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                Thanks for signing up for BlueprintAI. Please verify your email address by clicking the button below.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                <tr>
                  <td style="background-color: #2EE6D6; border-radius: 6px;">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; color: #0B1F33; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #94a3b8; margin: 0; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with BlueprintAI, you can safely ignore this email.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This link will expire in 24 hours. If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="color: #64748b; margin: 8px 0 0; font-size: 12px; word-break: break-all;">
                ${verifyUrl}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getPasswordResetEmailHtml(name: string, resetUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f8fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0B1F33; border-radius: 8px 8px 0 0;">
              <div style="width: 48px; height: 48px; background-color: #2EE6D6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: #0B1F33; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">BlueprintAI</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0B1F33; margin: 0 0 16px; font-size: 20px;">Reset Your Password</h2>
              <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                Hi ${name}, we received a request to reset your password. Click the button below to create a new password.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                <tr>
                  <td style="background-color: #FFB703; border-radius: 6px;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; color: #0B1F33; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #94a3b8; margin: 0; font-size: 14px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This link will expire in 1 hour. If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="color: #64748b; margin: 8px 0 0; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getTeamInviteEmailHtml(inviterName: string, teamName: string, inviteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f6f8fb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f8fb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background-color: #0B1F33; border-radius: 8px 8px 0 0;">
              <div style="width: 48px; height: 48px; background-color: #2EE6D6; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="color: #0B1F33; font-size: 24px; font-weight: bold;">B</span>
              </div>
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">BlueprintAI</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="color: #0B1F33; margin: 0 0 16px; font-size: 20px;">You've Been Invited!</h2>
              <p style="color: #64748b; margin: 0 0 24px; font-size: 16px; line-height: 1.6;">
                <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on BlueprintAI. Click the button below to accept the invitation.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
                <tr>
                  <td style="background-color: #2EE6D6; border-radius: 6px;">
                    <a href="${inviteUrl}" style="display: inline-block; padding: 14px 32px; color: #0B1F33; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #94a3b8; margin: 0; font-size: 14px; line-height: 1.6;">
                BlueprintAI helps teams plan, design, and build products together with AI assistance.
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                This invitation will expire in 7 days.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Helper function to send verification email
export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyUrl = `${APP_URL}/api/auth/verify?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Verify your BlueprintAI account',
    text: `Welcome to BlueprintAI, ${name}! Please verify your email by visiting: ${verifyUrl}`,
    html: getVerificationEmailHtml(name, verifyUrl),
  });
}

// Helper function to send password reset email
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  return sendEmail({
    to: email,
    subject: 'Reset your BlueprintAI password',
    text: `Hi ${name}, click this link to reset your password: ${resetUrl}. This link expires in 1 hour.`,
    html: getPasswordResetEmailHtml(name, resetUrl),
  });
}

// Helper function to send team invite email
export async function sendTeamInviteEmail(email: string, inviterName: string, teamName: string, token: string) {
  const inviteUrl = `${APP_URL}/invite?token=${token}`;

  return sendEmail({
    to: email,
    subject: `${inviterName} invited you to join ${teamName} on BlueprintAI`,
    text: `${inviterName} has invited you to join ${teamName} on BlueprintAI. Accept the invitation: ${inviteUrl}`,
    html: getTeamInviteEmailHtml(inviterName, teamName, inviteUrl),
  });
}

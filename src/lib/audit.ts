
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'signup'
  | 'verify_email'
  | 'forgot_password'
  | 'reset_password'
  | 'subscribe'
  | 'cancel_subscription'
  | 'invoice_paid'
  | 'invoice_failed'
  | 'block_ai'
  | 'unblock_ai'
  | 'reset_ai_usage'
  | 'manual_plan_grant';

interface LogAuditOptions {
  userId?: string;
  action: AuditAction;
  resource: 'auth' | 'billing' | 'admin_ai' | 'admin_billing';
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit({
  userId,
  action,
  resource,
  metadata,
  ipAddress,
  userAgent,
}: LogAuditOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: metadata || {},
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Non-blocking: don't throw error if logging fails
  }
}

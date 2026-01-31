import { prisma } from '@/lib/prisma';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';
export type LogCategory = 'AUTH' | 'API' | 'DATABASE' | 'SYSTEM' | 'BILLING' | 'AI';

export async function logSystem(
  level: LogLevel,
  category: LogCategory,
  message: string,
  metadata?: any
) {
  try {
    await prisma.systemLog.create({
      data: {
        level,
        category,
        message,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    // Fail silently to avoid infinite loops if logging fails
    console.error('Failed to write system log:', error);
  }
}

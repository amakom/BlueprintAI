import { prisma } from '@/lib/prisma';
import { PlanType } from '@prisma/client';
import { getPlanLimits } from '@/lib/permissions';

export async function checkTeamLimit(teamId: string, checkFn: (limits: ReturnType<typeof getPlanLimits>) => boolean) {
  const subscription = await prisma.subscription.findFirst({
    where: { teamId, status: 'ACTIVE' },
  });

  const plan = (subscription?.plan as PlanType) || PlanType.FREE;
  const limits = getPlanLimits(plan);

  return checkFn(limits);
}

// Example usage:
// const canExport = await checkTeamLimit(teamId, (l) => l.canExport);

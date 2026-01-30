import { prisma } from '@/lib/prisma';
import { PlanType } from '@/lib/permissions';
import { getPlanLimits } from '@/lib/permissions';

export async function checkTeamLimit(teamId: string, checkFn: (limits: ReturnType<typeof getPlanLimits>) => boolean) {
  const subscription = await prisma.subscription.findFirst({
    where: { teamId, status: 'ACTIVE' },
  });

  // Cast Prisma's PlanType to our internal PlanType
  const plan = (subscription?.plan as unknown as PlanType) || PlanType.FREE;
  const limits = getPlanLimits(plan);

  return checkFn(limits);
}

// Example usage:
// const canExport = await checkTeamLimit(teamId, (l) => l.canExport);

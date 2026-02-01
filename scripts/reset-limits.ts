
import { PrismaClient, PlanType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Resetting AI limits and upgrading subscriptions...');

  // 1. Delete all AI Usage Logs (Resets the counter to 0)
  const deletedLogs = await prisma.aIUsageLog.deleteMany({});
  console.log(`Deleted ${deletedLogs.count} AI usage logs.`);

  // 2. Upgrade all Free subscriptions to TEAM (for testing purposes)
  // Find all teams with FREE subscription or no subscription
  const teams = await prisma.team.findMany({
    include: { subscription: true }
  });

  console.log(`Found ${teams.length} teams.`);

  for (const team of teams) {
    if (!team.subscription || team.subscription.plan === PlanType.FREE) {
      console.log(`Upgrading team ${team.name} (${team.id}) to TEAM plan...`);
      
      if (team.subscription) {
        await prisma.subscription.update({
          where: { id: team.subscription.id },
          data: { plan: PlanType.TEAM }
        });
      } else {
        await prisma.subscription.create({
          data: {
            teamId: team.id,
            plan: PlanType.TEAM,
            status: 'ACTIVE',
            currency: 'USD',
            amount: 0, // Free upgrade
          }
        });
      }
    }
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

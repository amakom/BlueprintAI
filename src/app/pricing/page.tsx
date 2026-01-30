import { PricingTable } from '@/features/billing/PricingTable';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function PricingPage() {
  const session = await getSession();
  let teamId: string | undefined;
  
  if (session?.userId) {
      const member = await prisma.teamMember.findFirst({
          where: { userId: session.userId },
          select: { teamId: true }
      });
      if (member) teamId = member.teamId;
  }

  // Helper to safely get name if it exists or use default
  const userName = (session as any)?.name || undefined; 

  return (
    <div className="min-h-screen bg-cloud">
      <header className="bg-white border-b border-border py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-navy">BlueprintAI</h1>
        {session && <span className="text-sm text-gray-500">Logged in as {session.email}</span>}
      </header>
      <main>
        <PricingTable 
            initialTeamId={teamId}
            initialUserEmail={session?.email}
            initialUserName={userName}
        />
      </main>
    </div>
  );
}

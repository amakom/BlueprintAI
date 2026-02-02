import Link from 'next/link';
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
        <Link href="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy text-lg font-bold">
            B
          </div>
          <span className="text-navy">BlueprintAI</span>
        </Link>
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

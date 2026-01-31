'use client';

import { useState, useEffect } from 'react';
import { TeamMembersList } from '@/features/team/MembersList';
import { Loader2 } from 'lucide-react';

export default function TeamPage() {
  const [teamInfo, setTeamInfo] = useState<{ teamId: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.teamId) {
          setTeamInfo({ teamId: data.teamId, role: data.role });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan" />
      </div>
    );
  }

  if (!teamInfo) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-navy">No Team Found</h2>
        <p className="text-gray-500 mt-2">You don't appear to be a member of any team.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-navy">Team Management</h1>
        <p className="text-gray-500 mt-2">Manage your team members and permissions.</p>
      </div>

      <TeamMembersList teamId={teamInfo.teamId} currentUserRole={teamInfo.role} />
    </div>
  );
}

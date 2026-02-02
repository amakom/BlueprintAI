'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, Trash2, Shield, User, Clock } from 'lucide-react';
import { InviteMemberModal } from './InviteMemberModal';
import { AlertModal } from '@/components/ui/AlertModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Member {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  status: 'pending'; // inferred
}

interface TeamMembersListProps {
  teamId: string;
  currentUserRole: string;
}

export function TeamMembersList({ teamId, currentUserRole }: TeamMembersListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/teams/${teamId}/members`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInvitations = async () => {
     if (currentUserRole !== 'OWNER' && currentUserRole !== 'ADMIN') return;
     try {
         const res = await fetch(`/api/teams/${teamId}/invite`);
         if (res.ok) {
             const data = await res.json();
             setInvitations(data);
         }
     } catch (error) {
         console.error(error);
     }
  };

  useEffect(() => {
    Promise.all([fetchMembers(), fetchInvitations()]).finally(() => setIsLoading(false));
  }, [teamId, currentUserRole]);

  const handleInvite = async (email: string, role: string) => {
    const res = await fetch(`/api/teams/${teamId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    if (res.ok) {
      fetchInvitations();
    } else {
        const err = await res.json();
        setError(err.error || 'Failed to invite member');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
  };

  const performRemoveMember = async () => {
    if (!memberToRemove) return;

    const res = await fetch(`/api/teams/${teamId}/members?memberId=${memberToRemove}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchMembers();
    } else {
         const err = await res.json();
         setError(err.error || 'Failed to remove member');
    }
    setMemberToRemove(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading members...</div>;
  }

  const canManage = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  return (
    <div className="bg-white rounded-md shadow-sm border border-border">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-navy">Team Members</h2>
          <p className="text-sm text-gray-500">Manage who has access to this team.</p>
        </div>
        {canManage && (
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-cyan text-navy font-bold rounded-md hover:bg-cyan/90 transition-colors text-sm"
          >
            Invite Member
          </button>
        )}
      </div>

      <div className="divide-y divide-border">
        {/* Members */}
        {members.map((member) => (
          <div key={member.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-navy/10 flex items-center justify-center text-navy font-bold overflow-hidden">
                  {member.user.image ? (
                    <img src={member.user.image} alt={member.user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    (member.user.name?.[0] || member.user.email[0]).toUpperCase()
                  )}
                </div>
              <div>
                <p className="font-medium text-navy">{member.user.name || 'User'}</p>
                <p className="text-xs text-gray-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-[10px] px-2 py-0.5 rounded-md border ${
                member.role === 'OWNER' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                member.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {member.role}
              </span>
              {canManage && member.role !== 'OWNER' && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Invitations */}
        {invitations.map((invite) => (
          <div key={invite.id} className="p-4 flex items-center justify-between bg-gray-50/50">
             <div className="flex items-center gap-3 opacity-70">
              <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-600">{invite.email}</p>
                <p className="text-xs text-gray-400">Invitation Pending</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className="px-2 py-1 rounded-md text-xs font-medium border bg-gray-100 text-gray-500 border-gray-200">
                {invite.role}
              </span>
              <button className="text-xs text-gray-400 hover:text-red-500">Revoke</button>
            </div>
          </div>
        ))}
        
        {members.length === 0 && invitations.length === 0 && (
            <div className="p-8 text-center text-gray-500">No members found.</div>
        )}
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />
      
      <AlertModal isOpen={!!error} onClose={() => setError(null)} message={error || ''} />
      
      <ConfirmModal 
        isOpen={!!memberToRemove} 
        onClose={() => setMemberToRemove(null)} 
        onConfirm={performRemoveMember}
        title="Remove Member?"
        message="Are you sure you want to remove this member? They will lose access to the team and its projects."
        confirmText="Remove"
      />
    </div>
  );
}

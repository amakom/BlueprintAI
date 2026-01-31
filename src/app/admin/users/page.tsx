'use client';

import { useEffect, useState } from 'react';
import { Loader2, Shield, Ban, CheckCircle, MoreVertical } from 'lucide-react';
import { UserRole } from '@/lib/permissions';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
        setLoading(false);
      });
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId);
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });
        if (res.ok) fetchUsers();
    } catch (error) {
        console.error(error);
    } finally {
        setActionLoading(null);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    setActionLoading(userId);
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) fetchUsers();
    } catch (error) {
        console.error(error);
    } finally {
        setActionLoading(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-navy" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">User Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-medium text-gray-500">Email / User</th>
                        <th className="p-4 font-medium text-gray-500">Plan</th>
                        <th className="p-4 font-medium text-gray-500">Projects</th>
                        <th className="p-4 font-medium text-gray-500">AI Usage</th>
                        <th className="p-4 font-medium text-gray-500">Status</th>
                        <th className="p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-navy">{user.email}</div>
                                <div className="text-gray-500 text-xs">{user.name}</div>
                            </td>
                            <td className="p-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {user.plan}
                                </span>
                            </td>
                            <td className="p-4 text-gray-600 font-medium">
                                {user.projectCount}
                            </td>
                            <td className="p-4 text-gray-600 font-medium">
                                {user.aiUsageCount}
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-4 flex gap-2">
                                <select 
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    disabled={actionLoading === user.id}
                                    className="text-xs bg-white border border-gray-300 rounded px-2 py-1 focus:ring-cyan focus:border-cyan"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="OWNER">Owner</option>
                                </select>
                                <button 
                                    onClick={() => handleStatusChange(user.id, user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                                    disabled={actionLoading === user.id}
                                    className={`text-xs px-2 py-1 rounded border ${
                                        user.status === 'ACTIVE' 
                                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                            : 'border-green-200 text-green-600 hover:bg-green-50'
                                    }`}
                                >
                                    {user.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

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

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">User Management</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-medium text-gray-500">User</th>
                        <th className="p-4 font-medium text-gray-500">Role</th>
                        <th className="p-4 font-medium text-gray-500">Status</th>
                        <th className="p-4 font-medium text-gray-500">Plan</th>
                        <th className="p-4 font-medium text-gray-500">Joined</th>
                        <th className="p-4 font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                                <div className="font-bold text-slate-900">{user.name}</div>
                                <div className="text-gray-500 text-xs">{user.email}</div>
                            </td>
                            <td className="p-4">
                                <select 
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    disabled={actionLoading === user.id}
                                    className="bg-transparent font-medium text-slate-700 border-none focus:ring-0 cursor-pointer"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="OWNER">Owner</option>
                                </select>
                            </td>
                            <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="uppercase text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    {user.plan}
                                </span>
                            </td>
                            <td className="p-4 text-gray-400">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {user.status === 'ACTIVE' ? (
                                        <button 
                                            onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                                            disabled={actionLoading === user.id}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                                            title="Suspend User"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                                            disabled={actionLoading === user.id}
                                            className="p-2 text-green-500 hover:bg-green-50 rounded"
                                            title="Activate User"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
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

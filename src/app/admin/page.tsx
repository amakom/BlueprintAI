'use client';

import { useEffect, useState } from 'react';
import { Users, Folder, DollarSign, Activity, Loader2, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">System Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Total Projects" 
            value={stats.totalProjects} 
            icon={Folder} 
            color="bg-indigo-500" 
        />
        <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue.toLocaleString()}`} 
            icon={DollarSign} 
            color="bg-green-500" 
        />
        <StatCard 
            title="AI Requests" 
            value={stats.totalAIRequests} 
            icon={Activity} 
            color="bg-purple-500" 
        />
        <StatCard 
            title="System Errors (24h)" 
            value={stats.recentErrors} 
            icon={AlertTriangle} 
            color={stats.recentErrors > 0 ? "bg-red-500" : "bg-emerald-500"} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50">
                    <tr>
                        <th className="p-3 font-medium text-gray-500">Name</th>
                        <th className="p-3 font-medium text-gray-500">Email</th>
                        <th className="p-3 font-medium text-gray-500">Joined</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.recentSignups.map((user: any) => (
                        <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="p-3 text-slate-900 font-medium">{user.name}</td>
                            <td className="p-3 text-gray-500">{user.email}</td>
                            <td className="p-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    );
}

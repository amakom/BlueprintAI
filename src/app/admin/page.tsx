'use client';

import { useEffect, useState } from 'react';
import { Users, Folder, DollarSign, Activity, Zap, TrendingUp, Calendar } from 'lucide-react';

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

  if (loading) return (
    <div className="flex items-center justify-center h-full text-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
          <h1 className="text-3xl font-bold text-navy">Overview</h1>
          <p className="text-gray-500 mt-1">System performance and key metrics</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Total Users */}
        <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={Users} 
            color="bg-blue-500" 
            textColor="text-blue-600"
            bgLight="bg-blue-50"
        />

        {/* Active Users */}
        <StatCard 
            title="Active Users" 
            value={stats.activeUsers7d} 
            subValue={`/ ${stats.activeUsers30d} (30d)`}
            label="7d Active"
            icon={Zap} 
            color="bg-amber-500" 
            textColor="text-amber-600"
            bgLight="bg-amber-50"
        />

        {/* Total Projects */}
        <StatCard 
            title="Total Projects" 
            value={stats.totalProjects} 
            icon={Folder} 
            color="bg-indigo-500" 
            textColor="text-indigo-600"
            bgLight="bg-indigo-50"
        />

        {/* AI Calls Today */}
        <StatCard 
            title="AI Calls Today" 
            value={stats.aiCallsToday} 
            icon={Activity} 
            color="bg-cyan-500" 
            textColor="text-cyan-600"
            bgLight="bg-cyan-50"
        />

        {/* Revenue */}
        <StatCard 
            title="Revenue" 
            value={`$${stats.revenueToday.toLocaleString()}`} 
            subValue={`/ $${stats.revenueMonth.toLocaleString()}`}
            label="Today / Month"
            icon={DollarSign} 
            color="bg-emerald-500" 
            textColor="text-emerald-600"
            bgLight="bg-emerald-50"
        />
      </div>

      {/* Recent Signups Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-navy">Recent Signups</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/30">
                    <tr>
                        <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                        <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                        <th className="px-6 py-3 font-medium text-gray-500">Joined</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {stats.recentSignups.map((user: any) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-navy font-medium">{user.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, label, icon: Icon, color, textColor, bgLight }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between h-full transition-all hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-bold text-navy">{value}</h3>
                        {subValue && <span className="text-sm text-gray-400 font-medium">{subValue}</span>}
                    </div>
                    {label && <p className="text-xs text-gray-400 mt-1">{label}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg ${bgLight} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${textColor}`} />
                </div>
            </div>
        </div>
    );
}

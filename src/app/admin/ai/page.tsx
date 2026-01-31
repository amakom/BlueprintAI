
'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap, Server, BarChart3 } from 'lucide-react';

interface Stats {
  requests: number;
  tokens: number;
}

interface Log {
  id: string;
  teamName: string;
  action: string;
  model: string;
  tokens: number;
  createdAt: string;
}

interface TeamUsage {
  teamId: string;
  teamName: string;
  requests: number;
  totalTokens: number;
}

export default function AdminAIPage() {
  const [stats, setStats] = useState<Stats>({ requests: 0, tokens: 0 });
  const [logs, setLogs] = useState<Log[]>([]);
  const [topTeams, setTopTeams] = useState<TeamUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/ai/usage');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.recentLogs);
        setTopTeams(data.topTeams);
      }
    } catch (error) {
      console.error('Failed to fetch AI usage', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
        <Activity className="w-6 h-6" />
        AI Monitoring
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <Zap className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Requests</p>
                    <h3 className="text-2xl font-bold text-navy">{stats.requests.toLocaleString()}</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Server className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Tokens</p>
                    <h3 className="text-2xl font-bold text-navy">{stats.tokens.toLocaleString()}</h3>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Active Teams</p>
                    <h3 className="text-2xl font-bold text-navy">{topTeams.length}</h3>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Teams */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-navy">Top Consumers</h3>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Team</th>
                        <th className="px-6 py-3">Reqs</th>
                        <th className="px-6 py-3">Tokens</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {topTeams.length === 0 ? (
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No data</td></tr>
                    ) : (
                        topTeams.map(team => (
                            <tr key={team.teamId}>
                                <td className="px-6 py-3 text-sm text-navy font-medium">{team.teamName}</td>
                                <td className="px-6 py-3 text-sm text-gray-600">{team.requests}</td>
                                <td className="px-6 py-3 text-sm text-gray-600">{team.totalTokens.toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold text-navy">Recent Activity</h3>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                    <tr>
                        <th className="px-6 py-3">Team</th>
                        <th className="px-6 py-3">Model</th>
                        <th className="px-6 py-3">Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {logs.length === 0 ? (
                        <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">No logs</td></tr>
                    ) : (
                        logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-3 text-sm text-navy font-medium">{log.teamName}</td>
                                <td className="px-6 py-3 text-sm text-gray-600">{log.model}</td>
                                <td className="px-6 py-3 text-sm text-gray-500">{new Date(log.createdAt).toLocaleTimeString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}

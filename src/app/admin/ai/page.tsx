'use client';

import { useEffect, useState } from 'react';
import { Activity, Zap, Server, BarChart3, Ban, RotateCcw, CheckCircle } from 'lucide-react';

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
  aiBlocked: boolean;
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

  const handleBlock = async (teamId: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} AI usage for this team?`)) return;
    try {
      const res = await fetch(`/api/admin/ai/teams/${teamId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocked: !currentStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to update block status', error);
    }
  };

  const handleReset = async (teamId: string) => {
    if (!confirm('Are you sure you want to RESET usage logs for this team for the current month? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/ai/teams/${teamId}/reset`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchData();
        alert('Usage reset successfully.');
      }
    } catch (error) {
      console.error('Failed to reset usage', error);
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
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-navy">Top Usage by Team</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left">Team</th>
                            <th className="px-4 py-3 text-right">Reqs</th>
                            <th className="px-4 py-3 text-right">Tokens</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {topTeams.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No usage data found.
                                </td>
                            </tr>
                        ) : (
                            topTeams.map((team) => (
                                <tr key={team.teamId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-navy">{team.teamName}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{team.requests}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{team.totalTokens.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        {team.aiBlocked ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Blocked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center flex justify-center gap-2">
                                        <button 
                                            onClick={() => handleBlock(team.teamId, team.aiBlocked)}
                                            className={`p-1 rounded hover:bg-gray-200 ${team.aiBlocked ? 'text-green-600' : 'text-red-600'}`}
                                            title={team.aiBlocked ? "Unblock AI" : "Block AI"}
                                        >
                                            {team.aiBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            onClick={() => handleReset(team.teamId)}
                                            className="p-1 text-blue-600 rounded hover:bg-gray-200"
                                            title="Reset Usage"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-semibold text-navy">Recent Activity</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left">Team</th>
                            <th className="px-4 py-3 text-left">Action</th>
                            <th className="px-4 py-3 text-right">Tokens</th>
                            <th className="px-4 py-3 text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {logs.length === 0 ? (
                             <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                    No recent logs.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-navy">{log.teamName}</td>
                                    <td className="px-4 py-3 text-gray-600">{log.action}</td>
                                    <td className="px-4 py-3 text-right text-gray-600">{log.tokens}</td>
                                    <td className="px-4 py-3 text-right text-gray-500 text-xs">
                                        {new Date(log.createdAt).toLocaleTimeString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
      </div>
    </div>
  );
}

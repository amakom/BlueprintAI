'use client';

import { useEffect, useState } from 'react';
import { Activity, RefreshCw, AlertTriangle, Info, AlertCircle } from 'lucide-react';

interface SystemLog {
  id: string;
  level: string;
  category: string;
  message: string;
  metadata: any;
  createdAt: string;
}

export default function AdminSystemPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, [levelFilter, categoryFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter !== 'ALL') params.append('level', levelFilter);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      
      const res = await fetch(`/api/admin/system/logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Failed to fetch system logs', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'ERROR': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'WARN': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const styles: Record<string, string> = {
        ERROR: 'bg-red-100 text-red-800',
        WARN: 'bg-yellow-100 text-yellow-800',
        INFO: 'bg-blue-100 text-blue-800'
    };
    const style = styles[level] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
            {level}
        </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <Activity className="w-6 h-6" />
          System Health
        </h1>
        <button 
            onClick={fetchLogs} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh"
        >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="border-gray-300 rounded-md text-sm focus:ring-cyan focus:border-cyan"
        >
            <option value="ALL">All Levels</option>
            <option value="ERROR">Error</option>
            <option value="WARN">Warning</option>
            <option value="INFO">Info</option>
        </select>
        <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border-gray-300 rounded-md text-sm focus:ring-cyan focus:border-cyan"
        >
            <option value="ALL">All Categories</option>
            <option value="AUTH">Auth</option>
            <option value="API">API</option>
            <option value="DATABASE">Database</option>
            <option value="AI">AI</option>
            <option value="BILLING">Billing</option>
            <option value="SYSTEM">System</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Metadata</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No logs found matching filters</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                            {getLevelIcon(log.level)}
                            {getLevelBadge(log.level)}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {log.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 break-all max-w-md">
                        {log.message}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-gray-500 max-w-xs truncate" title={JSON.stringify(log.metadata, null, 2)}>
                        {JSON.stringify(log.metadata)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

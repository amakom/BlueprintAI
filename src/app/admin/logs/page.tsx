'use client';

import { useEffect, useState } from 'react';
import { FileText, AlertTriangle, Shield, Activity, Webhook } from 'lucide-react';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<{ systemLogs: any[], webhookLogs: any[], auditLogs: any[] }>({ systemLogs: [], webhookLogs: [], auditLogs: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'system' | 'webhooks' | 'audit'>('system');

  useEffect(() => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-navy">
        <div className="animate-spin rounded-md h-8 w-8 border-b-2 border-navy"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
          <FileText className="w-6 h-6" />
          System Logs
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
          <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'system' 
                      ? 'border-navy text-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              System Events
          </button>
          <button
              onClick={() => setActiveTab('webhooks')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'webhooks' 
                      ? 'border-navy text-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              Webhooks
          </button>
          <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'audit' 
                      ? 'border-navy text-navy' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
              User Audit
          </button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    {activeTab === 'system' && (
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Time</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Level</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Category</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Message</th>
                        </tr>
                    )}
                    {activeTab === 'webhooks' && (
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Time</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Provider</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Event</th>
                        </tr>
                    )}
                    {activeTab === 'audit' && (
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Time</th>
                            <th className="px-6 py-4 font-medium text-gray-500">User</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Action</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Resource</th>
                        </tr>
                    )}
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {activeTab === 'system' && logs.systemLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                        log.level === 'ERROR' ? 'bg-red-100 text-red-700' :
                        log.level === 'WARN' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                                    {log.level}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-navy">{log.category}</td>
                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{log.message}</td>
                        </tr>
                    ))}

                    {activeTab === 'webhooks' && logs.webhookLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 font-medium text-navy">{log.provider}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                                    log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {log.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600 font-mono text-xs">{log.eventType || 'N/A'}</td>
                        </tr>
                    ))}

                    {activeTab === 'audit' && logs.auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-navy font-medium">{log.user?.email || 'System'}</td>
                            <td className="px-6 py-4 text-gray-700">{log.action}</td>
                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">{log.resource}</td>
                        </tr>
                    ))}
                    
                    {/* Empty States */}
                    {activeTab === 'system' && logs.systemLogs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No system logs found</td></tr>}
                    {activeTab === 'webhooks' && logs.webhookLogs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No webhook logs found</td></tr>}
                    {activeTab === 'audit' && logs.auditLogs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No audit logs found</td></tr>}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

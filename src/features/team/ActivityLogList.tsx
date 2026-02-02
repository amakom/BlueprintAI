'use client';

import { useState, useEffect } from 'react';
import { History } from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  metadata?: any;
}

export function ActivityLogList({ projectId }: { projectId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectId}/activity`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading activity...</div>;

  return (
    <div className="bg-white rounded-md shadow-sm border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-navy flex items-center gap-2">
          <History className="w-5 h-5 text-cyan" />
          Activity Log
        </h2>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No recent activity.</div>
        ) : (
          <div className="divide-y divide-border">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex gap-3 hover:bg-gray-50 transition-colors">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-md bg-navy/10 flex items-center justify-center text-navy text-xs font-bold overflow-hidden">
                     {log.user.image ? (
                        <img src={log.user.image} alt={log.user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        (log.user.name?.[0] || log.user.email[0]).toUpperCase()
                      )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy">
                    <span className="font-semibold">{log.user.name || log.user.email}</span>{' '}
                    {formatAction(log.action)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {timeAgo(log.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatAction(action: string) {
  switch (action) {
    case 'create_project': return 'created this project';
    case 'update_settings': return 'updated project settings';
    case 'create_doc': return 'created a document';
    case 'edit_doc': return 'edited a document';
    default: return action.replace(/_/g, ' ');
  }
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

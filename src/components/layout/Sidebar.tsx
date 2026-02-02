'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Layers, Settings, FileText, PlusCircle, LogOut, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard' },
  { label: 'Projects', icon: Layers, href: '/dashboard' },
  { label: 'Team', icon: Users, href: '/team' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { UserRole } from '@/lib/permissions';
import { ShieldAlert } from 'lucide-react';

export function Sidebar() {
  const router = useRouter();
  const { plan, isLoading: isSubLoading } = useSubscription();
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(err => console.error(err));

    // Fetch recent projects
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.projects)) {
          setRecentProjects(data.projects.slice(0, 5));
        }
      })
      .catch(err => console.error('Failed to fetch projects', err));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isAdminOrOwner = user?.role === UserRole.ADMIN || user?.role === UserRole.OWNER;
  const isOwner = user?.role === UserRole.OWNER;

  return (
    <aside className="w-60 bg-navy text-white flex flex-col h-screen border-r border-navy/20">
      <div className="p-6">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy">
              B
            </div>
            BlueprintAI
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <div className="mb-6">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-white/10 text-gray-300 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {isAdminOrOwner && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "hover:bg-white/10 text-amber hover:text-white"
              )}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin Panel
            </Link>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Recent Projects
            </p>
            <button className="text-cyan hover:text-cyan/80">
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/project/${project.id}`}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-white/10 text-gray-300 hover:text-white"
                >
                  <FileText className="w-4 h-4 text-cyan" />
                  <span className="truncate">{project.name}</span>
                </Link>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-gray-500 italic">
                No recent projects
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan text-navy flex items-center justify-center font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'User Name'}
              </p>
              <div className="flex items-center gap-2">
                 <p className="text-xs text-gray-400">
                    {isSubLoading ? 'Loading...' : (isOwner ? 'Owner Access' : `${plan} Plan`)}
                 </p>
                 {plan === 'FREE' && !isOwner && (
                     <Link href="/pricing" className="text-[10px] bg-cyan text-navy px-1.5 py-0.5 rounded font-bold hover:bg-cyan/90">
                        UPGRADE
                     </Link>
                 )}
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

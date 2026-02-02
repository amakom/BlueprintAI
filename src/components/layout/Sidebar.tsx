'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Layers, Settings, FileText, PlusCircle, LogOut, Users, Menu, X } from 'lucide-react';
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link href="/" className="block">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy text-lg font-bold">
              B
            </div>
            BlueprintAI
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="mb-6">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
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
              onClick={() => setIsMobileOpen(false)}
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
                  onClick={() => setIsMobileOpen(false)}
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

      <div className="p-4 border-t border-white/10 mt-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-cyan text-navy flex items-center justify-center font-bold">
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
                     <Link href="/pricing" className="text-[10px] bg-cyan text-navy px-1.5 py-0.5 rounded-md font-bold hover:bg-cyan/90">
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-navy text-white rounded-md shadow-lg hover:bg-navy/90 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 bg-navy text-white flex-col h-screen border-r border-navy/20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="absolute left-0 top-0 h-full w-72 bg-navy text-white shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col">
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

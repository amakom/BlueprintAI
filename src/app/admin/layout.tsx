import { getSession } from '@/lib/auth';
import { UserRole } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, Activity, ShieldAlert, Folder, FileText } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.role !== UserRole.ADMIN && session.role !== UserRole.OWNER)) {
    redirect('/dashboard');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Projects', href: '/admin/projects', icon: Folder },
    { label: 'Billing', href: '/admin/billing', icon: CreditCard },
    { label: 'AI Usage', href: '/admin/ai', icon: Activity },
    { label: 'System Logs', href: '/admin/logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="text-red-500" />
                Admin Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1">God Mode Active</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
                <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
            <Link href="/dashboard" className="block text-center py-2 text-sm text-slate-400 hover:text-white">
                Exit to App
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

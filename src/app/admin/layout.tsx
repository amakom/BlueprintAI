import { getSession } from '@/lib/auth';
import { UserRole } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, Activity, ShieldAlert, Folder, FileText, Server } from 'lucide-react';

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
    { label: 'Payments', href: '/admin/billing', icon: CreditCard },
    { label: 'Logs', href: '/admin/logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-navy text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
            <Link href="/" className="block">
              <h1 className="text-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <div className="w-8 h-8 bg-cyan rounded-md flex items-center justify-center text-navy font-bold">
                    B
                  </div>
                  BlueprintAI
              </h1>
            </Link>
            <div className="mt-4 flex items-center gap-2 text-amber">
               <ShieldAlert className="w-4 h-4" />
               <span className="text-xs font-semibold uppercase tracking-wider">Admin Panel</span>
            </div>
            <p className="text-xs text-cyan mt-1">System Owner</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
                <Link 
                    key={item.href} 
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-white/10">
            <Link href="/dashboard" className="block text-center py-2 text-sm text-gray-400 hover:text-white">
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

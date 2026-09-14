'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/store/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuth();
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);

  // Fetch pending orders count for badge notification
  useEffect(() => {
    let isMounted = true;

    const fetchPendingCount = async () => {
      try {
        const response = await api.get<any>('/api/admin/stats', true);
        if (isMounted && response?.data?.pendingOrders !== undefined) {
          setPendingOrdersCount(response.data.pendingOrders);
        }
      } catch (error) {
        // Silently catch in sidebar
      }
    };

    fetchPendingCount();

    // Refresh every 30 seconds to catch new incoming orders
    const interval = setInterval(fetchPendingCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const adminNavItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: Package,
      badge: null,
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? (
        <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-rose-600 rounded-full animate-pulse shadow-sm">
          {pendingOrdersCount} NEW
        </span>
      ) : null,
    },
    {
      title: 'Instagram Gallery',
      href: '/admin/instagram-gallery',
      icon: ImageIcon,
      badge: null,
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2" onClick={handleNavClick}>
          <span className="text-2xl font-bold text-primary-500">VeilVogue</span>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <Separator />

      <div className="flex-1 p-4">
        <div className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick} className="block">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start relative',
                    isActive && 'bg-primary-500 text-white hover:bg-primary-600 font-semibold'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate">{item.title}</span>
                  {item.badge}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="p-4 space-y-4">
        <div className="text-sm">
          <p className="font-medium truncate">{user?.name || 'Administrator'}</p>
          <p className="text-muted-foreground truncate">{user?.email}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
        <Link href="/" onClick={handleNavClick}>
          <Button variant="ghost" className="w-full">Back to Store</Button>
        </Link>
      </div>
    </div>
  );
}

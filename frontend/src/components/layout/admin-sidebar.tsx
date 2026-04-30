'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/store/auth';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Instagram Gallery',
    href: '/admin/instagram-gallery',
    icon: Image,
  },
];

interface AdminSidebarProps {
  onNavigate?: () => void;
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuth();

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
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} href={item.href} onClick={handleNavClick}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-primary-500 text-white hover:bg-primary-600'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="p-4 space-y-4">
        <div className="text-sm">
          <p className="font-medium truncate">{user?.name}</p>
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

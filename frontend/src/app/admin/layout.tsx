'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { LoadingSpinner } from '@/components/common/loading-spinner';
import { toast } from 'sonner';
import './admin.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, _hasHydrated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (_hasHydrated) {
      if (!isAuthenticated) {
        toast.error('Please login to access admin panel');
        router.push('/login?returnUrl=/admin');
      } else if (!isAdmin || user?.role !== 'ADMIN') {
        toast.error('Access denied. Admin privileges required.');
        router.push('/');
      } else {
        setIsChecking(false);
      }
    }
  }, [_hasHydrated, isAuthenticated, isAdmin, user, router]);

  if (!_hasHydrated || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="admin-wrapper">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-md shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-64 z-30 overflow-y-auto bg-white border-r">
        <AdminSidebar />
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-64 z-50 overflow-y-auto bg-white border-r">
            <AdminSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="admin-main-content px-4 lg:px-8">
        {children}
      </main>
    </div>
  );
}

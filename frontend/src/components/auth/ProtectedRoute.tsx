'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isChecking || !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={3} height="h-8" className="mb-4" />
      </div>
    );
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const auth = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Check localStorage immediately (synchronous)
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem('veilvogue-auth');
        if (authData) {
          const parsed = JSON.parse(authData);
          const isAuthenticated = parsed.state?.isAuthenticated || false;
          const isAdmin = parsed.state?.isAdmin || false;
          const role = parsed.state?.user?.role;

          console.log('🔐 AdminRoute Check:', {
            isAuthenticated,
            isAdmin,
            role,
            source: 'localStorage'
          });

          if (isAuthenticated && isAdmin && role === 'ADMIN') {
            console.log('✅ Admin access granted!');
            setHasAccess(true);
            setIsReady(true);
            return true;
          }
        }
      } catch (e) {
        console.error('❌ Error checking auth:', e);
      }

      // If localStorage check failed, deny access
      console.log('❌ Admin access denied');
      setHasAccess(false);
      setIsReady(true);
      return false;
    };

    // Run check immediately
    const hasAuth = checkAuth();

    // If no auth, redirect after a moment
    if (!hasAuth) {
      const timer = setTimeout(() => {
        if (!auth.isAuthenticated) {
          console.log('🔄 Redirecting to login');
          toast.error('Please login to access admin panel');
          router.push('/login?returnUrl=/admin');
        } else if (!auth.isAdmin) {
          console.log('🔄 Redirecting to home');
          toast.error('Access denied. Admin privileges required.');
          router.push('/');
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [auth, router]);

  // Show loading until ready
  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <LoadingSkeleton count={3} height="h-8" className="mb-4" />
          <p className="text-sm text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If no access, show loading (will redirect)
  if (!hasAccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={3} height="h-8" className="mb-4" />
      </div>
    );
  }

  // Render dashboard
  console.log('🎉 Rendering admin dashboard');
  return <>{children}</>;
}

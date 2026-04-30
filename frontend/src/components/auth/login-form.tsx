'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { AuthResponse } from '@/types/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post<any>('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      // Backend returns: { success: true, data: { user, token } }
      const { user, token } = response.data;

      // Get return URL before async operations
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';

      console.log('✅ Login Success - User:', user.name, 'Role:', user.role);
      console.log('🔄 Will redirect to:', returnUrl);

      // Store user and token in auth store
      setAuth(user, token);

      toast.success('Login successful!', {
        description: `Welcome back, ${user.name}!`,
      });

      // Use requestAnimationFrame to ensure state is flushed to localStorage
      // This is more reliable than setTimeout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('🚀 Redirecting now to:', returnUrl);
          router.push(returnUrl);
        });
      });
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Invalid email or password';
      toast.error('Login failed', {
        description: errorMessage,
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

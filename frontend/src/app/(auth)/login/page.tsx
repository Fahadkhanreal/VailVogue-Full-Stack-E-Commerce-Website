import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Login to your VeilVogue account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-primary-500 hover:text-primary-600 hover:underline font-medium transition-colors">
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

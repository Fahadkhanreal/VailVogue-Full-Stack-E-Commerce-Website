import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary-500">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go to Homepage</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" size="lg">Browse Products</Button>
          </Link>
        </div>

        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

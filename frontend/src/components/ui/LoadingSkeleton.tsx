import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  count?: number;
  height?: string;
  className?: string;
}

export function LoadingSkeleton({ count = 1, height = 'h-4', className }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-muted rounded-md',
            height,
            className
          )}
        />
      ))}
    </>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-muted animate-pulse rounded-lg" />
          {/* Title skeleton */}
          <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          {/* Price skeleton */}
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-5 w-64 mb-8" />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-20" />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}

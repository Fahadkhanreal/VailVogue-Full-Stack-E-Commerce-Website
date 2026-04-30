import { Skeleton } from '@/components/ui/skeleton';

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="flex gap-8">
        <aside className="hidden md:block w-64 flex-shrink-0">
          <Skeleton className="h-[600px] w-full" />
        </aside>

        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

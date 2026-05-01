'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductFilters } from '@/components/product/product-filters';
import { ProductSort } from '@/components/product/product-sort';
import { ProductSearch } from '@/components/product/product-search';
import { EmptyState } from '@/components/common/empty-state';
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Filter, Package } from 'lucide-react';
import { Category, Size, ProductSortOption, Product } from '@/types';
import { api, ApiError } from '@/lib/api';
import { ProductsResponse } from '@/types/api';
import { toast } from 'sonner';
import { CATEGORIES } from '@/lib/constants';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  const [sortOption, setSortOption] = useState<ProductSortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<{
    categories: Category[];
    sizes: Size[];
    minPrice?: number;
    maxPrice?: number;
  }>({
    categories: [],
    sizes: [],
  });

  // Initialize filter with URL category on mount
  useEffect(() => {
    if (categoryFromUrl) {
      const categoryName = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
      if (CATEGORIES.some(cat => cat.name === categoryName)) {
        setFilters(prev => ({
          ...prev,
          categories: [categoryName as Category],
        }));
      }
    }
  }, [categoryFromUrl]);

  // API integration state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from backend
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();

        // Add limit to prevent loading too many products at once
        params.append('limit', '50');

        if (searchQuery) params.append('search', searchQuery);
        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

        // Use filter state categories (which includes URL category from initialization)
        if (filters.categories.length > 0) {
          const categoryString = filters.categories.map(c => c.toLowerCase()).join(',');
          params.append('category', categoryString);
        }

        // Map sort option to backend format
        const sortMap: Record<ProductSortOption, string> = {
          'newest': 'newest',
          'price-low': 'price-asc',
          'price-high': 'price-desc',
          'popular': 'newest',
        };
        params.append('sort', sortMap[sortOption]);

        const queryString = params.toString();
        const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;

        const response = await api.get<any>(endpoint);
        const mappedProducts = (response.data?.products || []).map((p: any) => ({
          ...p,
          category: p.category?.name || p.category,
          discountedPrice: p.discountPrice,
          discount: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : undefined,
        }));
        setProducts(mappedProducts);
      } catch (err) {
        const errorMessage = err instanceof ApiError
          ? err.message
          : 'Failed to load products';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, filters.categories, filters.minPrice, filters.maxPrice, sortOption, categoryFromUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">
          Discover our collection of modest fashion
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <ProductSearch onSearch={setSearchQuery} />
        </div>
        <ProductSort value={sortOption} onChange={setSortOption} />

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <div className="py-4">
              <ProductFilters onFilterChange={setFilters} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <ProductFilters onFilterChange={setFilters} />
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <EmptyState
              icon={Package}
              title="Failed to load products"
              description={error}
              action={
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              }
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products found"
              description="Try adjusting your filters or search query"
              action={
                <Button onClick={() => setFilters({ categories: [], sizes: [] })}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing {products.length} products
              </div>
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: {
    id: string;
    name: string;
  };
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const PAGE_LIMIT = 10;

  const fetchProducts = async (page = currentPage, query = searchQuery) => {
    setIsLoading(true);
    try {
      const searchParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : '';
      const response = await api.get<any>(
        `/api/products?page=${page}&limit=${PAGE_LIMIT}${searchParam}`,
        true
      );
      
      const productsData = response.data?.products || [];
      const paginationData = response.data?.pagination || {
        page,
        limit: PAGE_LIMIT,
        total: productsData.length,
        totalPages: Math.ceil(productsData.length / PAGE_LIMIT) || 1,
      };

      setProducts(productsData);
      setPagination(paginationData);
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to load products';
      toast.error('Error', { description: errorMessage });
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [currentPage]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1, searchQuery);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/api/products/${productId}`, true);
      toast.success('Product deleted successfully');
      fetchProducts(currentPage, searchQuery);
    } catch (error) {
      console.error('❌ Delete error:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to delete product';
      toast.error('Error', { description: errorMessage });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store catalog, edit prices and inventory.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto font-semibold shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products by title, category, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Total: <span className="font-semibold text-foreground">{pagination.total}</span> products
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <LoadingSkeleton count={1} height="h-12" className="w-64" />
          <LoadingSkeleton count={5} height="h-16" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={searchQuery ? 'Try a different search term.' : 'Add your first product to get started.'}
          action={
            !searchQuery && (
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-xl overflow-hidden bg-card shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const discount = product.discountPrice
                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                    : 0;

                  return (
                    <TableRow key={product.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="relative w-12 h-14 rounded-lg overflow-hidden border bg-muted shrink-0 shadow-xs">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm text-foreground line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                          {product.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {product.category?.name || 'Uncategorized'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-sm">
                          Rs. {product.price.toLocaleString()}
                        </div>
                        {discount > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600">
                            {discount}% OFF (Rs. {product.discountPrice?.toLocaleString()})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock > 10
                              ? 'default'
                              : product.stock > 0
                              ? 'secondary'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {product.stock} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.featured && (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-800 border-amber-300">
                              Featured
                            </Badge>
                          )}
                          {product.bestseller && (
                            <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-800 border-purple-300">
                              Bestseller
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/30"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {products.map((product) => {
              const discount = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;

              return (
                <div key={product.id} className="border rounded-xl p-4 space-y-3 bg-card shadow-sm">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden border bg-muted shrink-0 shadow-xs">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="w-5 h-5 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{product.slug}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Badge variant="outline" className="text-[10px]">
                          {product.category?.name}
                        </Badge>
                        <Badge
                          variant={product.stock > 0 ? 'secondary' : 'destructive'}
                          className="text-[10px]"
                        >
                          {product.stock} stock
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-sm border-t">
                    <div>
                      <span className="font-bold">Rs. {product.price.toLocaleString()}</span>
                      {discount > 0 && (
                        <span className="text-xs text-emerald-600 font-bold ml-1.5">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-foreground">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-semibold text-foreground">{pagination.total}</span> products
              </p>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="h-8 px-2.5"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>

                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrent = pageNum === pagination.page;
                  // Show current page, first, last, and immediate neighbors
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                  ) {
                    return (
                      <Button
                        key={pageNum}
                        variant={isCurrent ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8 w-8 p-0 text-xs font-semibold ${
                          isCurrent ? 'bg-primary text-white shadow-xs' : ''
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  } else if (
                    pageNum === pagination.page - 2 ||
                    pageNum === pagination.page + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-1 text-xs text-muted-foreground">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="h-8 px-2.5"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

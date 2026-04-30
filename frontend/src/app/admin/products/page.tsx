'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
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
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch with a reasonable limit to avoid hanging
      const response = await api.get<any>('/api/products?limit=100', true);
      // Backend returns: { success: true, data: { products, pagination } }
      setProducts(response.data.products || []);
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

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting product:', productId);
      const response = await api.delete(`/api/products/${productId}`, true);
      console.log('✅ Delete response:', response);
      toast.success('Product deleted successfully');
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('❌ Delete error:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to delete product';
      toast.error('Error', { description: errorMessage });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height="h-12" className="w-64" />
        <LoadingSkeleton count={5} height="h-16" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table - Desktop */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={searchQuery ? "Try a different search term" : "Add your first product to get started"}
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
          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const discount = product.discountPrice
                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                    : 0;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images[0] && (
                            <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        <div>Rs. {product.price.toLocaleString()}</div>
                        {discount > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {discount}% OFF
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                          {product.stock} units
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {product.featured && <Badge variant="outline">Featured</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
            {filteredProducts.map((product) => {
              const discount = product.discountPrice
                ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                : 0;

              return (
                <div key={product.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    {product.images[0] && (
                      <div className="relative w-20 h-20 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{product.slug}</p>
                      <Badge variant="outline" className="mt-1">{product.category.name}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Rs. {product.price.toLocaleString()}</div>
                      {discount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <Badge variant={product.stock > 10 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                      {product.stock} units
                    </Badge>
                  </div>

                  {product.featured && (
                    <Badge variant="outline">Featured</Badge>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

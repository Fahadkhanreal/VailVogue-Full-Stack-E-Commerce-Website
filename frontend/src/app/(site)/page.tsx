'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/common/hero';
import { CategoryCard } from '@/components/common/category-card';
import { ProductCard } from '@/components/product/product-card';
import { Gallery } from '@/components/common/gallery';
import { CallToAction } from '@/components/common/call-to-action';
import { CATEGORIES } from '@/lib/constants';
import { api, ApiError } from '@/lib/api';
import { Product } from '@/types';
import { toast } from 'sonner';
import { generateOrganizationSchema } from '@/lib/seo';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBestsellersLoading, setIsBestsellersLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await api.get<any>('/api/products?featured=true&limit=8');

        // Map API products to frontend Product type
        const mappedProducts: Product[] = (response.data?.products || response.products || []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: p.price,
          discountedPrice: p.discountPrice,
          discount: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : undefined,
          category: p.category?.name || 'Uncategorized',
          sizes: p.sizes || [],
          colors: p.colors,
          images: p.images || [],
          stock: p.stock,
          featured: p.featured,
          bestseller: false,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));

        setFeaturedProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        if (err instanceof ApiError) {
          toast.error('Failed to load featured products');
        }
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchBestsellerProducts() {
      try {
        // Fetch bestseller products from backend
        const response = await api.get<any>('/api/products?bestseller=true&limit=8');

        // Map API products to frontend Product type
        const mappedProducts: Product[] = (response.data?.products || response.products || []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          description: p.description,
          price: p.price,
          discountedPrice: p.discountPrice,
          discount: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : undefined,
          category: p.category?.name || 'Uncategorized',
          sizes: p.sizes || [],
          colors: p.colors,
          images: p.images || [],
          stock: p.stock,
          featured: p.featured,
          bestseller: true,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));

        setBestsellerProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching bestseller products:', err);
        if (err instanceof ApiError) {
          toast.error('Failed to load bestseller products');
        }
      } finally {
        setIsBestsellersLoading(false);
      }
    }

    fetchFeaturedProducts();
    fetchBestsellerProducts();
  }, []);

  return (
    <div>
      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationSchema()),
        }}
      />

      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground">
            Explore our curated collection of modest fashion
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-beige-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">
              Handpicked favorites from our latest collection
            </p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 8).map((product, index) => (
                  <ProductCard key={product.id} product={product} priority={index < 4} />
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">No featured products available</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
          <p className="text-muted-foreground">
            Our customers' favorite picks
          </p>
        </div>
        {isBestsellersLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellerProducts.length > 0 ? (
              bestsellerProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} priority={false} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No bestseller products available</p>
            )}
          </div>
        )}
      </section>

      {/* Modest Fashion Highlight */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Modest Fashion, Modern Style</h2>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            VeilVogue brings you the perfect blend of traditional elegance and contemporary design.
            Each piece is carefully crafted to celebrate modesty while embracing modern fashion trends.
          </p>
        </div>
      </section>

      {/* Instagram Gallery */}
      <Gallery />

      {/* Call to Action */}
      <CallToAction />
    </div>
  );
}

'use client';

import { use, useState, useEffect } from 'react';
import { ImageCarousel } from '@/components/product/image-carousel';
import { SizeSelector } from '@/components/product/size-selector';
import { ColorSelector } from '@/components/product/color-selector';
import { RelatedProducts } from '@/components/product/related-products';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Size } from '@/types';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import { useCart } from '@/store/cart';
import { toast } from 'sonner';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { api, ApiError } from '@/lib/api';
import { Product } from '@/types';
import { ProductResponse } from '@/types/api';
import { CATEGORIES } from '@/lib/constants';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params Promise using React.use()
  const { slug } = use(params);

  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((state) => state.addItem);

  // API integration state
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from backend
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.get<any>(`/api/products/slug/${slug}`);
        // Backend returns: { success: true, data: product }
        const productData = response.data;
        console.log('🛍️ Product fetched:', productData.name);
        console.log('🖼️ Product images:', productData.images);
        console.log('🖼️ Total images count:', productData.images?.length || 0);
        setProduct(productData);
      } catch (err) {
        const errorMessage = err instanceof ApiError
          ? err.message
          : 'Failed to load product';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton count={1} height="h-8" className="w-64 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <LoadingSkeleton count={1} height="h-96" />
          <div className="space-y-4">
            <LoadingSkeleton count={1} height="h-8" />
            <LoadingSkeleton count={1} height="h-6" className="w-32" />
            <LoadingSkeleton count={1} height="h-10" className="w-48" />
            <LoadingSkeleton count={3} height="h-4" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => window.location.href = '/shop'}>
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }
  const finalPrice = product.discountedPrice || product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.images[0],
    });

    toast.success('Added to cart!', {
      description: `${product.name} - Size ${selectedSize}`,
    });
  };

  const handleWhatsAppOrder = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const whatsappLink = generateWhatsAppLink({
      items: [
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: finalPrice,
          quantity,
          size: selectedSize,
          color: selectedColor,
          image: product.images[0],
        },
      ],
      total: finalPrice * quantity,
    });

    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Structured Data */}
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateProductSchema({
                name: product.name,
                description: product.description,
                price: product.price,
                discountedPrice: product.discountedPrice,
                images: product.images,
                category: typeof product.category === 'string'
                  ? product.category
                  : (product.category as any)?.name || 'Uncategorized',
                stock: product.stock,
              })),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateBreadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'Shop', url: '/shop' },
                {
                  name: typeof product.category === 'string'
                    ? product.category
                    : (product.category as any)?.name || 'Category',
                  url: `/shop?category=${
                    typeof product.category === 'string'
                      ? CATEGORIES.find(c => c.name === product.category)?.slug || ''
                      : (product.category as any)?.slug || ''
                  }`
                },
                { name: product.name, url: `/product/${product.slug}` },
              ])),
            }}
          />
        </>
      )}

      <Breadcrumb
        items={[
          { label: 'Shop', href: '/shop' },
          {
            label: typeof product.category === 'string'
              ? product.category
              : product.category?.name || 'Category',
            href: `/shop?category=${
              typeof product.category === 'string'
                ? CATEGORIES.find(c => c.name === product.category)?.slug || ''
                : product.category?.slug || ''
            }`
          },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Images */}
        <div>
          <ImageCarousel images={product.images} alt={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-muted-foreground">
              {typeof product.category === 'string'
                ? product.category
                : product.category?.name || 'Uncategorized'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {product.discount && product.discount > 0 ? (
              <>
                <span className="text-3xl font-bold text-primary-500">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <Badge className="bg-primary-500">{product.discount}% OFF</Badge>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.stock > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-600">
              In Stock ({product.stock} available)
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}

          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          {product.colors && product.colors.length > 0 && (
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
            />
          )}

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleWhatsAppOrder}
              disabled={product.stock === 0}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Order via WhatsApp
            </Button>
          </div>

          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Category:</dt>
                  <dd className="font-medium">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category?.name || 'Uncategorized'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Available Sizes:</dt>
                  <dd className="font-medium">{product.sizes.join(', ')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stock:</dt>
                  <dd className="font-medium">{product.stock} units</dd>
                </div>
              </dl>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <RelatedProducts products={[]} />
      </div>
    </div>
  );
}

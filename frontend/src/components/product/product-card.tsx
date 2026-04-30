'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard = memo(function ProductCard({ product, priority = false }: ProductCardProps) {
  const finalPrice = product.discount
    ? calculateDiscountedPrice(product.price, product.discount)
    : product.price;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={`${product.name} - ${product.category} from VeilVogue`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            quality={75}
          />
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-primary-500">
              {product.discount}% OFF
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              Out of Stock
            </Badge>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-2">
          {typeof product.category === 'string' ? product.category : product.category?.name || 'Uncategorized'}
        </p>
        <div className="flex items-center gap-2">
          {product.discount && product.discount > 0 ? (
            <>
              <span className="font-bold text-primary-500">{formatPrice(finalPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/product/${product.slug}`} className="w-full">
          <Button
            className="w-full"
            variant="outline"
            size="sm"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
});

export { ProductCard };

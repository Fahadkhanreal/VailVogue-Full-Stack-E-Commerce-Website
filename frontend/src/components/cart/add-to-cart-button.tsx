'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { Size } from '@/types';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  price: number;
  size?: Size;
  color?: string;
  image: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  productName,
  productSlug,
  price,
  size,
  color,
  image,
  quantity = 1,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = async () => {
    if (!size) {
      toast.error('Please select a size');
      return;
    }

    setIsLoading(true);

    try {
      addItem({
        productId,
        name: productName,
        slug: productSlug,
        price,
        quantity,
        size,
        color,
        image,
      });

      toast.success('Added to cart!', {
        description: `${productName} - Size ${size}`,
      });
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </Button>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <Link href={`/product/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-32 rounded-md overflow-hidden bg-muted">
          <Image
            src={item.image || '/placeholder.svg'}
            alt={`${item.name} - Size ${item.size}`}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/product/${item.slug}`}
            className="font-semibold hover:text-primary-500 transition-colors"
          >
            {item.name}
          </Link>
          <div className="text-sm text-muted-foreground mt-1">
            <span>Size: {item.size}</span>
            {item.color && (
              <>
                {' • '}
                <span>Color: </span>
                <span
                  className="inline-block w-4 h-4 rounded-full border align-middle ml-1"
                  style={{ backgroundColor: item.color }}
                />
              </>
            )}
          </div>
          <div className="font-semibold mt-2">{formatPrice(item.price)}</div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex-shrink-0 font-semibold">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}

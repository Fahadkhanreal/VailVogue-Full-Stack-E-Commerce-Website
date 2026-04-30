'use client';

import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function CartSummary() {
  const total = useCart((state) => state.getTotal());
  const deliveryFee = 200; // Fixed delivery fee for now
  const finalTotal = total + deliveryFee;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">{formatPrice(deliveryFee)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary-500">{formatPrice(finalTotal)}</span>
      </div>
    </div>
  );
}

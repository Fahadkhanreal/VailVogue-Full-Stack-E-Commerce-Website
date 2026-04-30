import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function OrderSummary({ items, subtotal, deliveryFee, total }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted-foreground">
                Size: {item.size} • Qty: {item.quantity}
              </p>
            </div>
            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">{formatPrice(deliveryFee)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary-500">{formatPrice(total)}</span>
      </div>
    </div>
  );
}

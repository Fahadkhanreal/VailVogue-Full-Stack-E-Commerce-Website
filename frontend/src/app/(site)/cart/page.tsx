'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { EmptyState } from '@/components/common/empty-state';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart, getTotal } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with checkout');
      router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`);
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products to your cart to get started"
          action={
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in cart
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          <div className="bg-card rounded-lg border p-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <CartSummary />

            <Separator className="my-6" />

            <div className="space-y-3">
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
              <WhatsAppButton
                orderData={{
                  items,
                  total: getTotal() + 200, // Include delivery fee
                }}
                variant="outline"
                size="lg"
                className="w-full"
              />
              <Link href="/shop">
                <Button variant="outline" className="w-full">Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

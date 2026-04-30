'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { PaymentSelector } from '@/components/checkout/payment-selector';
import { OrderSummary } from '@/components/checkout/order-summary';
import { Button } from '@/components/ui/button';
import { CheckoutFormData, PaymentMethod } from '@/types';
import { toast } from 'sonner';
import { api, ApiError } from '@/lib/api';
import { OrderResponse, PaymentMethod as ApiPaymentMethod } from '@/types/api';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = getTotal();
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue with checkout');
      router.push(`/login?returnUrl=${encodeURIComponent('/checkout')}`);
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && isAuthenticated) {
      toast.info('Your cart is empty');
      router.push('/cart');
    }
  }, [items.length, isAuthenticated, router]);

  // Don't render if not authenticated or cart is empty
  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={3} height="h-8" className="mb-4" />
      </div>
    );
  }

  const handleSubmit = async (formData: Omit<CheckoutFormData, 'paymentMethod'>) => {
    setIsLoading(true);

    try {
      // Map cart items to order items format
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        productName: item.name,
      }));

      // Generate transaction ID for Easypaisa/JazzCash (dummy for testing)
      const transactionId = paymentMethod !== 'COD'
        ? `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        : undefined;

      // Create order payload
      const orderData = {
        items: orderItems,
        total: total,
        paymentMethod: paymentMethod.toUpperCase() as ApiPaymentMethod,
        transactionId,
        shippingName: formData.name,
        shippingPhone: formData.phone,
        shippingAddress: formData.address,
      };

      const response = await api.post<any>('/api/orders', orderData, true);

      // Backend returns: { success: true, data: order }
      const order = response.data;

      toast.success('Order placed successfully!', {
        description: `Order ID: ${order.id}`,
      });

      // Clear cart
      clearCart();

      // Redirect to order confirmation
      router.push(`/orders/confirmation?orderId=${order.id}`);
    } catch (error) {
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to place order';
      toast.error('Order failed', {
        description: errorMessage,
      });
      console.error('Order creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="bg-card rounded-lg border p-6">
            <PaymentSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
              disabled={isLoading}
            />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              const form = document.querySelector('form') as HTMLFormElement;
              form?.requestSubmit();
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border p-6 sticky top-24">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WhatsAppButton } from '@/components/order/WhatsAppButton';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    size: string;
    price: number;
  }>;
}

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      toast.error('Order ID not found');
      router.push('/');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await api.get<any>(`/api/orders/${orderId}`, true);
        // Backend returns: { success: true, data: order }
        setOrder(response.data);
      } catch (error) {
        const errorMessage = error instanceof ApiError
          ? error.message
          : 'Failed to load order details';
        toast.error('Error', { description: errorMessage });
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={5} height="h-24" className="mb-4" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Order Details</span>
              <span className="text-sm font-normal text-muted-foreground">
                Order #{order.id.slice(0, 8)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Shipping Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.shippingName}</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {order.shippingPhone}
                </p>
                <p><strong>Address:</strong> {order.shippingAddress}</p>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                <p><strong>Status:</strong> <span className="text-yellow-600 font-medium">{order.status}</span></p>
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount</span>
              <span>Rs. {order.total.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <WhatsAppButton
            orderId={order.id}
            orderTotal={order.total}
            customerName={order.shippingName}
            className="flex-1"
          />
          <Button variant="outline" className="flex-1" onClick={() => router.push('/orders')}>
            View All Orders
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => router.push('/shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <LoadingSkeleton count={5} height="h-24" className="mb-4" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}

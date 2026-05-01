'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Calendar, CreditCard, MapPin, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { WhatsAppButton } from '@/components/order/WhatsAppButton';
import { useAuth } from '@/store/auth';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  size: string;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
  };
}

interface Order {
  id: string;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();

      // Use admin endpoint if user is admin, otherwise use regular endpoint
      const endpoint = isAdmin
        ? `/api/admin/orders?limit=1000&page=1&_t=${timestamp}`
        : `/api/orders?limit=1000&page=1&_t=${timestamp}`;

      const response = await api.get<any>(endpoint, true);

      // Backend returns: { success: true, data: { orders, pagination } }
      const ordersData = response.data?.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Orders fetch error:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to load orders';
      toast.error('Error', { description: errorMessage });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
    toast.success('Orders refreshed');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your orders');
      router.push('/login?returnUrl=/orders');
      return;
    }

    const loadOrders = async () => {
      setIsLoading(true);
      await fetchOrders();
      setIsLoading(false);
    };

    loadOrders();
  }, [isAuthenticated, router]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <LoadingSkeleton count={3} height="h-32" className="mb-4" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="You haven't placed any orders. Start shopping to see your orders here."
          action={
            <Button onClick={() => router.push('/shop')}>
              Start Shopping
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {orderDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={order.status} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Summary */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>{order.items.length} item(s)</span>
                    </div>
                    <div className="text-lg font-bold">
                      Rs. {order.total.toLocaleString()}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <>
                      <Separator className="my-4" />

                      {/* Order Items */}
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-sm">Items</h4>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-start text-sm">
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-muted-foreground">
                                Size: {item.size} • Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      {/* Shipping Details */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Shipping Details
                        </h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Name:</strong> {order.shippingName}</p>
                          <p><strong>Phone:</strong> {order.shippingPhone}</p>
                          <p><strong>Address:</strong> {order.shippingAddress}</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Payment Method */}
                      <div className="flex items-center gap-2 text-sm mb-4">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-muted-foreground">Payment:</span>
                        <span className="font-medium">{order.paymentMethod}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <WhatsAppButton
                          orderId={order.id}
                          orderTotal={order.total}
                          customerName={order.shippingName}
                          size="sm"
                        />
                        <Button variant="outline" size="sm" onClick={() => router.push(`/orders/confirmation?orderId=${order.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Package, User, MapPin, Phone, CreditCard, ExternalLink, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  size: string;
  price: number;
  product?: {
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
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await api.get<any>(`/api/admin/orders/${orderId}`, true);
        const orderData = response.data;
        setOrder(orderData);
        setStatus(orderData.status);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        const errorMessage = error instanceof ApiError
          ? error.message
          : 'Failed to load order details';
        toast.error('Error', { description: errorMessage });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order || !orderId) return;

    setIsUpdating(true);
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status }, true);
      toast.success(`Order status updated to ${status}`);
      setOrder({ ...order, status });
    } catch (error) {
      console.error('Failed to update status:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to update order status';
      toast.error('Error', { description: errorMessage });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (statusName: string) => {
    switch (statusName.toUpperCase()) {
      case 'PENDING':
        return (
          <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 text-sm animate-pulse">
            ● PENDING (NEW ORDER)
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200 font-semibold px-3 py-1 text-sm">
            CONFIRMED
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge className="bg-purple-100 text-purple-800 border border-purple-200 font-semibold px-3 py-1 text-sm">
            SHIPPED
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold px-3 py-1 text-sm">
            DELIVERED
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-rose-100 text-rose-800 border border-rose-200 font-semibold px-3 py-1 text-sm">
            CANCELLED
          </Badge>
        );
      default:
        return <Badge variant="outline">{statusName}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton count={1} height="h-8" className="w-48" />
        <LoadingSkeleton count={3} height="h-32" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
        <div className="text-center py-16 border rounded-xl bg-card">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  // Generate WhatsApp chat link with customer
  const cleanPhone = order.shippingPhone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('03')
    ? `92${cleanPhone.slice(1)}`
    : cleanPhone.startsWith('92')
    ? cleanPhone
    : `92${cleanPhone}`;
  
  const whatsappMessage = encodeURIComponent(
    `Assalam-o-Alaikum ${order.shippingName}, this is regarding your VeilVogue order #${order.id.slice(0, 8)} totaling Rs. ${order.total.toLocaleString()}.`
  );
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to All Orders
          </Button>
        </Link>
        {getStatusBadge(order.status)}
      </div>

      {/* Order Header */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold font-mono">
                Order #{order.id.slice(0, 8)}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Placed on {new Date(order.createdAt).toLocaleString('en-PK', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 border-emerald-500 text-emerald-700 hover:bg-emerald-50">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp Customer
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Ordered Products List with Images */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Ordered Products ({order.items?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {order.items?.map((item, index) => {
                const imageUrl = item.product?.images?.[0];
                return (
                  <div
                    key={item.id || index}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-0 last:pb-0 items-start"
                  >
                    {/* Product Image Thumbnail */}
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border bg-muted shrink-0 shadow-sm">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted p-2 text-center">
                          <Package className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-base text-foreground">
                            {item.productName}
                          </h3>
                          {item.product?.slug && (
                            <Link
                              href={`/product/${item.product.slug}`}
                              target="_blank"
                              className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              View Product Page <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                        <p className="font-bold text-base whitespace-nowrap">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      {/* Variants & Pricing tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                        <Badge variant="secondary" className="font-medium">
                          Size: {item.size}
                        </Badge>
                        <Badge variant="outline" className="font-medium">
                          Qty: {item.quantity}
                        </Badge>
                        <span className="text-muted-foreground">
                          Rate: Rs. {item.price.toLocaleString()} each
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Separator />

              {/* Order Calculation */}
              <div className="space-y-2 pt-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>
                    Rs.{' '}
                    {(
                      order.items?.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      ) || 0
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span>Rs. 200</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-foreground pt-1">
                  <span>Total Payable</span>
                  <span className="text-primary text-xl">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Customer & Status Controls */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="text-base">Manage Order Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase">
                  Change Current Status
                </label>
                <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending (New)</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="SHIPPED">Shipped (In Transit)</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full font-semibold"
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === order.status}
              >
                {isUpdating ? 'Updating Status...' : 'Save Status Change'}
              </Button>
            </CardContent>
          </Card>

          {/* Customer Shipping Details */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Customer & Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Recipient Name</p>
                <p className="font-semibold text-base mt-0.5">{order.shippingName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Phone Number</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${order.shippingPhone}`} className="font-medium text-primary hover:underline">
                    {order.shippingPhone}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Delivery Address</p>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="font-medium leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>

              {order.user?.email && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">Account Email</p>
                  <p className="font-medium mt-0.5">{order.user.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Mode</span>
                <Badge variant="outline" className="font-bold text-sm">
                  {order.paymentMethod}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Order Value</span>
                <span className="font-bold">Rs. {order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

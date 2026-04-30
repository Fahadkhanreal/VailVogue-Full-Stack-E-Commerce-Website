'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
import { OrderStatus } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

// Mock data
const mockOrder = {
  id: '1',
  orderNumber: 'ORD-001',
  userId: 'user1',
  items: [
    {
      id: '1',
      productId: 'prod1',
      name: 'Elegant Black Abaya',
      price: 4500,
      quantity: 1,
      size: 'M' as const,
      image: '/placeholder.jpg',
    },
  ],
  shippingDetails: {
    name: 'Fatima Ahmed',
    phone: '03001234567',
    address: 'House 123, Street 5, DHA Phase 2, Karachi',
  },
  paymentMethod: 'COD' as const,
  status: 'Pending' as OrderStatus,
  subtotal: 4500,
  deliveryFee: 200,
  total: 4700,
  createdAt: '2026-04-24T10:00:00Z',
  updatedAt: '2026-04-24T10:00:00Z',
};

export default function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order] = useState(mockOrder);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-2">
            Placed on {new Date(order.createdAt).toLocaleString('en-PK')}
          </p>
        </div>
        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size} • Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>Rs. {order.deliveryFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.shippingDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{order.shippingDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{order.shippingDetails.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">{order.paymentMethod}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={status} onValueChange={(value) => setStatus(value as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={isUpdating || status === order.status}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

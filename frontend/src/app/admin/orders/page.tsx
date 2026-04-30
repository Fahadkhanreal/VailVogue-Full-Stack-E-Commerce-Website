'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order, OrderStatus } from '@/types';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    userId: 'user1',
    items: [],
    shippingDetails: {
      name: 'Fatima Ahmed',
      phone: '03001234567',
      address: 'DHA Phase 2, Karachi',
    },
    paymentMethod: 'COD',
    status: 'Pending',
    subtotal: 4500,
    deliveryFee: 200,
    total: 4700,
    createdAt: '2026-04-24T10:00:00Z',
    updatedAt: '2026-04-24T10:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    userId: 'user2',
    items: [],
    shippingDetails: {
      name: 'Ayesha Khan',
      phone: '03009876543',
      address: 'Gulshan-e-Iqbal, Karachi',
    },
    paymentMethod: 'JazzCash',
    status: 'Confirmed',
    subtotal: 3200,
    deliveryFee: 200,
    total: 3400,
    createdAt: '2026-04-23T15:30:00Z',
    updatedAt: '2026-04-24T09:00:00Z',
  },
];

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const orders = mockOrders;

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-2">
          Manage customer orders and update statuses
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by order number or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.orderNumber}</div>
                </TableCell>
                <TableCell>
                  <div>{order.shippingDetails.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingDetails.phone}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{order.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  Rs. {order.total.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('en-PK')}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{order.orderNumber}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('en-PK')}
                </div>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-muted-foreground">Customer: </span>
                <span className="font-medium">{order.shippingDetails.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {order.shippingDetails.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div>
                <Badge variant="outline">{order.paymentMethod}</Badge>
              </div>
              <div className="font-bold">Rs. {order.total.toLocaleString()}</div>
            </div>

            <Link href={`/admin/orders/${order.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No orders found</p>
        </div>
      )}
    </div>
  );
}

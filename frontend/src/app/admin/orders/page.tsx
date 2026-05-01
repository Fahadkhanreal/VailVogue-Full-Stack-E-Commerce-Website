'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Search, RefreshCw } from 'lucide-react';
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
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  size: string;
  price: number;
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

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await api.get<any>(`/api/admin/orders?limit=1000&_t=${timestamp}`, true);
      const ordersData = response.data?.orders || [];
      setOrders(ordersData);
    } catch (error) {
      console.error('Admin orders fetch error:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to load orders';
      toast.error('Error', { description: errorMessage });
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      await fetchOrders();
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
    toast.success('Orders refreshed');
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders and update statuses
          </p>
        </div>
        <LoadingSkeleton count={5} height="h-20" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders and update statuses
          </p>
        </div>
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

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer name or phone..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
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
                  <div className="font-medium">#{order.id.slice(0, 8)}</div>
                </TableCell>
                <TableCell>
                  <div>{order.shippingName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.shippingPhone}
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
                <div className="font-medium">#{order.id.slice(0, 8)}</div>
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
                <span className="font-medium">{order.shippingName}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {order.shippingPhone}
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

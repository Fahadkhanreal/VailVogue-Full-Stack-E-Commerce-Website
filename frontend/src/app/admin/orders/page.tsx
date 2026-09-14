'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Search, RefreshCw, ShoppingCart, Clock, PackageCheck, Truck, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const PAGE_LIMIT = 10;

  const fetchOrders = async (page = currentPage, status = statusFilter) => {
    try {
      const timestamp = new Date().getTime();
      let queryParams = `page=${page}&limit=${PAGE_LIMIT}&_t=${timestamp}`;

      if (status !== 'all') {
        queryParams += `&status=${status}`;
      }

      const [ordersRes, statsRes] = await Promise.all([
        api.get<any>(`/api/admin/orders?${queryParams}`, true),
        api.get<any>(`/api/admin/stats?_t=${timestamp}`, true).catch(() => null),
      ]);

      const ordersData = ordersRes.data?.orders || [];
      const paginationData = ordersRes.data?.pagination || {
        page,
        limit: PAGE_LIMIT,
        total: ordersData.length,
        totalPages: Math.ceil(ordersData.length / PAGE_LIMIT) || 1,
      };

      setOrders(ordersData);
      setPagination(paginationData);

      if (statsRes?.data?.pendingOrders !== undefined) {
        setPendingCount(statsRes.data.pendingOrders);
      }
    } catch (error) {
      console.error('Admin orders fetch error:', error);
      const errorMessage = error instanceof ApiError
        ? error.message
        : 'Failed to load orders';
      toast.error('Error', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOrders(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders(currentPage, statusFilter);
    setIsRefreshing(false);
    toast.success('Orders refreshed');
  };

  const handleStatusFilterChange = (status: OrderStatus | 'all') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return (
          <Badge className="bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2.5 py-0.5 animate-pulse">
            ● PENDING (NEW)
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
            CONFIRMED
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
            SHIPPED
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200">
            DELIVERED
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge className="bg-rose-100 text-rose-800 border border-rose-200">
            CANCELLED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      order.id.toLowerCase().includes(query) ||
      order.shippingName.toLowerCase().includes(query) ||
      order.shippingPhone.toLowerCase().includes(query) ||
      order.shippingAddress.toLowerCase().includes(query) ||
      order.paymentMethod.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.items?.some((item) => item.productName.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders, view ordered items & update statuses
          </p>
        </div>
        <LoadingSkeleton count={5} height="h-20" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Orders</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-rose-600 rounded-full shadow-sm animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {pendingCount} New Orders Awaiting Action
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Review customer orders, check ordered products, and manage delivery status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto shadow-xs"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('all')}
          className="rounded-full text-xs font-medium shadow-xs"
        >
          All Orders ({statusFilter === 'all' ? pagination.total : 'All'})
        </Button>

        <Button
          variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('PENDING')}
          className={`rounded-full text-xs font-medium relative shadow-xs ${
            statusFilter === 'PENDING'
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : pendingCount > 0
              ? 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100 font-bold'
              : ''
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
          Pending / New
          {pendingCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-rose-600 text-white text-[10px] rounded-full">
              {pendingCount}
            </span>
          )}
        </Button>

        <Button
          variant={statusFilter === 'CONFIRMED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('CONFIRMED')}
          className="rounded-full text-xs font-medium shadow-xs"
        >
          <PackageCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
          Confirmed
        </Button>

        <Button
          variant={statusFilter === 'SHIPPED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('SHIPPED')}
          className="rounded-full text-xs font-medium shadow-xs"
        >
          <Truck className="w-3.5 h-3.5 mr-1 text-purple-600" />
          Shipped
        </Button>

        <Button
          variant={statusFilter === 'DELIVERED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('DELIVERED')}
          className="rounded-full text-xs font-medium shadow-xs"
        >
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Delivered
        </Button>

        <Button
          variant={statusFilter === 'CANCELLED' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilterChange('CANCELLED')}
          className="rounded-full text-xs font-medium shadow-xs"
        >
          <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
          Cancelled
        </Button>
      </div>

      {/* Search Input & Total Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customer, phone, product name, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Total: <span className="font-semibold text-foreground">{pagination.total}</span> orders
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-xl overflow-hidden bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer Details</TableHead>
              <TableHead>Ordered Products</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const isPending = order.status === 'PENDING';
              return (
                <TableRow
                  key={order.id}
                  className={`hover:bg-muted/40 transition-colors ${
                    isPending ? 'bg-amber-50/40 font-medium' : ''
                  }`}
                >
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-primary">
                      #{order.id.slice(0, 8)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm">{order.shippingName}</div>
                    <div className="text-xs text-muted-foreground">{order.shippingPhone}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {order.shippingAddress}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.items && order.items.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {order.items[0]?.product?.images?.[0] ? (
                            <div className="relative w-11 h-11 rounded-md overflow-hidden border bg-muted shrink-0 shadow-xs">
                              <Image
                                src={order.items[0].product.images[0]}
                                alt={order.items[0].productName}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-md border bg-muted flex items-center justify-center shrink-0">
                              <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="text-xs">
                            <p className="font-medium line-clamp-1 max-w-[150px]">
                              {order.items[0].productName}
                            </p>
                            <p className="text-muted-foreground">
                              Size: {order.items[0].size} • Qty: {order.items[0].quantity}
                              {order.items.length > 1 && (
                                <span className="text-primary font-bold ml-1">
                                  (+{order.items.length - 1} more)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No items</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm">
                      Rs. {order.total.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="h-8 gap-1 shadow-xs">
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredOrders.map((order) => {
          const isPending = order.status === 'PENDING';
          return (
            <div
              key={order.id}
              className={`border rounded-xl p-4 space-y-3 shadow-sm bg-card ${
                isPending ? 'border-amber-300 bg-amber-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-primary">
                    #{order.id.slice(0, 8)}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Items preview */}
              <div className="space-y-2 py-2 border-y">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product?.images?.[0] ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-muted shrink-0 shadow-xs">
                        <Image
                          src={item.product.images[0]}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg border bg-muted flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 text-xs">
                      <p className="font-semibold line-clamp-1">{item.productName}</p>
                      <p className="text-muted-foreground">
                        Size: {item.size} • Qty: {item.quantity} • Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer and Total */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{order.shippingName}</p>
                  <p className="text-xs text-muted-foreground">{order.shippingPhone}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1">
                    {order.paymentMethod}
                  </Badge>
                  <div className="font-bold text-base">
                    Rs. {order.total.toLocaleString()}
                  </div>
                </div>
              </div>

              <Link href={`/admin/orders/${order.id}`} className="block pt-1">
                <Button variant="default" size="sm" className="w-full gap-1.5 shadow-xs">
                  <Eye className="h-4 w-4" />
                  View & Manage Order
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-16 border rounded-xl bg-card">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold">No orders found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery
              ? 'No orders match your search query.'
              : 'There are no orders matching this filter.'}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-semibold text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-foreground">{pagination.total}</span> orders
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="h-8 px-2.5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === pagination.page;
              if (
                pageNum === 1 ||
                pageNum === pagination.totalPages ||
                (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={isCurrent ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-8 w-8 p-0 text-xs font-semibold ${
                      isCurrent ? 'bg-primary text-white shadow-xs' : ''
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              } else if (
                pageNum === pagination.page - 2 ||
                pageNum === pagination.page + 2
              ) {
                return (
                  <span key={pageNum} className="px-1 text-xs text-muted-foreground">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="h-8 px-2.5"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

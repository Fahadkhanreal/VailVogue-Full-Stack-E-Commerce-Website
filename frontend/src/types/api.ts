import { User, Order, Product } from './index';

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth responses
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Order responses
export interface OrderResponse {
  order: Order;
}

export interface OrdersResponse {
  orders: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Product responses
export interface ProductsResponse {
  products: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductResponse {
  product: Product;
}

// Admin responses
export interface AdminStatsResponse {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  recentOrders: Order[];
}

// Payment method enum matching backend
export type PaymentMethod = 'COD' | 'JAZZCASH' | 'EASYPAISA';

// Order status enum matching backend
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

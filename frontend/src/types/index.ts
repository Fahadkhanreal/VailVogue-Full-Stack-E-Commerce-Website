// Core Types
export type Category = 'Abayas' | 'Hijabs' | 'Dresses' | 'Kurtis';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type UserRole = 'USER' | 'ADMIN';
export type PaymentMethod = 'COD' | 'JazzCash' | 'Easypaisa';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

// Product
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  discountedPrice?: number;
  category: Category | { id: string; name: string; slug: string };
  sizes: Size[];
  colors?: string[];
  images: string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Item
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  size: Size;
  color?: string;
  image: string;
}

// User
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingDetails: ShippingDetails;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: Size;
  color?: string;
  image: string;
}

export interface ShippingDetails {
  name: string;
  phone: string;
  address: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount?: number;
  category: Category;
  sizes: Size[];
  colors?: string[];
  images: File[] | string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
}

// Filter Types
export interface ProductFilters {
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  sizes?: Size[];
  colors?: string[];
  search?: string;
  sort?: ProductSortOption;
  page?: number;
  limit?: number;
}

export type ProductSortOption = 'newest' | 'price-low' | 'price-high' | 'popular';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WhatsApp Types
export interface WhatsAppOrderData {
  items: CartItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
}

// Admin Dashboard Types
export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  recentOrders: Order[];
}

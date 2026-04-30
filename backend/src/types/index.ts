export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  categoryId: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: 'COD' | 'JAZZCASH' | 'EASYPAISA';
  transactionId?: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  size: string;
  price: number;
  productName: string;
}

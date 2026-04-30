import { z } from 'zod';

// Schema for creating orders
export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
        size: z.string().min(1, 'Size is required'),
      })
    )
    .min(1, 'At least one item is required'),
  paymentMethod: z.enum(['COD', 'JAZZCASH', 'EASYPAISA'], {
    message: 'Invalid payment method',
  }),
  transactionId: z.string().optional(),
  shippingName: z.string().min(1, 'Shipping name is required'),
  shippingPhone: z.string().min(1, 'Shipping phone is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
}).refine(
  (data) => {
    // Transaction ID is required for JAZZCASH and EASYPAISA
    if (data.paymentMethod !== 'COD' && !data.transactionId) {
      return false;
    }
    return true;
  },
  {
    message: 'Transaction ID is required for JazzCash and Easypaisa payments',
    path: ['transactionId'],
  }
);

// Schema for updating order status (admin only)
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'], {
    message: 'Invalid order status',
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

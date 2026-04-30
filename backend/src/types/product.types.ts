import { z } from 'zod';

// Query schema for filtering products
export const productQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  search: z.string().optional(),
  featured: z.string().optional(),
  bestseller: z.string().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'popular']).optional(),
});

// Base schema for product data (without refinements)
const baseProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  discountPrice: z.number().positive().optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  colors: z.array(z.string()).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  categoryId: z.string().uuid('Invalid category ID'),
  featured: z.boolean().optional().default(false),
  bestseller: z.boolean().optional().default(false),
});

// Schema for creating products (admin only) - with refinement
export const createProductSchema = baseProductSchema.refine(
  (data) => !data.discountPrice || data.discountPrice < data.price,
  {
    message: 'Discount price must be less than regular price',
    path: ['discountPrice'],
  }
);

// Schema for updating products (admin only) - partial without refinement
export const updateProductSchema = baseProductSchema.partial();

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../types/product.types';

const router = Router();

// Public routes
router.get('/products', getAllProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/slug/:slug', getProductBySlug); // Get by slug
router.get('/products/:id', getProductById); // Get by ID
router.get('/categories', getCategories);

// Admin routes (protected)
router.post(
  '/products',
  authMiddleware,
  adminMiddleware,
  validate(createProductSchema),
  createProduct
);
router.put(
  '/products/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateProductSchema),
  updateProduct
);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;

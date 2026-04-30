import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/order.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createOrderSchema } from '../types/order.types';

const router = Router();

// All order routes require authentication
router.post('/orders', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/orders', authMiddleware, getUserOrders);
router.get('/orders/:id', authMiddleware, getOrderById);

export default router;

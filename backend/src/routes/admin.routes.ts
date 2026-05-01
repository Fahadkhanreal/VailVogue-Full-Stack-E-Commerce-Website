import { Router } from 'express';
import {
  getDashboardStats,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateOrderStatusSchema } from '../types/order.types';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

export default router;

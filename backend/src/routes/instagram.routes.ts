import { Router } from 'express';
import {
  getInstagramPosts,
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
} from '../controllers/instagram.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public route - get all Instagram posts
router.get('/', getInstagramPosts);

// Admin routes - require authentication and admin role
router.post('/', authMiddleware, adminMiddleware, createInstagramPost);
router.put('/:id', authMiddleware, adminMiddleware, updateInstagramPost);
router.delete('/:id', authMiddleware, adminMiddleware, deleteInstagramPost);

export default router;

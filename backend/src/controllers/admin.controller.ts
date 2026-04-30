import { Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { UpdateOrderStatusInput } from '../types/order.types';
import prisma from '../utils/prisma.utils';

// Get dashboard statistics
export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get total counts
    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        where: {
          status: {
            in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'],
          },
        },
        select: {
          total: true,
        },
      }),
    ]);

    // Calculate total revenue from completed orders
    const totalRevenue = orders.reduce((sum: number, order: { total: number }) => sum + order.total, 0);

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    successResponse(res, {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    errorResponse(res, 'Failed to fetch dashboard statistics', 500);
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Fetch all orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    successResponse(res, {
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GetAllOrders error:', error);
    errorResponse(res, 'Failed to fetch orders', 500);
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateOrderStatusInput;

    // Ensure id is a string
    const orderId = Array.isArray(id) ? id[0] : id;

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      errorResponse(res, 'Order not found', 404);
      return;
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
      },
    });

    successResponse(res, updatedOrder);
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    errorResponse(res, 'Failed to update order status', 500);
  }
};

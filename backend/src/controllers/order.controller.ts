import { Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateOrderInput } from '../types/order.types';
import prisma from '../utils/prisma.utils';

// Create new order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const orderData = req.body as CreateOrderInput;

    // Validate all products exist and have sufficient stock
    const productIds = orderData.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      errorResponse(res, 'One or more products not found', 404);
      return;
    }

    // Check stock availability
    for (const item of orderData.items) {
      const product = products.find((p: any) => p.id === item.productId);
      if (!product) {
        errorResponse(res, `Product ${item.productId} not found`, 404);
        return;
      }
      if (product.stock < item.quantity) {
        errorResponse(
          res,
          `Insufficient stock for product: ${product.name}`,
          400
        );
        return;
      }
    }

    // Calculate total
    let total = 0;
    const orderItems = orderData.items.map((item) => {
      const product = products.find((p: any) => p.id === item.productId)!;
      const price = product.discountPrice || product.price;
      total += price * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        price,
        productName: product.name,
      };
    });

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user!.userId,
          total,
          paymentMethod: orderData.paymentMethod,
          transactionId: orderData.transactionId,
          shippingName: orderData.shippingName,
          shippingPhone: orderData.shippingPhone,
          shippingAddress: orderData.shippingAddress,
          items: {
            create: orderItems,
          },
        },
        include: {
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

      // Update product stock
      for (const item of orderData.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    successResponse(res, order, 201);
  } catch (error) {
    console.error('CreateOrder error:', error);
    errorResponse(res, 'Failed to create order', 500);
  }
};

// Get user's order history
export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const { page = '1', limit = '1000', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      userId: req.user.userId,
    };

    if (status) {
      where.status = status;
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
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
    console.error('GetUserOrders error:', error);
    errorResponse(res, 'Failed to fetch orders', 500);
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const { id } = req.params;
    const orderId = Array.isArray(id) ? id[0] : id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
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

    if (!order) {
      errorResponse(res, 'Order not found', 404);
      return;
    }

    // Verify order belongs to authenticated user
    if (order.userId !== req.user.userId) {
      errorResponse(res, 'Access denied. This order belongs to another user.', 403);
      return;
    }

    successResponse(res, order);
  } catch (error) {
    console.error('GetOrderById error:', error);
    errorResponse(res, 'Failed to fetch order', 500);
  }
};

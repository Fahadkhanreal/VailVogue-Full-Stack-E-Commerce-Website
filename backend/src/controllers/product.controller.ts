import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.utils';
import { ProductQueryInput } from '../types/product.types';
import prisma from '../utils/prisma.utils';

// Get all products with filtering, pagination, and sorting
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      bestseller,
      sort = 'newest',
    } = req.query as Partial<ProductQueryInput>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};

    if (category) {
      // Support multiple categories separated by comma
      const categoryList = category.split(',').map(c => c.trim().toLowerCase());

      if (categoryList.length > 0) {
        const categoryRecords = await prisma.category.findMany({
          where: { slug: { in: categoryList } },
        });

        if (categoryRecords.length > 0) {
          const categoryIds = categoryRecords.map((c: any) => c.id);
          where.categoryId = { in: categoryIds };
        }
      }
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (bestseller === 'true') {
      where.bestseller = true;
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }; // default: newest
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    if (sort === 'price-desc') orderBy = { price: 'desc' };

    // Fetch products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    successResponse(res, {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('GetAllProducts error:', error);
    errorResponse(res, 'Failed to fetch products', 500);
  }
};

// Get product by ID or slug
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;

    // Try to find by ID first, then by slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: productId }, { slug: productId }],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    successResponse(res, product);
  } catch (error) {
    console.error('GetProductById error:', error);
    errorResponse(res, 'Failed to fetch product', 500);
  }
};

// Get product by slug (dedicated function)
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const productSlug = Array.isArray(slug) ? slug[0] : slug;

    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    successResponse(res, product);
  } catch (error) {
    console.error('GetProductBySlug error:', error);
    errorResponse(res, 'Failed to fetch product', 500);
  }
};

// Get featured products
export const getFeaturedProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      where: { featured: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to 10 featured products
    });

    successResponse(res, products);
  } catch (error) {
    console.error('GetFeaturedProducts error:', error);
    errorResponse(res, 'Failed to fetch featured products', 500);
  }
};

// Get all categories
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Add product count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category: any) => {
        const productCount = await prisma.product.count({
          where: { categoryId: category.id },
        });
        return {
          ...category,
          productCount,
        };
      })
    );

    successResponse(res, categoriesWithCount);
  } catch (error) {
    console.error('GetCategories error:', error);
    errorResponse(res, 'Failed to fetch categories', 500);
  }
};

// Helper function to generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Create product (admin only)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = req.body;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: productData.categoryId },
    });

    if (!category) {
      errorResponse(res, 'Category not found', 404);
      return;
    }

    // Generate slug from name
    const slug = generateSlug(productData.name);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      errorResponse(res, 'Product with this name already exists', 409);
      return;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...productData,
        slug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    successResponse(res, product, 201);
  } catch (error) {
    console.error('CreateProduct error:', error);
    errorResponse(res, 'Failed to create product', 500);
  }
};

// Update product (admin only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // If category is being updated, verify it exists
    if (updateData.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });

      if (!category) {
        errorResponse(res, 'Category not found', 404);
        return;
      }
    }

    // If name is being updated, regenerate slug
    if (updateData.name && updateData.name !== existingProduct.name) {
      updateData.slug = generateSlug(updateData.name);

      // Check if new slug conflicts with another product
      const slugConflict = await prisma.product.findFirst({
        where: {
          slug: updateData.slug,
          id: { not: productId },
        },
      });

      if (slugConflict) {
        errorResponse(res, 'Product with this name already exists', 409);
        return;
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    successResponse(res, product);
  } catch (error) {
    console.error('UpdateProduct error:', error);
    errorResponse(res, 'Failed to update product', 500);
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = Array.isArray(id) ? id[0] : id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      errorResponse(res, 'Product not found', 404);
      return;
    }

    // Check if product is used in any orders
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: productId },
    });

    if (orderItemsCount > 0) {
      errorResponse(
        res,
        'Cannot delete product that has been ordered. This product is referenced in existing orders.',
        400
      );
      return;
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    });

    successResponse(res, { message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    errorResponse(res, 'Failed to delete product', 500);
  }
};

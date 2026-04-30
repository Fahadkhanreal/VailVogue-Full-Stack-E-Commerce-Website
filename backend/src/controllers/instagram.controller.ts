import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma.utils';

// Validation schema
const createInstagramPostSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  postUrl: z.string().url('Invalid post URL'),
  order: z.number().int().min(0).optional().default(0),
});

// Get all Instagram posts
export const getInstagramPosts = async (_req: Request, res: Response) => {
  try {
    console.log('📸 Fetching Instagram posts...');
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: 'asc' },
    });
    console.log('✅ Found posts:', posts.length);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('❌ Error fetching Instagram posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Instagram posts',
    });
  }
};

// Create new Instagram post (Admin only)
export const createInstagramPost = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = createInstagramPostSchema.parse(req.body);

    const post = await prisma.instagramPost.create({
      data: validatedData,
    });

    res.status(201).json({
      success: true,
      data: post,
      message: 'Instagram post added successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }

    console.error('Error creating Instagram post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Instagram post',
    });
  }
};

// Update Instagram post (Admin only)
export const updateInstagramPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const postId = Array.isArray(id) ? id[0] : id;
    const validatedData = createInstagramPostSchema.partial().parse(req.body);

    const post = await prisma.instagramPost.update({
      where: { id: postId },
      data: validatedData,
    });

    res.json({
      success: true,
      data: post,
      message: 'Instagram post updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues,
      });
      return;
    }

    console.error('Error updating Instagram post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update Instagram post',
    });
  }
};

// Delete Instagram post (Admin only)
export const deleteInstagramPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const postId = Array.isArray(id) ? id[0] : id;

    await prisma.instagramPost.delete({
      where: { id: postId },
    });

    res.json({
      success: true,
      message: 'Instagram post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Instagram post:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete Instagram post',
    });
  }
};

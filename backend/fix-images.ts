import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProductImages() {
  try {
    // Update Elegant Black Abaya with working Unsplash images
    const updated = await prisma.product.update({
      where: { slug: 'elegant-black-abaya' },
      data: {
        images: [
          'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
          'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=800&q=80',
        ],
      },
    });

    console.log('✅ Product images updated successfully!');
    console.log('Product:', updated.name);
    console.log('New images:', updated.images);
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateProductImages();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFakeInstagramPosts() {
  try {
    console.log('📸 Adding fake Instagram posts...');

    const posts = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        postUrl: 'https://www.instagram.com/p/ABC123/',
        order: 0,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800&auto=format&fit=crop',
        postUrl: 'https://www.instagram.com/p/DEF456/',
        order: 1,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
        postUrl: 'https://www.instagram.com/p/GHI789/',
        order: 2,
      },
    ];

    for (const post of posts) {
      const created = await prisma.instagramPost.create({
        data: post,
      });
      console.log(`✅ Created post ${created.order + 1}: ${created.id}`);
    }

    console.log('🎉 Successfully added 3 fake Instagram posts!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFakeInstagramPosts();

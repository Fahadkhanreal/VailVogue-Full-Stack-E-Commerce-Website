const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Prisma with Neon adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function markBestsellers() {
  try {
    console.log('🔄 Marking products as bestsellers...\n');

    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        bestseller: true,
      },
    });

    if (products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }

    console.log(`📦 Found ${products.length} products\n`);

    // Mark first 4 products as bestsellers (or specify by slug)
    const bestsellerSlugs = [
      'elegant-black-abaya',
      'premium-silk-hijab',
      'floral-print-kurti',
      'chiffon-hijab-set',
    ];

    let updatedCount = 0;

    for (const product of products) {
      if (bestsellerSlugs.includes(product.slug)) {
        await prisma.product.update({
          where: { id: product.id },
          data: { bestseller: true },
        });
        console.log(`✅ Marked as bestseller: ${product.name}`);
        updatedCount++;
      }
    }

    console.log(`\n✨ Successfully marked ${updatedCount} products as bestsellers!`);
    console.log('\n📋 Current bestseller products:');

    const bestsellers = await prisma.product.findMany({
      where: { bestseller: true },
      select: {
        name: true,
        slug: true,
        price: true,
        discountPrice: true,
      },
    });

    bestsellers.forEach((product, index) => {
      const price = product.discountPrice
        ? `Rs. ${product.price} → Rs. ${product.discountPrice}`
        : `Rs. ${product.price}`;
      console.log(`${index + 1}. ${product.name} (${product.slug}) - ${price}`);
    });

  } catch (error) {
    console.error('❌ Error marking bestsellers:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

markBestsellers();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testBestsellerQuery() {
  try {
    console.log('🧪 Testing Bestseller Query...\n');

    // Test 1: Simple query
    console.log('Test 1: Fetching all products with bestseller field');
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        bestseller: true,
      },
      take: 2,
    });
    console.log('✅ Success:', JSON.stringify(allProducts, null, 2));

    // Test 2: Filter by bestseller
    console.log('\nTest 2: Fetching only bestseller products');
    const bestsellerProducts = await prisma.product.findMany({
      where: {
        bestseller: true,
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
      take: 2,
    });
    console.log('✅ Success:', JSON.stringify(bestsellerProducts, null, 2));

    console.log('\n✅ All tests passed! Backend should work correctly.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

testBestsellerQuery();

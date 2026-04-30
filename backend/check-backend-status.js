const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function checkBackendStatus() {
  try {
    console.log('🔍 Checking Backend Status...\n');

    // Check if Prisma client has bestseller field
    const product = await prisma.product.findFirst({
      select: {
        name: true,
        featured: true,
        bestseller: true, // This will fail if Prisma client is old
      }
    });

    console.log('✅ Prisma Client: UP TO DATE');
    console.log('✅ Bestseller field: AVAILABLE');
    console.log('\n📦 Sample Product:');
    console.log(`   Name: ${product?.name}`);
    console.log(`   Featured: ${product?.featured}`);
    console.log(`   Bestseller: ${product?.bestseller}`);
    console.log('\n✅ Backend is ready! Restart the server now.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Prisma client needs regeneration!');
    console.log('Run: npx prisma generate\n');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkBackendStatus();

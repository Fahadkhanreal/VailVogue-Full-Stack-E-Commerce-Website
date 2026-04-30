// Standalone script to add products
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

// Initialize Prisma with Neon adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function listCategories() {
  console.log('\n📋 Available Categories:');
  const categories = await prisma.category.findMany();
  categories.forEach(cat => {
    console.log(`   - ${cat.name} (ID: ${cat.id}, Slug: ${cat.slug})`);
  });
  return categories;
}

async function addProduct() {
  try {
    console.log('🚀 Starting product creation...\n');

    // First, list all categories
    const categories = await listCategories();

    if (categories.length === 0) {
      console.error('\n❌ No categories found! Please run: npm run seed');
      return;
    }

    // Find Hijabs category
    const hijabsCategory = categories.find(c => c.slug === 'hijabs');

    if (!hijabsCategory) {
      console.error('\n❌ Hijabs category not found!');
      console.log('Using first available category:', categories[0].name);
    }

    const categoryId = hijabsCategory ? hijabsCategory.id : categories[0].id;
    const categoryName = hijabsCategory ? hijabsCategory.name : categories[0].name;

    console.log(`\n✅ Using category: ${categoryName} (${categoryId})\n`);

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: 'Premium Silk Hijab',
        slug: 'premium-silk-hijab',
        description: 'Luxurious silk hijab with soft texture and elegant drape. Perfect for everyday wear and special occasions.',
        price: 1500,
        discountPrice: 1200,
        images: [
          'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Navy', 'Beige', 'White'],
        stock: 50,
        categoryId: categoryId,
        featured: true,
      },
    });

    console.log('✅ Product added successfully!\n');
    console.log('📦 Product Details:');
    console.log('   ID:', product.id);
    console.log('   Name:', product.name);
    console.log('   Slug:', product.slug);
    console.log('   Price: Rs.', product.price);
    console.log('   Discount Price: Rs.', product.discountPrice);
    console.log('   Stock:', product.stock);
    console.log('   Category:', categoryName);
    console.log('\n🎯 View it at: http://localhost:3000/product/' + product.slug);
    console.log('🛍️  Shop page: http://localhost:3000/shop\n');

  } catch (error) {
    console.error('\n❌ Error adding product:', error.message);

    if (error.code === 'P2002') {
      console.error('💡 Product with slug "premium-silk-hijab" already exists!');
      console.error('   Try changing the slug to something unique.');
    } else if (error.code === 'P2003') {
      console.error('💡 Category ID not found in database.');
    } else {
      console.error('Full error:', error);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addProduct();

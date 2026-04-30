// Script to add multiple products at once
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Sample products data
const productsData = [
  {
    name: 'Elegant Black Abaya',
    slug: 'elegant-black-abaya',
    description: 'Classic black abaya with elegant embroidery and comfortable fit. Perfect for daily wear.',
    price: 3500,
    discountPrice: 2999,
    images: [
      'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    stock: 30,
    categorySlug: 'abayas',
    featured: true,
  },
  {
    name: 'Floral Print Kurti',
    slug: 'floral-print-kurti',
    description: 'Beautiful floral print kurti with modern design. Comfortable cotton fabric.',
    price: 2500,
    discountPrice: 1999,
    images: [
      'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue', 'Green'],
    stock: 45,
    categorySlug: 'kurtis',
    featured: false,
  },
  {
    name: 'Modest Summer Dress',
    slug: 'modest-summer-dress',
    description: 'Light and breezy summer dress with modest design. Perfect for warm weather.',
    price: 3200,
    discountPrice: 2800,
    images: [
      'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Cream', 'Pastel Pink'],
    stock: 25,
    categorySlug: 'dresses',
    featured: true,
  },
  {
    name: 'Chiffon Hijab Set',
    slug: 'chiffon-hijab-set',
    description: 'Set of 3 premium chiffon hijabs in different colors. Soft and breathable.',
    price: 1800,
    discountPrice: 1500,
    images: [
      'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
    ],
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Maroon'],
    stock: 60,
    categorySlug: 'hijabs',
    featured: false,
  },
  {
    name: 'Pearl Brooch Set',
    slug: 'pearl-brooch-set',
    description: 'Elegant pearl brooch set for hijab styling. Set of 5 pieces.',
    price: 800,
    discountPrice: 650,
    images: [
      'https://res.cloudinary.com/dlcz7wu8t/image/upload/v1777328660/beauty-asian-young-muslim-girl-260nw-2322813677_c6bpvs.webp',
    ],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    stock: 100,
    categorySlug: 'accessories',
    featured: false,
  },
];

async function addMultipleProducts() {
  try {
    console.log('🚀 Starting bulk product creation...\n');

    // Get all categories
    const categories = await prisma.category.findMany();
    console.log(`📋 Found ${categories.length} categories\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const productData of productsData) {
      try {
        // Find category by slug
        const category = categories.find(c => c.slug === productData.categorySlug);

        if (!category) {
          console.error(`❌ Category "${productData.categorySlug}" not found for ${productData.name}`);
          errorCount++;
          continue;
        }

        // Check if product already exists
        const existing = await prisma.product.findUnique({
          where: { slug: productData.slug }
        });

        if (existing) {
          console.log(`⚠️  Product "${productData.name}" already exists (slug: ${productData.slug})`);
          continue;
        }

        // Create product
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            slug: productData.slug,
            description: productData.description,
            price: productData.price,
            discountPrice: productData.discountPrice,
            images: productData.images,
            sizes: productData.sizes,
            colors: productData.colors,
            stock: productData.stock,
            categoryId: category.id,
            featured: productData.featured,
          },
        });

        console.log(`✅ Added: ${product.name} (${category.name})`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error adding ${productData.name}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully added: ${successCount} products`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log('\n🎯 View products at: http://localhost:3000/shop\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

addMultipleProducts();

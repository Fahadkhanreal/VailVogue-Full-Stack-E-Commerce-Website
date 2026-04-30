import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Seed categories
  const categories = [
    { name: 'Abayas', slug: 'abayas' },
    { name: 'Dresses', slug: 'dresses' },
    { name: 'Kurtis', slug: 'kurtis' },
    { name: 'Hijabs', slug: 'hijabs' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  console.log('Creating categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories created');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@veilvogue.com' },
    update: {},
    create: {
      email: 'admin@veilvogue.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created (admin@veilvogue.com / Admin123)');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

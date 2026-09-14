import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function resetAdmin() {
  const email = process.argv[2] || 'admin@veilvogue.com';
  const newPassword = process.argv[3] || 'Admin123';

  console.log(`🔍 Checking user with email: ${email}...`);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log(`\n✅ Admin account updated successfully!`);
  console.log(`📧 Email:    ${user.email}`);
  console.log(`🔑 Password: ${newPassword}`);
  console.log(`👑 Role:     ${user.role}\n`);
}

resetAdmin()
  .catch((err) => {
    console.error('❌ Error resetting admin password:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
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
    const hashedPassword = await bcryptjs_1.default.hash('Admin123', 10);
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
//# sourceMappingURL=seed.js.map
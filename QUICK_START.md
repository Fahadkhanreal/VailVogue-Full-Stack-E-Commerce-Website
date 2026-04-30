# VeilVogue - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Git

### 1. Clone and Install

\`\`\`bash
# Navigate to project
cd clothing_website

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

### 2. Configure Environment Variables

**Backend (.env)**
\`\`\`env
DATABASE_URL="your-neon-postgres-connection-string"
JWT_SECRET="veilvogue-jwt-secret-key-2026-integration-secure-token-min-32-chars"
PORT=5000
FRONTEND_URL="http://localhost:3000"
\`\`\`

**Frontend (.env.local)**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
\`\`\`

### 3. Setup Database

\`\`\`bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
\`\`\`

### 4. Start Development Servers

**Terminal 1 - Backend:**
\`\`\`bash
cd backend
npm run dev
# Server starts at http://localhost:5000
\`\`\`

**Terminal 2 - Frontend:**
\`\`\`bash
cd frontend
npm run dev
# Server starts at http://localhost:3000
\`\`\`

### 5. Test the Application

1. Open http://localhost:3000
2. Register a new account
3. Browse products
4. Add items to cart
5. Complete checkout
6. View your orders

## 🧪 Quick Test

\`\`\`bash
# Test backend health
curl http://localhost:5000/health

# Test products API
curl http://localhost:5000/api/products?limit=5
\`\`\`

## 📁 Project Structure

\`\`\`
clothing_website/
├── backend/              # Express.js + Prisma API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation
│   │   └── index.ts      # Server entry
│   └── prisma/
│       └── schema.prisma # Database schema
│
└── frontend/             # Next.js 15 App
    ├── src/
    │   ├── app/          # Pages (App Router)
    │   ├── components/   # React components
    │   ├── lib/          # Utilities (API client)
    │   └── store/        # Zustand stores
    └── public/           # Static assets
\`\`\`

## 🔑 Key Features Implemented

✅ User authentication (register/login)
✅ Product browsing
✅ Shopping cart
✅ Order placement
✅ Order history
✅ WhatsApp integration
✅ Admin dashboard structure
✅ Protected routes

## 🐛 Common Issues

**CORS Error:**
- Verify FRONTEND_URL in backend .env
- Restart backend server

**401 Unauthorized:**
- Check if logged in
- Clear browser localStorage
- Login again

**Database Connection Error:**
- Verify DATABASE_URL is correct
- Check Neon database is accessible
- Run \`npx prisma generate\`

## 📚 Documentation

- [Integration Summary](./INTEGRATION_SUMMARY.md)
- [Integration Complete](./INTEGRATION_COMPLETE.md)
- [Tasks](./specs/001-frontend-backend-integration/tasks.md)

## 🎯 Next Steps

1. Connect shop page to backend API
2. Add product search and filters
3. Implement admin product management
4. Deploy to production

---

**Need help?** Check the troubleshooting section in INTEGRATION_SUMMARY.md

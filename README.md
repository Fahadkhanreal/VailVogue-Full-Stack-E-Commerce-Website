# 🌟 VeilVogue — Full-Stack E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)

A high-performance, enterprise-grade, full-stack modest fashion e-commerce platform built with modern web architecture. Featuring responsive UI, fast server-side rendering, real-time client state management, complete administrative dashboard, and automated email order dispatching.

---

## 🚀 Key Features

### 🛍️ Customer Experience
- **Interactive Product Catalog**: Dynamic category filtering, multi-attribute selection (sizes, colors), and instant debounced search.
- **Product Details & Gallery**: High-resolution image carousel, zoomable lightbox, related product recommendations, and stock status indicators.
- **Persistent Cart**: Zustand-powered cart store with optimistic UI updates and local storage persistence.
- **Checkout & Multi-Payment**: Smooth checkout flow with Cash on Delivery (COD), JazzCash, and EasyPaisa integration.
- **Automated Notifications**: Order confirmation and tracking emails sent via Resend API.
- **Customer Accounts & Order History**: JWT-based secure user authentication, order tracking, and profile management.
- **WhatsApp Direct Support**: One-click order inquiries and customer support integration.

### 👑 Admin Control Panel
- **Product Management**: Full CRUD operations with multi-image Cloudinary upload, size/color variant tags, and stock tracking.
- **Order Management**: Real-time order status lifecycle (`PENDING` ➔ `CONFIRMED` ➔ `SHIPPED` ➔ `DELIVERED` ➔ `CANCELLED`).
- **Featured & Bestseller Merchandising**: One-click product badge toggles for homepage feature carousels.
- **Instagram Feed CMS**: Dynamic gallery grid manager to showcase social campaigns directly on the storefront.
- **Role-Based Access Control**: Strict middleware protecting administrative routes and API endpoints.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Hybrid SSR/SSG rendering, Turbopack bundling |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/) | Modern design tokens, responsive layouts |
| **Component Primitives** | [Base UI](https://base-ui.com/), [Lucide React](https://lucide.dev/) | Accessible dialogs, drawers, and featherweight icons |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Client-side persistent cart & authentication state |
| **Backend Runtime** | [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/) | RESTful API server with modular controllers |
| **Database & ORM** | [PostgreSQL (Neon)](https://neon.tech/) & [Prisma 7](https://www.prisma.io/) | Serverless relational database with type-safe schema |
| **Security & Auth** | [JWT](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js), [Helmet](https://helmetjs.github.io/), [Rate-Limiting](https://github.com/express-rate-limit/express-rate-limit) | Enterprise-grade API defense and token validation |
| **Email Service** | [Resend](https://resend.com/) | Transactional emails with modern HTML templates |
| **Media Hosting** | [Cloudinary](https://cloudinary.com/) | Optimized image transformations and CDN delivery |

---

## 📁 Repository Structure

```
clothing_website/
├── backend/                  # Express REST API & Prisma ORM
│   ├── prisma/               # Database Schema, Migrations, & Seeders
│   │   ├── schema.prisma     # PostgreSQL Data Model
│   │   ├── seed.ts           # Seed categories & initial admin account
│   │   └── reset-admin.ts    # Admin credential reset utility
│   ├── src/
│   │   ├── controllers/      # Route handler logic (Auth, Products, Orders, etc.)
│   │   ├── middleware/       # Auth, Admin RBAC, Error Handling, Validation
│   │   ├── routes/           # Express router endpoints
│   │   ├── utils/            # Prisma, JWT, Resend email helpers
│   │   └── index.ts          # Server entry point, CORS, Rate Limiters
│   └── package.json
│
├── frontend/                 # Next.js 16 Frontend
│   ├── public/               # Static assets & brand media
│   ├── src/
│   │   ├── app/              # Next.js App Router (Public & Admin routes)
│   │   │   ├── (site)/       # Public storefront (Home, Shop, Cart, Checkout)
│   │   │   └── admin/        # Protected admin management dashboard
│   │   ├── components/       # Reusable UI components & layouts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # API client, Auth persistence, Utilities
│   │   └── types/            # Shared TypeScript interfaces
│   ├── next.config.ts        # Next.js configuration
│   └── package.json
│
└── README.md
```

---

## ⚙️ Quick Start & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Fahadkhanreal/VailVogue-Full-Stack-E-Commerce-Website.git
cd VailVogue-Full-Stack-E-Commerce-Website
```

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations and seed data
npx prisma generate
npx prisma migrate dev
npm run seed

# Start backend development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Configure environment variables
cp .env.example .env.local

# Start Next.js development server
npm run dev
```

Visit **http://localhost:3000** to view the application.

---

## 🔐 Default Admin Credentials

When the database is seeded (`npm run seed`), an initial admin account is created:
- **Email:** `admin@veilvogue.com`
- **Password:** `Admin123`

To reset or create a custom admin password at any time:
```bash
cd backend
npm run reset-admin <your-email> <your-new-password>
```

---

## 🛡️ Security & Performance Highlights

- **CORS & Origin Filtering**: Strict multi-environment origin whitelist.
- **API Rate Limiting**: IP-based burst and brute-force protection for auth and general endpoints.
- **SQL & Query Safety**: Parameterized queries and type safety powered by Prisma ORM.
- **Payload Compression**: Automatic gzip/brotli asset and JSON response compression.
- **Next.js Turbopack & Image Optimization**: Remote image domain authorization and multi-format WebP/AVIF delivery.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).

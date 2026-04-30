# VeilVogue Backend API

Backend API for VeilVogue - A modest female clothing e-commerce platform built with Node.js, Express.js, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (USER/ADMIN)
- **Product Management**: Browse, filter, search products with pagination
- **Order Management**: Create orders, view order history, track order status
- **Admin Dashboard**: Manage products, orders, and view statistics
- **Local Payment Support**: COD, JazzCash, Easypaisa payment methods
- **Category Management**: Organize products by categories (Abayas, Dresses, Kurtis, Hijabs, Accessories)

## 📋 Prerequisites

- Node.js v20 or higher
- PostgreSQL database (Neon DB recommended)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT Secret (use a strong random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"
```

4. **Run database migrations**
```bash
npm run prisma:migrate
```

5. **Seed initial data**
```bash
npm run seed
```

This creates:
- 5 product categories (Abayas, Dresses, Kurtis, Hijabs, Accessories)
- Admin user (admin@veilvogue.com / Admin123)

6. **Start development server**
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)

### Products
- `GET /api/products` - Get all products (with filters, search, pagination)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID or slug
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Categories
- `GET /api/categories` - Get all categories

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user's order history (protected)
- `GET /api/orders/:id` - Get order details (protected)

### Admin
- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders/:id/status` - Update order status (admin only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Admin-only routes require the user to have the ADMIN role.

## 📊 Database Schema

### User
- id, email, password, name, phone, address, role, timestamps

### Category
- id, name, slug, timestamps

### Product
- id, name, slug, description, price, discountPrice, images, sizes, colors, stock, categoryId, featured, timestamps

### Order
- id, userId, total, status, paymentMethod, transactionId, shippingName, shippingPhone, shippingAddress, timestamps

### OrderItem
- id, orderId, productId, quantity, size, price, productName

## 🧪 Testing

Test the API using:
- **Health Check**: `GET http://localhost:5000/health`
- **Postman**: Import the API collection (see `/docs/postman-collection.json`)
- **Thunder Client**: VS Code extension for API testing

## 📦 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run seed         # Seed database with initial data
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## 🚢 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel frontend URL)

6. Deploy!

## 🔒 Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication (7-day expiration)
- Role-based access control (USER/ADMIN)
- Input validation with Zod schemas
- CORS configuration for frontend origin
- SQL injection prevention (Prisma parameterized queries)

## 🎯 Performance

- API response time target: < 300ms (p95)
- Database connection pooling via Prisma
- Pagination support (default 20 items per page)
- Indexed database queries for fast lookups

## 📝 API Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env` is correct
- Check Neon DB is active (free tier may sleep)
- Ensure `?sslmode=require` is in connection string

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or kill the process using port 5000

### Prisma Client Not Generated
```bash
npx prisma generate
```

### Migration Failures
- Test migrations in development first
- Backup database before production migrations

## 📄 License

ISC

## 👥 Admin Credentials

Default admin account (created by seed script):
- Email: `admin@veilvogue.com`
- Password: `Admin123`

**⚠️ Change this password in production!**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for VeilVogue**

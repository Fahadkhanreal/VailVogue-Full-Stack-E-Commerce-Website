import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import instagramRoutes from './routes/instagram.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
// CORS configuration for development and production
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'https://vail-vogue-full-stack-e-commerce-we.vercel.app',
  'https://veilvogue.vercel.app',
  'https://www.veilvogue.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow all localhost and 127.0.0.1 origins on any port
    const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    // Allow any Vercel domain (e.g. preview and production deployments)
    const isVercel = /^https:\/\/[a-zA-Z0-9._-]+\.vercel\.app$/.test(origin) || origin.endsWith('.vercel.app');
    const isAllowedOrigin = allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''));

    if (isLocalhost || isVercel || isAllowedOrigin) {
      callback(null, true);
    } else {
      console.warn(`⚠️ Blocked by CORS: Origin "${origin}" is not in allowed origins.`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'VeilVogue API is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instagram-gallery', instagramRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 CORS enabled for: ${FRONTEND_URL}`);
});

export default app;

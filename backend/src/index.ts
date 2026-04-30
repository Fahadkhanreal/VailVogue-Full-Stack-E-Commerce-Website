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
  'https://veilvogue.vercel.app', // Production frontend (update with actual URL)
  'https://www.veilvogue.vercel.app', // Production frontend with www
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
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

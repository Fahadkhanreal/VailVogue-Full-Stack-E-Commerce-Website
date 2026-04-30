# VeilVogue Deployment Guide

## Pre-Deployment Checklist

### ✅ Completed
- [x] Frontend build successful
- [x] Backend build successful
- [x] SEO optimization added (meta tags, sitemap, robots.txt, structured data)
- [x] TypeScript compilation errors fixed
- [x] Category navigation fixed

### 📋 Before Deployment

#### 1. Environment Variables

**Frontend (.env.local → .env.production)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+923482240731
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dlcz7wu8t
NEXT_PUBLIC_CLOUDINARY_API_KEY=588232781117811
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-google-verification-code
```

**Backend (.env)**
```env
# Database
DATABASE_URL=your-neon-postgres-connection-string

# JWT
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://your-frontend-domain.com

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=dlcz7wu8t
CLOUDINARY_API_KEY=588232781117811
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### 2. Database Setup

```bash
# Navigate to backend directory
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations on production database
npx prisma migrate deploy

# (Optional) Seed initial data
npm run seed
```

#### 3. Build Commands

**Frontend:**
```bash
cd frontend
npm install
npm run build
```

**Backend:**
```bash
cd backend
npm install
npm run build
npm run prisma:generate
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend on Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

#### Backend on Railway
1. Create new project in Railway
2. Add PostgreSQL database (or connect to Neon)
3. Add environment variables
4. Deploy from GitHub
5. Note the backend URL for frontend env

### Option 2: VPS (DigitalOcean, AWS, etc.)

#### Frontend (Next.js)
```bash
# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "veilvogue-frontend" -- start

# Or use standalone mode
npm run build
node .next/standalone/server.js
```

#### Backend (Express)
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Generate Prisma Client
npm run prisma:generate

# Start with PM2
pm2 start dist/index.js --name "veilvogue-backend"
```

### Option 3: Docker Deployment

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Backend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Database connection works
- [ ] Image uploads work (Cloudinary)
- [ ] Authentication works
- [ ] Admin panel accessible
- [ ] Category navigation works
- [ ] Product pages load
- [ ] Cart functionality works
- [ ] Checkout process works

### 2. SEO Setup
- [ ] Submit sitemap to Google Search Console: `https://your-domain.com/sitemap.xml`
- [ ] Verify Google Search Console
- [ ] Add robots.txt verification
- [ ] Test structured data with Google Rich Results Test

### 3. Performance Optimization
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Enable Gzip/Brotli compression
- [ ] Monitor Core Web Vitals

### 4. Security
- [ ] Enable HTTPS (SSL certificate)
- [ ] Configure CORS properly
- [ ] Set secure JWT secret
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Regular security updates

### 5. Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up analytics (Google Analytics)
- [ ] Monitor database performance
- [ ] Set up backup strategy

## Troubleshooting

### Frontend Issues
- **Build fails**: Check Node.js version (requires 18+)
- **API calls fail**: Verify NEXT_PUBLIC_API_URL is correct
- **Images not loading**: Check Cloudinary configuration

### Backend Issues
- **Database connection fails**: Verify DATABASE_URL
- **JWT errors**: Check JWT_SECRET is set
- **CORS errors**: Add frontend URL to ALLOWED_ORIGINS

### Common Errors
- **Port already in use**: Change PORT in .env
- **Prisma Client not generated**: Run `npx prisma generate`
- **Migration fails**: Check database permissions

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor error logs
- Backup database weekly
- Review security advisories
- Update SSL certificates

### Scaling Considerations
- Add Redis for session management
- Implement CDN for images
- Add database read replicas
- Enable horizontal scaling
- Implement caching strategy

## Support

For deployment issues:
1. Check logs: `pm2 logs` or platform-specific logs
2. Verify environment variables
3. Test database connection
4. Check CORS configuration
5. Review error messages

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Frontend URL**: _____________
**Backend URL**: _____________
**Database**: _____________

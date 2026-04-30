# GitHub Deployment & Environment Variables Guide

## 🔒 Security: Environment Variables Protection

### ✅ Your .env files are SAFE!

Your `.gitignore` file already protects all environment variables:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env
```

**This means:**
- ❌ `.env` files will NOT be uploaded to GitHub
- ❌ `.env.local` files will NOT be uploaded to GitHub
- ✅ Your secrets (database passwords, JWT keys, API keys) are SAFE
- ✅ Only `.env.example` files will be uploaded (templates without real values)

---

## 📁 What Gets Uploaded to GitHub

### ✅ Will be uploaded:
- Source code (`src/`, `components/`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, etc.)
- `.env.example` files (templates only)
- Documentation files
- `.gitignore` file

### ❌ Will NOT be uploaded:
- `node_modules/` (dependencies)
- `.env`, `.env.local` (your actual secrets)
- `dist/`, `build/`, `.next/` (build outputs)
- Database files
- Log files

---

## 🚀 How to Deploy from GitHub

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VeilVogue E-commerce"

# Add remote repository
git remote add origin https://github.com/your-username/veilvogue.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Hosting Platform

#### Option A: Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will detect Next.js automatically
5. **Add Environment Variables** in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Copy values from your local `.env.local`
   - Add each variable:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend-url.com
     NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
     NEXT_PUBLIC_WHATSAPP_NUMBER = +923482240731
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dlcz7wu8t
     NEXT_PUBLIC_CLOUDINARY_API_KEY = 588232781117811
     NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = unsigned_preset
     ```
6. Click "Deploy"

#### Option B: Railway (Backend)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose `backend` folder as root directory
5. **Add Environment Variables** in Railway dashboard:
   - Go to Variables tab
   - Add each variable:
     ```
     DATABASE_URL = your-neon-postgres-url
     JWT_SECRET = your-secure-secret-key
     JWT_EXPIRES_IN = 7d
     PORT = 5000
     NODE_ENV = production
     ALLOWED_ORIGINS = https://your-frontend-url.vercel.app
     ```
6. Railway will automatically build and deploy

#### Option C: Render (Backend Alternative)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
5. **Add Environment Variables** in Render dashboard
6. Click "Create Web Service"

---

## 🔑 Managing Environment Variables

### For Local Development

1. Copy `.env.example` to `.env` or `.env.local`:
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env.local
   
   # Backend
   cd backend
   cp .env.example .env
   ```

2. Fill in your actual values in `.env` or `.env.local`

3. Never commit these files (already protected by .gitignore)

### For Production Deployment

**DO NOT** put real values in `.env.example` files!

Instead:
1. Keep real values in your local `.env` files (not uploaded)
2. Manually add them to your hosting platform's dashboard
3. Each platform has its own environment variables section:
   - **Vercel**: Project Settings → Environment Variables
   - **Railway**: Project → Variables tab
   - **Render**: Environment → Environment Variables
   - **Netlify**: Site Settings → Environment Variables

---

## 📋 Environment Variables Checklist

### Frontend Variables Needed:
- [ ] `NEXT_PUBLIC_API_URL` - Your backend API URL
- [ ] `NEXT_PUBLIC_APP_URL` - Your frontend URL
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` - WhatsApp number
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `NEXT_PUBLIC_CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` - Cloudinary preset
- [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` - (Optional) Google verification

### Backend Variables Needed:
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `JWT_EXPIRES_IN` - Token expiration time
- [ ] `PORT` - Server port (usually 5000)
- [ ] `NODE_ENV` - Environment (production/development)
- [ ] `ALLOWED_ORIGINS` - Frontend URL for CORS
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret

---

## ⚠️ Important Security Notes

### DO:
✅ Use `.env.example` files as templates
✅ Add real values only in hosting platform dashboards
✅ Keep `.env` files in `.gitignore`
✅ Use strong, random JWT secrets
✅ Use environment-specific values (dev vs production)

### DON'T:
❌ Never commit `.env` files to GitHub
❌ Never put real secrets in `.env.example`
❌ Never share `.env` files publicly
❌ Never hardcode secrets in source code
❌ Never use weak JWT secrets

---

## 🔄 Updating Environment Variables

### After Deployment:

If you need to change environment variables:

1. **Update in hosting platform dashboard**
   - Go to environment variables section
   - Edit the variable
   - Save changes

2. **Redeploy** (if needed)
   - Some platforms auto-redeploy on env change
   - Others require manual redeploy

3. **Update local `.env` files** (for consistency)

---

## 🆘 Troubleshooting

### "Environment variable not found" error:

1. Check variable name spelling (case-sensitive)
2. Verify variable is set in hosting platform
3. For Next.js: variables must start with `NEXT_PUBLIC_` to be accessible in browser
4. Redeploy after adding variables

### "CORS error" in production:

1. Check `ALLOWED_ORIGINS` in backend includes your frontend URL
2. Make sure frontend URL is correct (https, not http)
3. Verify CORS middleware is configured correctly

### "Database connection failed":

1. Verify `DATABASE_URL` is correct
2. Check database is accessible from hosting platform
3. Ensure SSL mode is enabled for Neon: `?sslmode=require`

---

## 📝 Quick Reference

### Generate Strong JWT Secret:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Check if .env is ignored:
```bash
git status
# .env should NOT appear in the list
```

### Verify .gitignore is working:
```bash
git check-ignore -v .env
# Should show: .gitignore:18:.env    .env
```

---

## ✅ Final Checklist Before Pushing to GitHub

- [ ] `.gitignore` file exists and includes `.env` files
- [ ] `.env.example` files created with template values
- [ ] Real `.env` files contain actual secrets (not uploaded)
- [ ] No secrets hardcoded in source code
- [ ] All sensitive data is in environment variables
- [ ] README.md updated with setup instructions
- [ ] Build successful locally
- [ ] All tests passing

**You're ready to push to GitHub safely!** 🚀

---

**Remember**: Your secrets are safe as long as they stay in `.env` files that are listed in `.gitignore`. The `.env.example` files are just templates to show what variables are needed, without exposing actual values.

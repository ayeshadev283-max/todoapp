# Deployment Guide: Multi-User Todo Application

This document provides step-by-step instructions for deploying the full-stack todo application to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Neon PostgreSQL)](#database-setup-neon-postgresql)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- ☐ GitHub account with repository pushed
- ☐ Vercel account (free tier works)
- ☐ Neon PostgreSQL account (free tier works)
- ☐ All environment variables documented
- ☐ Latest code committed to `main` branch

---

## Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Account

1. Go to https://console.neon.tech
2. Sign up with GitHub or email
3. Create a new project:
   - **Project name**: `todo-app-production`
   - **Region**: Choose closest to your users (e.g., `US East (Ohio)`)
   - **PostgreSQL version**: 15 or later

### Step 2: Obtain Connection String

1. In Neon dashboard, go to your project
2. Navigate to **Dashboard** tab
3. Under **Connection Details**, find your connection string:
   ```
   postgresql://[user]:[password]@[endpoint]/[database]?sslmode=require
   ```
4. **Copy this string** - you'll need it for environment variables

**Example format:**
```
postgresql://neondb_owner:AbC123XyZ@ep-cool-meadow-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Configure Database

1. In Neon dashboard, go to **Settings**
2. Enable **Auto-suspend** (optional, saves costs on free tier)
3. Note the **Connection pooling** option (can use for production)

### Step 4: Run Migrations

On your local machine:

```bash
cd backend

# Set DATABASE_URL to Neon connection string
export DATABASE_URL="postgresql://neondb_owner:..."

# Run migrations
alembic upgrade head

# Verify tables created
# Use Neon SQL Editor or psql to check tables exist
```

Expected tables after migration:
- `users` (id, email, hashed_password, created_at)
- `tasks` (id, user_id, title, description, completed, created_at, updated_at)
- `alembic_version` (for migration tracking)

---

## Backend Deployment

### Recommended Platforms

1. **Railway** (easiest, $5/month)
2. **Render** (free tier available)
3. **Fly.io** (free tier, requires Dockerfile)

### Option 1: Deploy to Railway

1. **Sign up** at https://railway.app
2. **Create New Project** → **Deploy from GitHub repo**
3. **Select your repository**
4. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Add Environment Variables**:
   ```
   DATABASE_URL=postgresql://neondb_owner:...
   BETTER_AUTH_SECRET=<generate-32-char-secret>
   CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
   ENVIRONMENT=production
   ```
6. **Deploy** - Railway will auto-deploy
7. **Note your backend URL**: e.g., `https://todo-api-production.up.railway.app`

### Option 2: Deploy to Render

1. **Sign up** at https://render.com
2. **New Web Service** → **Build and deploy from a Git repository**
3. **Connect GitHub repository**
4. **Configure**:
   - **Name**: `todo-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for production)
5. **Environment Variables** (same as Railway above)
6. **Create Web Service**
7. **Note your backend URL**: e.g., `https://todo-backend.onrender.com`

### Option 3: Deploy to Fly.io

Requires a `Dockerfile`. Example:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ app/
COPY alembic/ alembic/
COPY alembic.ini .

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

Deploy with:
```bash
fly launch
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set BETTER_AUTH_SECRET="your-secret"
fly deploy
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Environment Variables

Create `frontend/.env.local` with:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Step 2: Deploy to Vercel

1. **Sign up** at https://vercel.com
2. **Import Project** → **Import Git Repository**
3. **Select your repository**
4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. **Environment Variables**:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend.railway.app` (your backend URL)
6. **Deploy**
7. **Note your frontend URL**: e.g., `https://todo-app.vercel.app`

### Step 3: Update Backend CORS

After deploying frontend:

1. Go back to your backend deployment (Railway/Render)
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://todo-app.vercel.app,http://localhost:3000
   ```
3. **Redeploy backend** to apply changes

---

## Post-Deployment Verification

### 1. Health Check

Test backend health endpoint:
```bash
curl https://your-backend.railway.app/health

# Expected response:
# {"status":"healthy","database":"connected"}
```

### 2. API Test

Sign up a test user:
```bash
curl -X POST https://your-backend.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'

# Expected: 200 OK with JWT token
```

### 3. Frontend Test

1. Visit `https://your-frontend.vercel.app`
2. Sign up with email and password
3. Create a task
4. Verify task appears in list
5. Mark task as complete
6. Edit and delete task

### 4. Security Verification

Run the security test suite from a remote machine:

```bash
# Clone repo
git clone <your-repo>
cd specs/002-web-app

# Set production URLs
export BACKEND_URL=https://your-backend.railway.app
export FRONTEND_URL=https://your-frontend.vercel.app

# Run tests
./security-tests.sh
```

---

## Environment Variables Reference

### Backend Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` | ✅ Yes |
| `BETTER_AUTH_SECRET` | JWT signing secret (min 32 chars) | `d9j2k3l4m5n6o7p8q9r0s1t2u3v4w5x6` | ✅ Yes |
| `CORS_ORIGINS` | Allowed frontend origins | `https://app.vercel.app,http://localhost:3000` | ✅ Yes |
| `ENVIRONMENT` | Environment name | `production` | ⚠️ Recommended |
| `LOG_LEVEL` | Logging level | `info`, `debug`, `warning` | ⚠️ Recommended |

### Frontend Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://backend.railway.app` | ✅ Yes |

---

## Deployment Checklist

Before deploying:

- ☐ All tests pass locally
- ☐ Security tests completed (Phase 9)
- ☐ Database migrations tested against Neon
- ☐ Environment variables documented
- ☐ Secrets NOT committed to git (check `.gitignore`)
- ☐ CORS origins configured for production
- ☐ Health check endpoint working
- ☐ Frontend and backend URLs noted

After deploying:

- ☐ Health check returns 200
- ☐ Can sign up new user
- ☐ Can log in
- ☐ Can create, edit, delete tasks
- ☐ CORS working (no console errors)
- ☐ Security tests pass against production
- ☐ SSL/HTTPS working

---

## Troubleshooting

### Database Connection Errors

**Error**: `password authentication failed`

**Solution**:
1. Verify `DATABASE_URL` in backend environment variables
2. Check password doesn't contain special chars that need URL encoding
3. In Neon dashboard, reset database password and update `DATABASE_URL`

**Error**: `could not connect to server`

**Solution**:
1. Verify Neon project is not suspended (free tier auto-suspends)
2. Check `sslmode=require` is in connection string
3. Verify region/endpoint is correct

### CORS Errors in Browser

**Error**: `blocked by CORS policy`

**Solution**:
1. Verify `CORS_ORIGINS` in backend includes production frontend URL
2. Ensure no trailing slashes in URLs
3. Redeploy backend after changing CORS settings
4. Check browser console for exact origin being blocked

### JWT Errors

**Error**: `Invalid token` or `Token has expired`

**Solution**:
1. Verify `BETTER_AUTH_SECRET` is set in backend
2. Clear browser localStorage: `localStorage.clear()`
3. Sign up/log in again to get fresh token
4. Check token expiration (default 7 days)

### 404 Not Found on API

**Error**: API calls return 404

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in frontend includes correct backend URL
2. Check backend is deployed and health check works
3. Ensure API routes don't have extra/missing slashes

### Build Failures

**Backend build fails**:
- Check `requirements.txt` has all dependencies
- Verify Python version (3.11+)
- Check build logs for missing system packages

**Frontend build fails**:
- Run `npm run build` locally first
- Check TypeScript errors: `npm run type-check`
- Verify all environment variables set in Vercel

---

## Monitoring & Maintenance

### Health Monitoring

Set up uptime monitoring with:
- **UptimeRobot**: https://uptimerobot.com (free)
- **Pingdom**: https://www.pingdom.com

Monitor endpoint: `https://your-backend.railway.app/health`

### Logs

**Backend logs**:
- Railway: Dashboard → Logs tab
- Render: Dashboard → Logs tab

**Frontend logs**:
- Vercel: Dashboard → Deployments → View Function Logs

### Database Backups

Neon PostgreSQL:
- Free tier: Point-in-time recovery to any point in the last 7 days
- Paid tier: Longer retention periods

---

## Scaling Considerations

### Database
- **Neon**: Auto-scales compute, add connection pooling for high traffic
- **Indexes**: Add indexes on frequently queried columns (`user_id`, `created_at`)

### Backend
- **Horizontal scaling**: Increase instance count on Railway/Render
- **Caching**: Add Redis for session caching (future enhancement)

### Frontend
- **Vercel**: Automatically scales, uses CDN for static assets
- **Images**: Use Next.js Image component for optimization

---

## Cost Estimates

### Free Tier (Development/Testing)
- **Database**: Neon PostgreSQL Free (~$0/month, 512MB storage)
- **Backend**: Render Free or Railway Trial (~$0/month)
- **Frontend**: Vercel Free (~$0/month)
- **Total**: **$0/month**

### Production Tier
- **Database**: Neon Pro (~$19/month, 10GB storage, auto-scaling)
- **Backend**: Railway Pro (~$5/month) or Render Starter (~$7/month)
- **Frontend**: Vercel Pro (~$20/month, optional)
- **Total**: **~$24-39/month**

---

## Support & Resources

- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Rollback Procedure

If deployment fails:

1. **Vercel**: Rollback to previous deployment in dashboard
2. **Railway/Render**: Redeploy previous commit from GitHub
3. **Database**: Use Neon point-in-time recovery if needed
4. **Verify**: Run health checks and security tests

---

**Last Updated**: 2026-01-10
**Maintainer**: Development Team

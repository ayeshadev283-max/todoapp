# Deploy Backend to Hugging Face Spaces

This guide will help you deploy your FastAPI backend to Hugging Face Spaces.

## Prerequisites

1. **Hugging Face Account**: Sign up at https://huggingface.co
2. **Git**: Installed on your machine
3. **PostgreSQL Database**: You'll need a hosted PostgreSQL database (see options below)

## Step 1: Set Up PostgreSQL Database

Hugging Face Spaces doesn't include a built-in database. You need to use an external PostgreSQL service:

### Option A: Neon (Recommended - Free tier available)
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@host/dbname`)

### Option B: Supabase
1. Go to https://supabase.com
2. Create a new project
3. Go to Database Settings → Connection String → URI
4. Copy the connection string

### Option C: Railway
1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string

### Option D: ElephantSQL
1. Go to https://www.elephantsql.com
2. Create a free "Tiny Turtle" instance
3. Copy the connection URL

## Step 2: Create Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click **"Create new Space"**
3. Configure:
   - **Space name**: `todo-api-backend` (or your choice)
   - **License**: MIT
   - **SDK**: Docker
   - **Space hardware**: CPU basic (free tier)
4. Click **Create Space**

## Step 3: Configure Environment Variables

In your Hugging Face Space:

1. Go to **Settings** tab
2. Scroll to **Repository secrets**
3. Add these secrets:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
BETTER_AUTH_SECRET=your-super-secret-key-at-least-32-characters-long
CORS_ORIGINS=https://your-frontend-domain.com,https://another-domain.com
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DAYS=7
```

**Important**:
- Replace `DATABASE_URL` with your actual PostgreSQL connection string from Step 1
- Generate a secure random string for `BETTER_AUTH_SECRET` (32+ characters)
- Update `CORS_ORIGINS` with your frontend URL (e.g., Vercel deployment)

## Step 4: Push Code to Hugging Face

### Method A: Git Clone and Push (Recommended)

```bash
# Clone your Hugging Face Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME

# Copy backend files
cp -r /path/to/your/backend/* .

# Add and commit
git add .
git commit -m "Initial deployment"

# Push to Hugging Face
git push
```

### Method B: Direct Upload via Web UI

1. Go to your Space's **Files** tab
2. Click **Add file** → **Upload files**
3. Upload all backend files:
   - `app/` folder (all files)
   - `alembic/` folder (all files)
   - `alembic.ini`
   - `requirements.txt`
   - `Dockerfile`
   - `README.md`
   - `.dockerignore`
4. Commit the changes

## Step 5: Wait for Build

1. Go to the **App** tab of your Space
2. Watch the build logs
3. The space will automatically:
   - Build the Docker image
   - Install dependencies
   - Run database migrations
   - Start the FastAPI server

Build typically takes 2-5 minutes.

## Step 6: Verify Deployment

Once the build is complete:

1. **Check Health Endpoint**:
   ```bash
   curl https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health
   ```

   Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected"
   }
   ```

2. **Check API Documentation**:
   Visit: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/docs`

3. **Test Signup**:
   ```bash
   curl -X POST https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123456"}'
   ```

## Step 7: Connect Frontend

Update your frontend environment variables:

```env
# .env.local (for Next.js frontend)
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

And update your backend's `CORS_ORIGINS` to include your frontend URL.

## Troubleshooting

### Build Fails

**Check Build Logs**:
- Go to **App** tab → Click on build logs
- Look for error messages

**Common Issues**:
- Missing `Dockerfile`: Ensure Dockerfile is in the root of your repo
- Wrong port: Dockerfile must expose port 7860
- Database connection: Verify `DATABASE_URL` secret is set correctly

### Database Connection Error

**Symptoms**: Health check shows `"database": "error"`

**Solutions**:
1. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
2. Check database is accessible from the internet (not localhost)
3. Ensure database user has CREATE TABLE permissions
4. Try connecting manually: `psql $DATABASE_URL`

### CORS Errors

**Symptoms**: Frontend can't connect, browser shows CORS errors

**Solution**:
1. Add frontend URL to `CORS_ORIGINS` secret in Space settings
2. Separate multiple origins with commas: `https://app1.com,https://app2.com`
3. Restart the Space after updating secrets

### Migrations Not Running

**Symptoms**: Tables don't exist in database

**Solution**:
The Dockerfile runs migrations automatically. If they fail:
1. Check build logs for migration errors
2. Manually run migrations:
   ```bash
   # From your local machine
   cd backend
   export DATABASE_URL="your-production-database-url"
   alembic upgrade head
   ```

## Monitoring

### View Logs

1. Go to your Space
2. Click **Logs** tab
3. See real-time application logs

### Check Status

- **Health endpoint**: `https://YOUR_SPACE.hf.space/health`
- **OpenAPI docs**: `https://YOUR_SPACE.hf.space/docs`

## Updating Your Deployment

To update your deployed application:

```bash
# Make changes to your code
# ...

# Commit and push
git add .
git commit -m "Update: description of changes"
git push

# Hugging Face will automatically rebuild and redeploy
```

## Cost and Limits

**Free Tier**:
- ✅ CPU basic hardware (free)
- ✅ Unlimited API requests
- ✅ Always-on (no cold starts)
- ⚠️ Limited compute resources

**Paid Tiers**:
- Upgraded CPU or GPU hardware
- More memory and compute
- Priority builds

## Security Best Practices

1. **Never commit secrets**: Use Hugging Face Repository Secrets
2. **Use strong SECRET_KEY**: Generate with `openssl rand -hex 32`
3. **Restrict CORS**: Only allow your frontend domains
4. **Use HTTPS**: Hugging Face provides HTTPS automatically
5. **Rotate secrets**: Change `BETTER_AUTH_SECRET` periodically

## Example Space URL

After deployment, your API will be available at:

```
https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space
```

For example:
```
https://johndoe-todo-api.hf.space/docs
https://johndoe-todo-api.hf.space/api/tasks
```

## Next Steps

1. ✅ Deploy backend to Hugging Face Spaces
2. ✅ Deploy frontend to Vercel/Netlify
3. ✅ Connect frontend to backend API
4. ✅ Test complete authentication flow
5. ✅ Monitor logs and performance

## Support

- **Hugging Face Docs**: https://huggingface.co/docs/hub/spaces
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Issues**: Report issues in your project repository

# 🚀 Vercel Deployment Guide

## Prerequisites

✅ Все настроено:
- Supabase (10 tables + functions)
- Redis (Upstash)
- OpenRouter API
- Replicate API
- 12 Presets seeded

---

## Step 1: Push to GitHub

```bash
cd ~/.openclaw/workspace/v0-reklama
git add .
git commit -m "feat: complete MVP with Image + Video generators"
git push origin main
```

---

## Step 2: Deploy to Vercel

### Via Vercel Dashboard:

1. Go to https://vercel.com
2. New Project → Import from GitHub
3. Select `v0-reklama` repository
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Environment Variables:

Add all variables from `.env.local`:

```bash
# Database
SUPABASE_URL=https://ucuklqljkwaazzdwyrgw.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redis
REDIS_URL=rediss://default:...@smooth-akita-4874.upstash.io:6379
UPSTASH_REDIS_REST_URL=https://smooth-akita-4874.upstash.io
UPSTASH_REDIS_REST_TOKEN=ARMKAAImcD...

# AI Models
OPENROUTER_API_KEY=sk-or-v1-...
OPENAI_API_KEY=sk-proj-...
REPLICATE_API_TOKEN=r8_...

# Storage
STORAGE_PROVIDER=supabase
STORAGE_BUCKET=higgsfield-media

# App Config
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Rate Limits
RATE_LIMIT_FREE_DAILY=10
RATE_LIMIT_STARTER_DAILY=100
RATE_LIMIT_PRO_DAILY=500
RATE_LIMIT_STUDIO_DAILY=2000
```

5. Click **Deploy**

---

## Step 3: SQL Functions (Supabase)

Execute in Supabase SQL Editor:

```sql
-- Copy content from database/functions.sql
-- Or run directly:
```

```bash
psql "postgresql://postgres:[PASSWORD]@db.ucuklqljkwaazzdwyrgw.supabase.co:5432/postgres" \
  < database/functions.sql
```

---

## Step 4: Workers Deployment

**Workers CANNOT run on Vercel** (no background jobs).

### Option A: Run on VPS (146.190.126.29)

```bash
# SSH to VPS
ssh -p 2222 openclaw@146.190.126.29

# Clone repo
cd /home/openclaw/.openclaw/workspace
git clone https://github.com/diboi3443-sys/v0-reklama.git
cd v0-reklama

# Install dependencies
npm install

# Copy .env.local (with production URLs)
nano .env.local
# Paste all env vars

# Start workers with PM2
pm2 start npx --name image-worker -- tsx workers/image-worker.ts
pm2 start npx --name video-worker -- tsx workers/video-worker.ts

# Save PM2 config
pm2 save
pm2 startup
```

### Option B: Separate Worker Server (Railway/Render)

Deploy workers as standalone Node.js apps on Railway or Render.

---

## Step 5: Test Production

### Test Image Generation:
```bash
curl -X POST https://your-app.vercel.app/api/generate/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset",
    "model": "black-forest-labs/flux-pro",
    "width": 1024,
    "height": 1024
  }'
```

### Test Presets API:
```bash
curl https://your-app.vercel.app/api/presets?category=cinematic&limit=10
```

### Test Frontend:
- https://your-app.vercel.app/image
- https://your-app.vercel.app/presets
- https://your-app.vercel.app/create/video

---

## Step 6: Configure Custom Domain (Optional)

1. Vercel Dashboard → Project Settings → Domains
2. Add domain: `v0-reklama.com`
3. Update DNS records
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Vercel (Next.js Frontend + API)       │
│  - /image → Image Generator UI          │
│  - /presets → Presets Library           │
│  - /create/video → Video Generator      │
│  - /api/* → API Routes                  │
└──────────────┬──────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│  Supabase (Database + Storage)           │
│  - PostgreSQL (10 tables)                │
│  - Storage (uploaded images/videos)      │
└──────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│  Upstash Redis (Queue State)             │
└──────────────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│  VPS Workers (Background Jobs)           │
│  - Image Worker (3 concurrent)           │
│  - Video Worker (2 concurrent)           │
└──────────────┬───────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────┐
│  OpenRouter / Replicate (AI Models)      │
│  - Flux Pro (images)                     │
│  - Kling v3 (videos)                     │
└──────────────────────────────────────────┘
```

---

## Monitoring

### Vercel:
- Dashboard → Analytics
- Real User Monitoring (RUM)
- Function logs

### Workers:
```bash
# SSH to VPS
pm2 monit
pm2 logs image-worker
pm2 logs video-worker
```

### Database:
- Supabase Dashboard → Logs
- Check generation counts:
```sql
SELECT COUNT(*) FROM generations;
SELECT status, COUNT(*) FROM generations GROUP BY status;
```

---

## Scaling

### Frontend (Vercel):
- Auto-scales automatically
- Edge Functions globally distributed

### Workers (VPS):
```bash
# Scale up workers
pm2 scale image-worker 5  # 5 instances
pm2 scale video-worker 3  # 3 instances
```

Or migrate to Kubernetes/ECS for auto-scaling.

---

## Cost Estimate (Monthly)

| Service | Cost |
|---------|------|
| Vercel (Hobby) | $0 (or $20 for Pro) |
| Supabase (Free tier) | $0 (500MB DB, 1GB storage) |
| Upstash Redis (Free) | $0 (10k commands/day) |
| VPS (DigitalOcean) | $12 (2GB RAM) |
| OpenRouter API | ~$50-200 (usage-based) |
| **Total** | **~$60-230/month** |

---

## Troubleshooting

**Workers not processing:**
```bash
# Check if workers are running
pm2 status

# Restart workers
pm2 restart image-worker video-worker

# Check logs
pm2 logs --lines 50
```

**API 500 errors:**
- Check Vercel Function Logs
- Verify environment variables
- Test Supabase/Redis connections

**Uploads failing:**
- Check Supabase Storage bucket exists
- Verify CORS settings in Supabase

---

## Next Steps

After deployment:
1. ✅ Test all features
2. ✅ Monitor error rates
3. ✅ Set up alerts (Sentry, LogRocket)
4. ✅ Add authentication (NextAuth.js)
5. ✅ Enable billing (YooKassa)
6. ✅ Marketing & launch 🚀

---

**Ready to deploy!** 🎉

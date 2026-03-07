# Redis Setup for v0-reklama

## Option 1: Upstash (Recommended for Development)

**Advantages:**
- Free tier: 10,000 commands/day
- Serverless (no maintenance)
- Global edge network
- Perfect for BullMQ queues

**Setup:**

1. Go to https://upstash.com
2. Create account (free)
3. Create new Redis database:
   - Name: `v0-reklama-queue`
   - Region: Choose closest to your Vercel deployment
   - Type: Regional (free tier)
4. Copy connection string:
   ```
   REDIS_URL=rediss://default:[PASSWORD]@[ENDPOINT].upstash.io:6379
   ```
5. Add to `.env.local`

---

## Option 2: Railway (Alternative)

**Advantages:**
- $5/month credit free
- Redis + PostgreSQL in one place
- Easy deployment

**Setup:**

1. Go to https://railway.app
2. New Project → Add Redis
3. Copy connection URL
4. Add to `.env.local`

---

## Option 3: Local Redis (Development Only)

**Docker:**
```bash
docker run -d \
  --name v0-reklama-redis \
  -p 6379:6379 \
  redis:7-alpine

# Set in .env.local:
REDIS_URL=redis://localhost:6379
```

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis

# Set in .env.local:
REDIS_URL=redis://localhost:6379
```

---

## Option 4: Production (AWS ElastiCache / DigitalOcean)

For production, use managed Redis:
- AWS ElastiCache
- DigitalOcean Managed Redis
- Google Cloud Memorystore
- Yandex Cloud Managed Redis (for Russia)

---

## Testing Redis Connection

```bash
cd v0-reklama
node scripts/test-redis.js
```

Should output:
```
✅ Redis connected
✅ SET test key
✅ GET test key: test-value
✅ Redis working!
```

---

## Recommended: Upstash (for now)

For development and MVP, use **Upstash** because:
- Free tier is generous
- No maintenance
- Works with Vercel deployments
- Easy to upgrade later

We'll setup production Redis when scaling.

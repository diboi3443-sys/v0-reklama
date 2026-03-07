# 🚀 v0-reklama Quick Start

## ✅ Prerequisites

All infrastructure is already configured:
- ✅ Supabase (10 tables deployed)
- ✅ Redis (Upstash connected)
- ✅ OpenRouter API (configured)
- ✅ 12 Presets seeded

## 🏃 Quick Start (Single Command)

```bash
cd ~/.openclaw/workspace/v0-reklama
./start-dev.sh
```

This will start:
- Image Worker
- Video Worker  
- Next.js dev server

## 🎯 Manual Start (3 Terminals)

### Terminal 1: Image Worker
```bash
cd ~/.openclaw/workspace/v0-reklama
npx tsx workers/image-worker.ts
```

### Terminal 2: Video Worker
```bash
cd ~/.openclaw/workspace/v0-reklama
npx tsx workers/video-worker.ts
```

### Terminal 3: Next.js
```bash
cd ~/.openclaw/workspace/v0-reklama
npm run dev
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Image Generator:** http://localhost:3000/image
- **Video Generator:** http://localhost:3000/create/video
- **Presets Library:** http://localhost:3000/presets ⭐

## 🧪 Test Image Generation

1. Go to http://localhost:3000/image
2. Enter prompt: "A beautiful sunset over mountains"
3. Click "Generate"
4. Watch progress bar (0-100%)
5. Download result when complete

## 🎬 Test Presets

1. Go to http://localhost:3000/presets
2. Browse 12 presets
3. Search "zoom"
4. Filter by "Cinematic"
5. Click a preset → See details
6. Click "Use This Preset" → Redirects to video generator

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| Infrastructure | ✅ | Supabase + Redis + OpenRouter |
| Backend API | ✅ | 4 endpoints working |
| Image Generator | ✅ | Real API, live progress |
| Presets Library | ✅ | 12 presets, search & filters |
| Video Generator | ⏳ | Backend ready, frontend next |
| Workers | ✅ | Image + Video workers |

## 🔍 Troubleshooting

**Workers not generating:**
```bash
# Check Redis connection
npm run test:infra

# Check worker logs
npx tsx workers/image-worker.ts
```

**API errors:**
```bash
# Check environment variables
cat .env.local | grep -E "(SUPABASE|REDIS|OPENROUTER)"
```

**Presets not showing:**
```bash
# Re-seed presets
npx tsx database/seed-presets.ts
```

## 📚 Documentation

- `docs/PHASE1_INFRASTRUCTURE_COMPLETE.md` — Infrastructure setup
- `docs/PHASE2_BACKEND_COMPLETE.md` — Backend API
- `docs/PHASE3_FRONTEND_COMPLETE.md` — Frontend integration

## 🎉 Ready!

MVP is functional and ready for testing!

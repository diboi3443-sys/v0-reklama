#!/bin/bash
# Quick start script for v0-reklama development

echo "🚀 Starting v0-reklama development environment..."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please create .env.local with required environment variables"
  exit 1
fi

# Function to start a process in background
start_worker() {
  local name=$1
  local command=$2
  echo "▶️  Starting $name..."
  $command &
  echo "   PID: $!"
}

# Start workers
echo "📦 Starting workers..."
start_worker "Image Worker" "npx tsx workers/image-worker.ts"
start_worker "Video Worker" "npx tsx workers/video-worker.ts"

echo ""
echo "🌐 Starting Next.js dev server..."
npm run dev &
NEXT_PID=$!

echo ""
echo "✅ All services started!"
echo ""
echo "📍 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - Image Generator: http://localhost:3000/image"
echo "   - Video Generator: http://localhost:3000/create/video"
echo "   - Presets Library: http://localhost:3000/presets"
echo ""
echo "🛑 Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
wait

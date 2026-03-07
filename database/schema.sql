-- v0-reklama Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'pro', 'studio')),
  credits INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('starter', 'pro', 'studio')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  price_rub INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  yukassa_payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- ============================================
-- PRESETS TABLE (400+ animation presets)
-- ============================================
CREATE TABLE IF NOT EXISTS presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ru VARCHAR(255),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('cinematic', 'social', 'ecommerce', 'creative', 'other')),
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  description_ru TEXT,
  params JSONB NOT NULL DEFAULT '{}',
  preview_url TEXT,
  preview_gif_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  min_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_presets_category ON presets(category);
CREATE INDEX IF NOT EXISTS idx_presets_slug ON presets(slug);
CREATE INDEX IF NOT EXISTS idx_presets_tags ON presets USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_presets_featured ON presets(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_presets_rating ON presets(rating DESC);

-- ============================================
-- GENERATIONS TABLE (all image/video generations)
-- ============================================
CREATE TABLE IF NOT EXISTS generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('image', 'video', 'audio')),
  mode VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Input
  prompt TEXT,
  negative_prompt TEXT,
  input_image_url TEXT,
  reference_video_url TEXT,
  preset_id UUID REFERENCES presets(id) ON DELETE SET NULL,
  
  -- Parameters
  model VARCHAR(100),
  params JSONB DEFAULT '{}',
  
  -- Output
  result_url TEXT,
  result_urls TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  
  -- Cost & Performance
  cost_credits INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  queue_time_ms INTEGER,
  
  -- Error handling
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_type ON generations(type);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_preset_id ON generations(preset_id);

-- ============================================
-- JOBS QUEUE (BullMQ state tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bull_job_id VARCHAR(255) UNIQUE,
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE,
  queue_name VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'failed', 'delayed', 'stuck')),
  progress INTEGER DEFAULT 0,
  data JSONB DEFAULT '{}',
  result JSONB,
  error TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_bull_job_id ON jobs(bull_job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_generation_id ON jobs(generation_id);
CREATE INDEX IF NOT EXISTS idx_jobs_queue_name ON jobs(queue_name);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- ============================================
-- CHARACTERS (Soul ID)
-- ============================================
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  soul_id VARCHAR(100) UNIQUE,
  
  -- Training
  status VARCHAR(50) DEFAULT 'training' CHECK (status IN ('uploading', 'training', 'ready', 'failed')),
  training_images TEXT[] DEFAULT '{}',
  training_progress INTEGER DEFAULT 0,
  model_url TEXT,
  
  -- Metadata
  style VARCHAR(50) DEFAULT 'realistic' CHECK (style IN ('realistic', 'stylized', 'anime')),
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  trained_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_soul_id ON characters(soul_id);
CREATE INDEX IF NOT EXISTS idx_characters_status ON characters(status);

-- ============================================
-- PROJECTS (organize generations)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_share_token ON projects(share_token) WHERE share_token IS NOT NULL;

-- ============================================
-- PROJECT_ITEMS (many-to-many: projects <-> generations)
-- ============================================
CREATE TABLE IF NOT EXISTS project_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, generation_id)
);

CREATE INDEX IF NOT EXISTS idx_project_items_project_id ON project_items(project_id);
CREATE INDEX IF NOT EXISTS idx_project_items_generation_id ON project_items(generation_id);

-- ============================================
-- USAGE_LOGS (analytics & billing)
-- ============================================
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  credits_used INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_action ON usage_logs(action);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created_at ON usage_logs(created_at DESC);

-- ============================================
-- PAYMENTS (YooKassa transactions)
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  yukassa_payment_id VARCHAR(255) UNIQUE NOT NULL,
  amount_rub INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'waiting_for_capture', 'succeeded', 'cancelled', 'failed')),
  payment_method VARCHAR(50),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_yukassa_id ON payments(yukassa_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ============================================
-- TRIGGERS (auto-update updated_at)
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_presets_updated_at BEFORE UPDATE ON presets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generations_updated_at BEFORE UPDATE ON generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Users: can only see their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: can only see their own
CREATE POLICY subscriptions_select_own ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Generations: can only see their own
CREATE POLICY generations_select_own ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY generations_insert_own ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Characters: can only see their own
CREATE POLICY characters_select_own ON characters
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY characters_insert_own ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Projects: can see own + public
CREATE POLICY projects_select_own_or_public ON projects
  FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY projects_insert_own ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY projects_update_own ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Presets: public read
CREATE POLICY presets_select_all ON presets
  FOR SELECT USING (TRUE);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Seed test user (password: test123)
INSERT INTO users (email, password_hash, name, tier, credits) VALUES
  ('test@example.com', '$2a$10$X9RvZ8bHqb8HXJq.ZN7B7uY8F9K5Z0X1X2X3X4X5X6X7X8X9X0X1X', 'Test User', 'pro', 500)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VIEWS (useful queries)
-- ============================================

-- User stats view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.tier,
  u.credits,
  COUNT(DISTINCT g.id) as total_generations,
  COUNT(DISTINCT CASE WHEN g.type = 'image' THEN g.id END) as image_count,
  COUNT(DISTINCT CASE WHEN g.type = 'video' THEN g.id END) as video_count,
  COUNT(DISTINCT c.id) as character_count,
  COUNT(DISTINCT p.id) as project_count,
  COALESCE(SUM(ul.credits_used), 0) as total_credits_used
FROM users u
LEFT JOIN generations g ON g.user_id = u.id
LEFT JOIN characters c ON c.user_id = u.id
LEFT JOIN projects p ON p.user_id = u.id
LEFT JOIN usage_logs ul ON ul.user_id = u.id
GROUP BY u.id, u.email, u.tier, u.credits;

COMMENT ON TABLE users IS 'User accounts with tier and credits';
COMMENT ON TABLE presets IS '400+ animation presets for video generation';
COMMENT ON TABLE generations IS 'All AI generations (images, videos, audio)';
COMMENT ON TABLE jobs IS 'BullMQ job queue state tracking';
COMMENT ON TABLE characters IS 'Soul ID persistent character models';
COMMENT ON TABLE projects IS 'User projects containing multiple generations';

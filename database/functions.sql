-- Helper functions for v0-reklama

-- Function to deduct credits from user
CREATE OR REPLACE FUNCTION deduct_credits(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET credits = GREATEST(credits - amount, 0)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment preset usage count
CREATE OR REPLACE FUNCTION increment_preset_usage(preset_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE presets
  SET usage_count = usage_count + 1
  WHERE id = preset_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user tier limits
CREATE OR REPLACE FUNCTION get_tier_limits(tier_name VARCHAR)
RETURNS TABLE (
  max_generations_per_day INTEGER,
  max_concurrent_jobs INTEGER,
  can_use_premium_presets BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE tier_name
      WHEN 'free' THEN 10
      WHEN 'starter' THEN 100
      WHEN 'pro' THEN 500
      WHEN 'studio' THEN 2000
      ELSE 10
    END AS max_generations_per_day,
    CASE tier_name
      WHEN 'free' THEN 1
      WHEN 'starter' THEN 3
      WHEN 'pro' THEN 5
      WHEN 'studio' THEN 10
      ELSE 1
    END AS max_concurrent_jobs,
    CASE tier_name
      WHEN 'free' THEN FALSE
      WHEN 'starter' THEN TRUE
      WHEN 'pro' THEN TRUE
      WHEN 'studio' THEN TRUE
      ELSE FALSE
    END AS can_use_premium_presets;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION deduct_credits TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_preset_usage TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_tier_limits TO anon, authenticated;

-- Create pricing_tiers table
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Tier identification
  tier_key TEXT UNIQUE NOT NULL CHECK (tier_key IN ('free', 'pro')),
  tier_name TEXT NOT NULL,
  tier_name_vi TEXT NOT NULL,
  description TEXT,
  description_vi TEXT,
  display_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,

  -- Pricing (in VND)
  price_monthly DECIMAL(10,2) DEFAULT 0,
  price_annual DECIMAL(10,2) DEFAULT 0,

  -- Limits (-1 means unlimited)
  max_services INTEGER DEFAULT 100,
  max_products INTEGER DEFAULT 100,
  max_gallery_images INTEGER DEFAULT 20,
  max_themes INTEGER DEFAULT 10,
  storage_mb INTEGER DEFAULT 100, -- 100MB for free, could be higher for pro

  -- Features (JSONB for flexibility)
  features JSONB DEFAULT '[]'::jsonb
);

-- Create index for faster lookups
CREATE INDEX idx_pricing_tiers_tier_key ON pricing_tiers(tier_key);
CREATE INDEX idx_pricing_tiers_active ON pricing_tiers(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active tiers
CREATE POLICY "Public can view active pricing tiers"
  ON pricing_tiers
  FOR SELECT
  USING (is_active = true);

-- Policy: Only admins can modify tiers
CREATE POLICY "Admins can modify pricing tiers"
  ON pricing_tiers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Auto-update updated_at timestamp
CREATE TRIGGER update_pricing_tiers_updated_at
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE pricing_tiers IS 'Defines available subscription tiers (Free, Pro)';

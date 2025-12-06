-- Create merchant_subscriptions table
CREATE TABLE IF NOT EXISTS merchant_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign keys
  merchant_id UUID UNIQUE NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  pricing_tier_id UUID NOT NULL REFERENCES pricing_tiers(id),

  -- Subscription status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),

  -- Dates
  subscription_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- NULL for free tier (never expires)

  -- Metadata
  notes TEXT -- For admin notes, e.g., "Promotional upgrade", "Customer support extension"
);

-- Create indexes
CREATE INDEX idx_merchant_subscriptions_merchant_id ON merchant_subscriptions(merchant_id);
CREATE INDEX idx_merchant_subscriptions_tier_id ON merchant_subscriptions(pricing_tier_id);
CREATE INDEX idx_merchant_subscriptions_status ON merchant_subscriptions(status);
CREATE INDEX idx_merchant_subscriptions_expires_at ON merchant_subscriptions(expires_at) WHERE expires_at IS NOT NULL;

-- Enable RLS
ALTER TABLE merchant_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can view their own subscription
CREATE POLICY "Merchants can view own subscription"
  ON merchant_subscriptions
  FOR SELECT
  USING (merchant_id = auth.uid());

-- Policy: Admins can view all subscriptions
CREATE POLICY "Admins can view all subscriptions"
  ON merchant_subscriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Policy: Only admins can modify subscriptions (manual upgrades/extensions)
CREATE POLICY "Admins can modify subscriptions"
  ON merchant_subscriptions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Auto-update updated_at timestamp
CREATE TRIGGER update_merchant_subscriptions_updated_at
  BEFORE UPDATE ON merchant_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check and update expired subscriptions
CREATE OR REPLACE FUNCTION check_subscription_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  free_tier_id UUID;
BEGIN
  -- Get Free tier ID
  SELECT id INTO free_tier_id
  FROM pricing_tiers
  WHERE tier_key = 'free'
  LIMIT 1;

  -- Update expired Pro subscriptions back to Free
  UPDATE merchant_subscriptions
  SET
    pricing_tier_id = free_tier_id,
    status = 'expired',
    updated_at = NOW()
  WHERE
    expires_at IS NOT NULL
    AND expires_at < NOW()
    AND status = 'active';
END;
$$;

-- Create a cron job to check expiration daily (requires pg_cron extension)
-- This will be run manually or via Supabase Edge Functions
COMMENT ON FUNCTION check_subscription_expiration() IS 'Checks and downgrades expired Pro subscriptions to Free tier';

-- Add comment
COMMENT ON TABLE merchant_subscriptions IS 'Tracks subscription tier and expiration for each merchant';

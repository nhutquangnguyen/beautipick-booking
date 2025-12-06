-- Function to automatically assign Free tier to new merchants
CREATE OR REPLACE FUNCTION auto_assign_free_tier()
RETURNS TRIGGER
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

  -- Create subscription with Free tier
  INSERT INTO merchant_subscriptions (
    merchant_id,
    pricing_tier_id,
    status,
    subscription_started_at,
    expires_at,
    notes
  ) VALUES (
    NEW.id,
    free_tier_id,
    'active',
    NOW(),
    NULL, -- Free tier never expires
    'Auto-assigned Free tier on signup'
  );

  -- Initialize usage tracking
  INSERT INTO subscription_usage (
    merchant_id,
    services_count,
    products_count,
    gallery_images_count,
    storage_used_mb
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    0
  );

  RETURN NEW;
END;
$$;

-- Create trigger to run after merchant insert
CREATE TRIGGER assign_free_tier_on_merchant_create
  AFTER INSERT ON merchants
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_free_tier();

-- Add comment
COMMENT ON FUNCTION auto_assign_free_tier() IS 'Automatically assigns Free tier subscription and initializes usage tracking for new merchants';

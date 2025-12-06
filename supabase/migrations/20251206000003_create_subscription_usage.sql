-- Create subscription_usage table to cache usage counts
CREATE TABLE IF NOT EXISTS subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key
  merchant_id UUID UNIQUE NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

  -- Usage counters
  services_count INTEGER DEFAULT 0 CHECK (services_count >= 0),
  products_count INTEGER DEFAULT 0 CHECK (products_count >= 0),
  gallery_images_count INTEGER DEFAULT 0 CHECK (gallery_images_count >= 0),
  storage_used_mb DECIMAL(10,2) DEFAULT 0 CHECK (storage_used_mb >= 0)
);

-- Create indexes
CREATE INDEX idx_subscription_usage_merchant_id ON subscription_usage(merchant_id);

-- Enable RLS
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Merchants can view their own usage
CREATE POLICY "Merchants can view own usage"
  ON subscription_usage
  FOR SELECT
  USING (merchant_id = auth.uid());

-- Policy: Admins can view all usage
CREATE POLICY "Admins can view all usage"
  ON subscription_usage
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.user_id = auth.uid()
    )
  );

-- Auto-update updated_at timestamp
CREATE TRIGGER update_subscription_usage_updated_at
  BEFORE UPDATE ON subscription_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment service count
CREATE OR REPLACE FUNCTION increment_service_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO subscription_usage (merchant_id, services_count)
  VALUES (NEW.merchant_id, 1)
  ON CONFLICT (merchant_id)
  DO UPDATE SET
    services_count = subscription_usage.services_count + 1,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to decrement service count
CREATE OR REPLACE FUNCTION decrement_service_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE subscription_usage
  SET
    services_count = GREATEST(0, services_count - 1),
    updated_at = NOW()
  WHERE merchant_id = OLD.merchant_id;
  RETURN OLD;
END;
$$;

-- Function to increment product count
CREATE OR REPLACE FUNCTION increment_product_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO subscription_usage (merchant_id, products_count)
  VALUES (NEW.merchant_id, 1)
  ON CONFLICT (merchant_id)
  DO UPDATE SET
    products_count = subscription_usage.products_count + 1,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to decrement product count
CREATE OR REPLACE FUNCTION decrement_product_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE subscription_usage
  SET
    products_count = GREATEST(0, products_count - 1),
    updated_at = NOW()
  WHERE merchant_id = OLD.merchant_id;
  RETURN OLD;
END;
$$;

-- Function to increment gallery image count
CREATE OR REPLACE FUNCTION increment_gallery_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO subscription_usage (merchant_id, gallery_images_count)
  VALUES (NEW.merchant_id, 1)
  ON CONFLICT (merchant_id)
  DO UPDATE SET
    gallery_images_count = subscription_usage.gallery_images_count + 1,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to decrement gallery image count
CREATE OR REPLACE FUNCTION decrement_gallery_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE subscription_usage
  SET
    gallery_images_count = GREATEST(0, gallery_images_count - 1),
    updated_at = NOW()
  WHERE merchant_id = OLD.merchant_id;
  RETURN OLD;
END;
$$;

-- Create triggers for services table
CREATE TRIGGER increment_service_usage_on_insert
  AFTER INSERT ON services
  FOR EACH ROW
  EXECUTE FUNCTION increment_service_count();

CREATE TRIGGER decrement_service_usage_on_delete
  AFTER DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION decrement_service_count();

-- Create triggers for products table
CREATE TRIGGER increment_product_usage_on_insert
  AFTER INSERT ON products
  FOR EACH ROW
  EXECUTE FUNCTION increment_product_count();

CREATE TRIGGER decrement_product_usage_on_delete
  AFTER DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION decrement_product_count();

-- Create triggers for gallery table
CREATE TRIGGER increment_gallery_usage_on_insert
  AFTER INSERT ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION increment_gallery_count();

CREATE TRIGGER decrement_gallery_usage_on_delete
  AFTER DELETE ON gallery
  FOR EACH ROW
  EXECUTE FUNCTION decrement_gallery_count();

-- Add comment
COMMENT ON TABLE subscription_usage IS 'Caches current usage counts for quota enforcement';

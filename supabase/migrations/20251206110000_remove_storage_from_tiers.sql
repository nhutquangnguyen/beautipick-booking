-- Remove storage management from pricing tiers and subscription usage

-- Drop storage_mb column from pricing_tiers table
ALTER TABLE pricing_tiers DROP COLUMN IF EXISTS storage_mb;

-- Drop storage_used_mb column from subscription_usage table
ALTER TABLE subscription_usage DROP COLUMN IF EXISTS storage_used_mb;

-- Add comment
COMMENT ON TABLE subscription_usage IS 'Caches current usage counts for quota enforcement (services, products, gallery images only)';

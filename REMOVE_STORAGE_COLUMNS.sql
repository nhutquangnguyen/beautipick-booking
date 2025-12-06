-- =====================================================
-- SQL Script to Remove Storage Columns
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Drop storage_mb column from pricing_tiers table
ALTER TABLE pricing_tiers DROP COLUMN IF EXISTS storage_mb;

-- Step 2: Drop storage_used_mb column from subscription_usage table
ALTER TABLE subscription_usage DROP COLUMN IF EXISTS storage_used_mb;

-- Step 3: Update table comment
COMMENT ON TABLE subscription_usage IS 'Caches current usage counts for quota enforcement (services, products, gallery images only)';

-- =====================================================
-- Verification Queries (run these after to confirm)
-- =====================================================

-- Check pricing_tiers columns (should NOT see storage_mb)
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'pricing_tiers'
-- ORDER BY ordinal_position;

-- Check subscription_usage columns (should NOT see storage_used_mb)
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'subscription_usage'
-- ORDER BY ordinal_position;

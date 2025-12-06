-- Seed pricing tiers data

-- Insert Free tier
INSERT INTO pricing_tiers (
  tier_key,
  tier_name,
  tier_name_vi,
  description,
  description_vi,
  display_order,
  price_monthly,
  price_annual,
  max_services,
  max_products,
  max_gallery_images,
  max_themes,
  storage_mb,
  features
) VALUES (
  'free',
  'Free',
  'Miễn Phí',
  'Perfect to get started',
  'Hoàn hảo để bắt đầu',
  1,
  0,
  0,
  100,
  100,
  20,
  10,
  100,
  '["starter_themes"]'::jsonb
) ON CONFLICT (tier_key) DO UPDATE SET
  tier_name = EXCLUDED.tier_name,
  tier_name_vi = EXCLUDED.tier_name_vi,
  description = EXCLUDED.description,
  description_vi = EXCLUDED.description_vi,
  display_order = EXCLUDED.display_order,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  max_services = EXCLUDED.max_services,
  max_products = EXCLUDED.max_products,
  max_gallery_images = EXCLUDED.max_gallery_images,
  max_themes = EXCLUDED.max_themes,
  storage_mb = EXCLUDED.storage_mb,
  features = EXCLUDED.features,
  updated_at = NOW();

-- Insert Pro tier
INSERT INTO pricing_tiers (
  tier_key,
  tier_name,
  tier_name_vi,
  description,
  description_vi,
  display_order,
  price_monthly,
  price_annual,
  max_services,
  max_products,
  max_gallery_images,
  max_themes,
  storage_mb,
  features
) VALUES (
  'pro',
  'Pro',
  'Pro',
  'Everything you need to grow',
  'Mọi thứ bạn cần để phát triển',
  2,
  200000,
  1920000,
  -1, -- unlimited
  -1, -- unlimited
  500,
  -1, -- unlimited (all themes)
  2560, -- 2.5GB (500 images * ~5MB average)
  '["all_themes", "custom_domain", "remove_branding"]'::jsonb
) ON CONFLICT (tier_key) DO UPDATE SET
  tier_name = EXCLUDED.tier_name,
  tier_name_vi = EXCLUDED.tier_name_vi,
  description = EXCLUDED.description,
  description_vi = EXCLUDED.description_vi,
  display_order = EXCLUDED.display_order,
  price_monthly = EXCLUDED.price_monthly,
  price_annual = EXCLUDED.price_annual,
  max_services = EXCLUDED.max_services,
  max_products = EXCLUDED.max_products,
  max_gallery_images = EXCLUDED.max_gallery_images,
  max_themes = EXCLUDED.max_themes,
  storage_mb = EXCLUDED.storage_mb,
  features = EXCLUDED.features,
  updated_at = NOW();

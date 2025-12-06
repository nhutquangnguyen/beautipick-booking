-- Fix usage counts for all merchants by recalculating from actual data
-- This handles the case where gallery triggers don't work (no gallery table exists)

DO $$
DECLARE
  merchant_record RECORD;
  services_cnt INTEGER;
  products_cnt INTEGER;
  gallery_cnt INTEGER;
BEGIN
  -- Loop through all merchants
  FOR merchant_record IN SELECT id, settings FROM merchants
  LOOP
    -- Count services
    SELECT COUNT(*) INTO services_cnt
    FROM services
    WHERE merchant_id = merchant_record.id;

    -- Count products
    SELECT COUNT(*) INTO products_cnt
    FROM products
    WHERE merchant_id = merchant_record.id;

    -- Count gallery images from JSON settings
    gallery_cnt := COALESCE(
      jsonb_array_length(
        COALESCE(
          (merchant_record.settings::jsonb)->'gallery',
          '[]'::jsonb
        )
      ),
      0
    );

    -- Update or insert subscription_usage
    INSERT INTO subscription_usage (
      merchant_id,
      services_count,
      products_count,
      gallery_images_count
    ) VALUES (
      merchant_record.id,
      services_cnt,
      products_cnt,
      gallery_cnt
    )
    ON CONFLICT (merchant_id) DO UPDATE SET
      services_count = services_cnt,
      products_count = products_cnt,
      gallery_images_count = gallery_cnt,
      updated_at = NOW();

    RAISE NOTICE 'Fixed merchant %: services=%, products=%, gallery=%',
      merchant_record.id, services_cnt, products_cnt, gallery_cnt;
  END LOOP;
END $$;

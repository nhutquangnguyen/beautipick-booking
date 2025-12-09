-- Add support for multiple images for services and products
-- Migration: Add images array field

-- Add images column to services table (JSONB array of image URLs)
ALTER TABLE services
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add images column to products table (JSONB array of image URLs)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add comment explaining the structure
COMMENT ON COLUMN services.images IS 'Array of image URLs for the service. First image is primary.';
COMMENT ON COLUMN products.images IS 'Array of image URLs for the product. First image is primary.';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_images ON services USING GIN (images);
CREATE INDEX IF NOT EXISTS idx_products_images ON products USING GIN (images);

-- Migration to copy existing image_url to images array (if image_url exists)
UPDATE services
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url != '' AND (images IS NULL OR array_length(images, 1) IS NULL);

UPDATE products
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url != '' AND (images IS NULL OR array_length(images, 1) IS NULL);

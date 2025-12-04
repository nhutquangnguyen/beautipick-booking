-- Add 3 cover image fields for slideshow feature (Showcase Grid theme)
-- Migration: Add cover_image_1, cover_image_2, cover_image_3 to merchants table

ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS cover_image_1 TEXT,
ADD COLUMN IF NOT EXISTS cover_image_2 TEXT,
ADD COLUMN IF NOT EXISTS cover_image_3 TEXT;

-- Add comments to document the purpose of these fields
COMMENT ON COLUMN merchants.cover_image_1 IS 'First cover image for slideshow feature (Showcase Grid theme)';
COMMENT ON COLUMN merchants.cover_image_2 IS 'Second cover image for slideshow feature (Showcase Grid theme)';
COMMENT ON COLUMN merchants.cover_image_3 IS 'Third cover image for slideshow feature (Showcase Grid theme)';

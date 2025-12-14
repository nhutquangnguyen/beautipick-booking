-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_gallery_images_merchant_id ON gallery_images(merchant_id);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(display_order);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to gallery images"
  ON gallery_images
  FOR SELECT
  TO public
  USING (true);

-- Allow merchants to manage their own gallery images
CREATE POLICY "Allow merchants to manage their own gallery images"
  ON gallery_images
  FOR ALL
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM merchants WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    merchant_id IN (
      SELECT id FROM merchants WHERE id = auth.uid()
    )
  );

-- Add some sample gallery images for Bella Spa
INSERT INTO gallery_images (merchant_id, image_url, alt_text, display_order)
SELECT
  id,
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
  'Spa interior',
  1
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
  'Treatment room',
  2
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
  'Relaxation area',
  3
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop',
  'Massage room',
  4
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1596178060810-97251578af87?w=800&h=600&fit=crop',
  'Spa products',
  5
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1610638524532-61d5d6c22e15?w=800&h=600&fit=crop',
  'Reception area',
  6
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
  'Treatment table',
  7
FROM merchants WHERE slug = 'dinh-barista'
UNION ALL
SELECT
  id,
  'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop',
  'Spa amenities',
  8
FROM merchants WHERE slug = 'dinh-barista';

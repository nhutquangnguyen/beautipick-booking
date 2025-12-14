-- Verify and fix favorites table setup
-- This migration is idempotent (safe to run multiple times)

-- Ensure the table exists with correct structure
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'favorites') THEN
    CREATE TABLE public.favorites (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
      UNIQUE(customer_id, merchant_id)
    );
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_favorites_customer_id') THEN
    CREATE INDEX idx_favorites_customer_id ON public.favorites(customer_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_favorites_merchant_id') THEN
    CREATE INDEX idx_favorites_merchant_id ON public.favorites(merchant_id);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can add their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can remove their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Anyone can read favorite counts" ON public.favorites;

-- Recreate all policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can add their own favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can remove their own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Anyone can read favorite counts"
  ON public.favorites
  FOR SELECT
  TO anon
  USING (true);

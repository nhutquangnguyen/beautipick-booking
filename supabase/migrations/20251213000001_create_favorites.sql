-- Create favorites table to store user's favorite merchants
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,

  -- Ensure a user can only favorite a merchant once
  UNIQUE(customer_id, merchant_id)
);

-- Add index for faster queries
CREATE INDEX idx_favorites_customer_id ON public.favorites(customer_id);
CREATE INDEX idx_favorites_merchant_id ON public.favorites(merchant_id);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Policy: Users can add their own favorites
CREATE POLICY "Users can add their own favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

-- Policy: Users can remove their own favorites
CREATE POLICY "Users can remove their own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (customer_id = auth.uid());

-- Policy: Anyone can read favorite counts (for displaying on merchant cards)
CREATE POLICY "Anyone can read favorite counts"
  ON public.favorites
  FOR SELECT
  TO anon
  USING (true);

-- Create theme_previews table for temporary theme try-on feature
CREATE TABLE IF NOT EXISTS public.theme_previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hash text NOT NULL UNIQUE,
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  theme_data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add index for faster lookups
CREATE INDEX idx_theme_previews_hash ON public.theme_previews(hash);
CREATE INDEX idx_theme_previews_merchant_id ON public.theme_previews(merchant_id);
CREATE INDEX idx_theme_previews_expires_at ON public.theme_previews(expires_at);

-- Enable RLS
ALTER TABLE public.theme_previews ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create their own previews
CREATE POLICY "Users can create their own theme previews"
  ON public.theme_previews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = merchant_id);

-- Policy: Users can view their own previews
CREATE POLICY "Users can view their own theme previews"
  ON public.theme_previews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = merchant_id);

-- Policy: Public can view non-expired previews (for the try-on page)
CREATE POLICY "Public can view non-expired theme previews"
  ON public.theme_previews
  FOR SELECT
  TO anon
  USING (expires_at > now());

-- Policy: Users can delete their own previews
CREATE POLICY "Users can delete their own theme previews"
  ON public.theme_previews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = merchant_id);

-- Function to automatically delete expired previews
CREATE OR REPLACE FUNCTION delete_expired_theme_previews()
RETURNS void AS $$
BEGIN
  DELETE FROM public.theme_previews
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- Note: This is optional and requires pg_cron to be enabled
-- COMMENT: Run manually or set up cron job: SELECT delete_expired_theme_previews();

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at_theme_previews
  BEFORE UPDATE ON public.theme_previews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

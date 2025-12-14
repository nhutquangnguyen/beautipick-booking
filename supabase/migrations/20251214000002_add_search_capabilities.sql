-- Add full-text search capabilities to merchants table
-- This enables more relevant search results with ranking

-- Step 0: Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Step 1: Add a generated column for full-text search vector
-- This combines business_name, description, and city for comprehensive search
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS search_vector tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(business_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(city, '')), 'C')
) STORED;

-- Step 2: Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS merchants_search_vector_idx
ON merchants USING GIN (search_vector);

-- Step 3: Add index on commonly searched fields for fallback queries
CREATE INDEX IF NOT EXISTS merchants_business_name_trgm_idx
ON merchants USING GIN (business_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS merchants_city_idx
ON merchants (city) WHERE city IS NOT NULL;

-- Step 4: Add tags support to merchants table
-- This allows filtering by service types (Nails, Spa, Hair, etc.)
ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Step 5: Create index on tags for filtering
CREATE INDEX IF NOT EXISTS merchants_tags_idx
ON merchants USING GIN (tags);

-- Step 6: Add search analytics table for tracking popular searches
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT NOT NULL,
  results_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  selected_merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL
);

-- Step 7: Create index on search analytics
CREATE INDEX IF NOT EXISTS search_analytics_query_idx
ON search_analytics (search_query);

CREATE INDEX IF NOT EXISTS search_analytics_created_at_idx
ON search_analytics (created_at DESC);

-- Step 8: Add function to get popular searches
CREATE OR REPLACE FUNCTION get_popular_searches(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  query TEXT,
  search_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    search_query,
    COUNT(*) as search_count
  FROM search_analytics
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY search_query
  ORDER BY search_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Add RLS policies for search analytics
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert search analytics
CREATE POLICY "Anyone can log searches"
ON search_analytics FOR INSERT
WITH CHECK (true);

-- Only allow users to view their own searches
CREATE POLICY "Users can view own searches"
ON search_analytics FOR SELECT
USING (user_id = auth.uid() OR user_id IS NULL);

-- Step 10: Add comment
COMMENT ON TABLE search_analytics IS 'Tracks search queries for analytics and improving search relevance';
COMMENT ON COLUMN merchants.search_vector IS 'Generated tsvector for full-text search with weighted ranking';
COMMENT ON COLUMN merchants.tags IS 'Service type tags like Nails, Spa, Hair, Massage for filtering';

-- Create blog_posts table for SEO blog content
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Content fields
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,

    -- Author (admin who created the post)
    author_id UUID REFERENCES public.admins(user_id) ON DELETE SET NULL,

    -- Publishing
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,

    -- SEO metadata
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],

    -- Categorization and analytics
    tags TEXT[],
    view_count INTEGER DEFAULT 0,

    -- Search optimization
    search_vector tsvector
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read published blog posts (for public website)
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (published = true);

-- Admins can do everything (we'll use service role key in admin pages)
-- No need for recursive policies since we use service role key

-- Indexes for performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_tags ON public.blog_posts USING gin(tags);
CREATE INDEX idx_blog_posts_search ON public.blog_posts USING gin(search_vector);

-- Function to update search_vector
CREATE OR REPLACE FUNCTION public.blog_posts_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update search_vector
CREATE TRIGGER blog_posts_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.blog_posts_search_vector_update();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER blog_posts_updated_at_trigger
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_blog_posts_updated_at();

-- Final: Re-enable RLS now that we're using service role key in server code

-- Re-enable RLS on merchants
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Note: The application now uses the service role key for server-side queries,
-- so RLS is bypassed where needed. RLS is still enforced for client-side queries
-- using the anon key, providing security for public-facing pages.

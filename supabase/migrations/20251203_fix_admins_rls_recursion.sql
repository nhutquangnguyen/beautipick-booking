-- Fix infinite recursion in admins table policies
-- Drop the recursive policies that check if user is admin by querying admins table

-- Drop the recursive admin policies
DROP POLICY IF EXISTS "Admins can view all admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can create admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON public.admins;

-- Keep only the simple policy that allows users to check their own admin status
-- This policy is already created: "Users can view own admin status"
-- It uses: auth.uid() = user_id (no recursion)

-- Note: For admin operations (viewing all admins, creating/deleting admins),
-- we use the service role key in server-side code, which bypasses RLS entirely.

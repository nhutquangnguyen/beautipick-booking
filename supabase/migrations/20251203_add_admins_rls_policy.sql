-- Add RLS policy for admins table
-- Allow authenticated users to check if they are admins

-- Policy: Users can check if they themselves are admins
CREATE POLICY "Users can view own admin status"
ON public.admins
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

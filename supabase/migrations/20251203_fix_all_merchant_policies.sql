-- Comprehensive fix for all merchant RLS policies

-- Drop ALL policies on merchants table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'merchants' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.merchants', r.policyname);
    END LOOP;
END $$;

-- Recreate all necessary policies

-- 1. SELECT policy - users can view their own merchant, admins can view all
CREATE POLICY "merchants_select_policy"
    ON public.merchants
    FOR SELECT
    USING (
        id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- 2. INSERT policy - users can insert their own merchant record
CREATE POLICY "merchants_insert_policy"
    ON public.merchants
    FOR INSERT
    WITH CHECK (id = auth.uid());

-- 3. UPDATE policy - users can update their own merchant, admins can update all
CREATE POLICY "merchants_update_policy"
    ON public.merchants
    FOR UPDATE
    USING (
        id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    )
    WITH CHECK (
        id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- 4. DELETE policy - only admins can delete merchants
CREATE POLICY "merchants_delete_policy"
    ON public.merchants
    FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid())
    );

-- Verify RLS is enabled
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

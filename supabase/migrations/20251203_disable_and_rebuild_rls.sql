-- Emergency fix: Disable RLS temporarily and rebuild properly

-- Step 1: Disable RLS on merchants table
ALTER TABLE public.merchants DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'merchants' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.merchants', r.policyname);
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Step 4: Create simple, working policies

-- Allow users to SELECT their own merchant data
CREATE POLICY "merchant_select_own"
    ON public.merchants
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Allow admins to SELECT all merchants
CREATE POLICY "admin_select_all_merchants"
    ON public.merchants
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Allow users to INSERT their own merchant record
CREATE POLICY "merchant_insert_own"
    ON public.merchants
    FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- Allow users to UPDATE their own merchant data
CREATE POLICY "merchant_update_own"
    ON public.merchants
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Allow admins to UPDATE any merchant
CREATE POLICY "admin_update_all_merchants"
    ON public.merchants
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Allow users to DELETE their own merchant
CREATE POLICY "merchant_delete_own"
    ON public.merchants
    FOR DELETE
    TO authenticated
    USING (id = auth.uid());

-- Allow admins to DELETE any merchant
CREATE POLICY "admin_delete_all_merchants"
    ON public.merchants
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admins
            WHERE user_id = auth.uid()
        )
    );

-- Verify: Check current policies
SELECT schemaname, tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'merchants'
ORDER BY policyname;

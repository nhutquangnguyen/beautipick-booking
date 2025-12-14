-- Quick fix script for customer_accounts issues
-- Run this in Supabase SQL Editor

-- 1. Check if table exists
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'customer_accounts'
    ) THEN
        RAISE NOTICE 'customer_accounts table EXISTS';
    ELSE
        RAISE NOTICE 'customer_accounts table DOES NOT EXIST - Creating it now...';

        -- Create the table if it doesn't exist
        CREATE TABLE customer_accounts (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            email TEXT UNIQUE,
            name TEXT,
            phone TEXT,
            avatar_url TEXT,
            first_merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
            preferences JSONB DEFAULT '{}'::jsonb,
            is_active BOOLEAN DEFAULT true
        );

        -- Enable RLS
        ALTER TABLE customer_accounts ENABLE ROW LEVEL SECURITY;

        -- Add policies
        CREATE POLICY "Customers can view their own account"
            ON customer_accounts FOR SELECT
            USING (auth.uid() = id);

        CREATE POLICY "Customers can update their own account"
            ON customer_accounts FOR UPDATE
            USING (auth.uid() = id);

        CREATE POLICY "Anyone can create customer account"
            ON customer_accounts FOR INSERT
            WITH CHECK (true);

        -- Grant permissions
        GRANT SELECT ON customer_accounts TO authenticated, anon;
        GRANT INSERT ON customer_accounts TO authenticated, anon;
        GRANT UPDATE ON customer_accounts TO authenticated;

        RAISE NOTICE 'customer_accounts table created successfully!';
    END IF;
END $$;

-- 2. Check if user_types table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_types'
    ) THEN
        CREATE TABLE user_types (
            user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            user_type TEXT NOT NULL CHECK (user_type IN ('merchant', 'customer', 'admin')),
            created_at TIMESTAMPTZ DEFAULT NOW()
        );

        ALTER TABLE user_types ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Anyone can view user types"
            ON user_types FOR SELECT
            USING (true);

        CREATE POLICY "Can insert user type during signup"
            ON user_types FOR INSERT
            WITH CHECK (true);

        GRANT SELECT ON user_types TO authenticated, anon;
        GRANT INSERT ON user_types TO authenticated, anon;

        RAISE NOTICE 'user_types table created successfully!';
    ELSE
        RAISE NOTICE 'user_types table already exists';
    END IF;
END $$;

-- 3. Test query (should return your customer account if it exists)
-- SELECT * FROM customer_accounts WHERE id = auth.uid();

-- 4. If you need to manually create a customer account for testing:
-- INSERT INTO customer_accounts (id, email, name, phone)
-- VALUES (
--     'YOUR-USER-ID-HERE',
--     'test@example.com',
--     'Test User',
--     '1234567890'
-- );

-- 5. Check current customer accounts
SELECT COUNT(*) as total_customer_accounts FROM customer_accounts;

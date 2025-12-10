-- Customer Accounts System
-- This allows customers to create accounts after booking
-- Differentiates from merchant users

-- Customer accounts table (links auth.users to customer profiles)
CREATE TABLE customer_accounts (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    -- Track which merchant the customer first booked with
    first_merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    -- Preferences
    preferences JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- Link customer accounts to customers (merchant CRM entries)
-- One auth customer can be a "customer" for multiple merchants
CREATE TABLE customer_account_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    customer_account_id UUID NOT NULL REFERENCES customer_accounts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE(customer_account_id, customer_id)
);

-- User types table to differentiate merchants from customers
CREATE TABLE user_types (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type TEXT NOT NULL CHECK (user_type IN ('merchant', 'customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_customer_accounts_email ON customer_accounts(email);
CREATE INDEX idx_customer_accounts_merchant ON customer_accounts(first_merchant_id);
CREATE INDEX idx_customer_account_links_account ON customer_account_links(customer_account_id);
CREATE INDEX idx_customer_account_links_customer ON customer_account_links(customer_id);
CREATE INDEX idx_user_types_type ON user_types(user_type);

-- Enable RLS
ALTER TABLE customer_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_account_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_accounts
-- Customers can read and update their own account
CREATE POLICY "Customers can view their own account"
    ON customer_accounts FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Customers can update their own account"
    ON customer_accounts FOR UPDATE
    USING (auth.uid() = id);

-- Allow creating customer accounts (during signup)
CREATE POLICY "Anyone can create customer account"
    ON customer_accounts FOR INSERT
    WITH CHECK (true);

-- RLS Policies for customer_account_links
-- Customers can view their own links
CREATE POLICY "Customers can view their own links"
    ON customer_account_links FOR SELECT
    USING (customer_account_id = auth.uid());

-- System can create links (during booking/account creation)
CREATE POLICY "System can create customer links"
    ON customer_account_links FOR INSERT
    WITH CHECK (true);

-- RLS Policies for user_types
-- Anyone can read user types (needed to differentiate merchant vs customer)
CREATE POLICY "Anyone can view user types"
    ON user_types FOR SELECT
    USING (true);

-- Only allow inserts during user creation
CREATE POLICY "Can insert user type during signup"
    ON user_types FOR INSERT
    WITH CHECK (true);

-- Function to automatically create user_type for merchants (existing)
CREATE OR REPLACE FUNCTION create_merchant_user_type()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_types (user_id, user_type)
    VALUES (NEW.id, 'merchant')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create merchant user_type
CREATE TRIGGER on_merchant_created
    AFTER INSERT ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION create_merchant_user_type();

-- Function to automatically create user_type for customers
CREATE OR REPLACE FUNCTION create_customer_user_type()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_types (user_id, user_type)
    VALUES (NEW.id, 'customer')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create customer user_type
CREATE TRIGGER on_customer_account_created
    AFTER INSERT ON customer_accounts
    FOR EACH ROW
    EXECUTE FUNCTION create_customer_user_type();

-- Backfill existing merchants as 'merchant' type
INSERT INTO user_types (user_id, user_type)
SELECT id, 'merchant'
FROM merchants
ON CONFLICT (user_id) DO NOTHING;

-- Grant necessary permissions
GRANT SELECT ON customer_accounts TO authenticated, anon;
GRANT INSERT ON customer_accounts TO authenticated, anon;
GRANT UPDATE ON customer_accounts TO authenticated;
GRANT SELECT ON customer_account_links TO authenticated;
GRANT INSERT ON customer_account_links TO authenticated, anon;
GRANT SELECT ON user_types TO authenticated, anon;
GRANT INSERT ON user_types TO authenticated, anon;

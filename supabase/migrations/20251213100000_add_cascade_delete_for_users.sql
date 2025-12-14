-- Add ON DELETE CASCADE to all user-related foreign keys
-- This ensures that when a user is deleted from auth.users, all their data is automatically removed

-- ============================================================================
-- MERCHANTS TABLE
-- ============================================================================
-- Drop existing constraint and recreate with CASCADE
ALTER TABLE merchants
DROP CONSTRAINT IF EXISTS merchants_id_fkey;

ALTER TABLE merchants
ADD CONSTRAINT merchants_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- ============================================================================
-- CUSTOMER_ACCOUNTS TABLE
-- ============================================================================
ALTER TABLE customer_accounts
DROP CONSTRAINT IF EXISTS customer_accounts_id_fkey;

ALTER TABLE customer_accounts
ADD CONSTRAINT customer_accounts_id_fkey
FOREIGN KEY (id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- ============================================================================
-- USER_TYPES TABLE
-- ============================================================================
ALTER TABLE user_types
DROP CONSTRAINT IF EXISTS user_types_user_id_fkey;

ALTER TABLE user_types
ADD CONSTRAINT user_types_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
-- Customer ID should be set to NULL when customer account is deleted (preserve booking history)
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

ALTER TABLE bookings
ADD CONSTRAINT bookings_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES auth.users(id)
ON DELETE SET NULL;

-- Merchant ID should CASCADE (if merchant is deleted, their bookings should be deleted)
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_merchant_id_fkey;

ALTER TABLE bookings
ADD CONSTRAINT bookings_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- CUSTOMERS TABLE (if it references users)
-- ============================================================================
-- Customer should CASCADE when deleted
ALTER TABLE customers
DROP CONSTRAINT IF EXISTS customers_customer_id_fkey;

ALTER TABLE customers
ADD CONSTRAINT customers_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Merchant reference should CASCADE
ALTER TABLE customers
DROP CONSTRAINT IF EXISTS customers_merchant_id_fkey;

ALTER TABLE customers
ADD CONSTRAINT customers_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- SERVICES TABLE
-- ============================================================================
ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_merchant_id_fkey;

ALTER TABLE services
ADD CONSTRAINT services_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
ALTER TABLE products
DROP CONSTRAINT IF EXISTS products_merchant_id_fkey;

ALTER TABLE products
ADD CONSTRAINT products_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- STAFF TABLE
-- ============================================================================
ALTER TABLE staff
DROP CONSTRAINT IF EXISTS staff_merchant_id_fkey;

ALTER TABLE staff
ADD CONSTRAINT staff_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- AVAILABILITY TABLE
-- ============================================================================
ALTER TABLE availability
DROP CONSTRAINT IF EXISTS availability_merchant_id_fkey;

ALTER TABLE availability
ADD CONSTRAINT availability_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- MERCHANT_SUBSCRIPTIONS TABLE
-- ============================================================================
ALTER TABLE merchant_subscriptions
DROP CONSTRAINT IF EXISTS merchant_subscriptions_merchant_id_fkey;

ALTER TABLE merchant_subscriptions
ADD CONSTRAINT merchant_subscriptions_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- SUBSCRIPTION_USAGE TABLE
-- ============================================================================
ALTER TABLE subscription_usage
DROP CONSTRAINT IF EXISTS subscription_usage_merchant_id_fkey;

ALTER TABLE subscription_usage
ADD CONSTRAINT subscription_usage_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- GALLERY_IMAGES TABLE
-- ============================================================================
ALTER TABLE gallery_images
DROP CONSTRAINT IF EXISTS gallery_images_merchant_id_fkey;

ALTER TABLE gallery_images
ADD CONSTRAINT gallery_images_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- FAVORITES TABLE
-- ============================================================================
-- When customer is deleted, remove their favorites
ALTER TABLE favorites
DROP CONSTRAINT IF EXISTS favorites_customer_id_fkey;

ALTER TABLE favorites
ADD CONSTRAINT favorites_customer_id_fkey
FOREIGN KEY (customer_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- When merchant is deleted, remove favorites pointing to them
ALTER TABLE favorites
DROP CONSTRAINT IF EXISTS favorites_merchant_id_fkey;

ALTER TABLE favorites
ADD CONSTRAINT favorites_merchant_id_fkey
FOREIGN KEY (merchant_id) REFERENCES merchants(id)
ON DELETE CASCADE;

-- ============================================================================
-- ADMINS TABLE (if exists)
-- ============================================================================
ALTER TABLE admins
DROP CONSTRAINT IF EXISTS admins_user_id_fkey;

ALTER TABLE admins
ADD CONSTRAINT admins_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id)
ON DELETE CASCADE;

-- ============================================================================
-- Add comments to document the cascade behavior
-- ============================================================================
COMMENT ON CONSTRAINT merchants_id_fkey ON merchants IS
'CASCADE: When user is deleted, merchant account is deleted';

COMMENT ON CONSTRAINT customer_accounts_id_fkey ON customer_accounts IS
'CASCADE: When user is deleted, customer account is deleted';

COMMENT ON CONSTRAINT bookings_customer_id_fkey ON bookings IS
'SET NULL: When customer is deleted, their bookings are preserved but customer_id is set to NULL';

COMMENT ON CONSTRAINT bookings_merchant_id_fkey ON bookings IS
'CASCADE: When merchant is deleted, all their bookings are deleted';

COMMENT ON CONSTRAINT favorites_customer_id_fkey ON favorites IS
'CASCADE: When customer is deleted, their favorites are deleted';

COMMENT ON CONSTRAINT favorites_merchant_id_fkey ON favorites IS
'CASCADE: When merchant is deleted, favorites pointing to them are deleted';

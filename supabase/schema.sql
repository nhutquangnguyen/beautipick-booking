-- BeautiPick Booking Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Merchants table (linked to auth.users)
CREATE TABLE merchants (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL,
    business_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    cover_image_url TEXT,
    description TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'US',
    timezone TEXT DEFAULT 'America/New_York',
    currency TEXT DEFAULT 'USD',
    google_maps_url TEXT,
    youtube_url TEXT,
    social_links JSONB DEFAULT '[]'::jsonb,
    theme JSONB DEFAULT '{"primaryColor":"#8B5CF6","secondaryColor":"#EC4899","accentColor":"#F59E0B","backgroundColor":"#FFFFFF","textColor":"#1F2937","fontFamily":"Inter","borderRadius":"md","buttonStyle":"solid"}'::jsonb,
    settings JSONB DEFAULT '{"bookingLeadTime":2,"bookingWindow":30,"cancellationPolicy":"Free cancellation up to 24 hours before your appointment.","confirmationEmailEnabled":true,"reminderEmailEnabled":true,"reminderHoursBefore":24,"showStaffSelection":true,"requirePhoneNumber":false,"allowNotes":true}'::jsonb,
    is_active BOOLEAN DEFAULT true
);

-- Migration: Add google_maps_url column if it doesn't exist
-- Run this if you already have the merchants table
-- ALTER TABLE merchants ADD COLUMN IF NOT EXISTS google_maps_url TEXT;

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

-- Staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Staff services junction table
CREATE TABLE staff_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    UNIQUE(staff_id, service_id)
);

-- Availability table
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    total_price DECIMAL(10,2) NOT NULL
);

-- Gallery table
CREATE TABLE gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better query performance
CREATE INDEX idx_merchants_slug ON merchants(slug);
CREATE INDEX idx_services_merchant ON services(merchant_id);
CREATE INDEX idx_staff_merchant ON staff(merchant_id);
CREATE INDEX idx_availability_merchant ON availability(merchant_id);
CREATE INDEX idx_bookings_merchant ON bookings(merchant_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_gallery_merchant ON gallery(merchant_id);
CREATE INDEX idx_products_merchant ON products(merchant_id);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Merchants policies
CREATE POLICY "Users can view their own merchant profile"
    ON merchants FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own merchant profile"
    ON merchants FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own merchant profile"
    ON merchants FOR INSERT
    WITH CHECK (true);  -- Allow inserts, the app validates the id matches auth.uid()

CREATE POLICY "Public can view active merchants by slug"
    ON merchants FOR SELECT
    USING (is_active = true);

-- Services policies
CREATE POLICY "Merchants can manage their services"
    ON services FOR ALL
    USING (auth.uid() = merchant_id);

CREATE POLICY "Public can view active services"
    ON services FOR SELECT
    USING (is_active = true);

-- Staff policies
CREATE POLICY "Merchants can manage their staff"
    ON staff FOR ALL
    USING (auth.uid() = merchant_id);

CREATE POLICY "Public can view active staff"
    ON staff FOR SELECT
    USING (is_active = true);

-- Staff services policies
CREATE POLICY "Merchants can manage staff services"
    ON staff_services FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM staff
            WHERE staff.id = staff_services.staff_id
            AND staff.merchant_id = auth.uid()
        )
    );

CREATE POLICY "Public can view staff services"
    ON staff_services FOR SELECT
    USING (true);

-- Availability policies
CREATE POLICY "Merchants can manage their availability"
    ON availability FOR ALL
    USING (auth.uid() = merchant_id);

CREATE POLICY "Public can view availability"
    ON availability FOR SELECT
    USING (true);

-- Bookings policies
CREATE POLICY "Merchants can view their bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = merchant_id);

CREATE POLICY "Merchants can update their bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = merchant_id);

CREATE POLICY "Anyone can create a booking"
    ON bookings FOR INSERT
    WITH CHECK (true);

-- Gallery policies
CREATE POLICY "Merchants can manage their gallery"
    ON gallery FOR ALL
    USING (auth.uid() = merchant_id);

CREATE POLICY "Public can view gallery"
    ON gallery FOR SELECT
    USING (true);

-- Products policies
CREATE POLICY "Merchants can manage their products"
    ON products FOR ALL
    USING (auth.uid() = merchant_id);

CREATE POLICY "Public can view active products"
    ON products FOR SELECT
    USING (is_active = true);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_merchants_updated_at
    BEFORE UPDATE ON merchants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Migration: Add cart_items column and make some booking fields nullable for product-only orders
-- Run this if you already have the bookings table:
-- ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cart_items JSONB;
-- ALTER TABLE bookings ALTER COLUMN service_id DROP NOT NULL;
-- ALTER TABLE bookings ALTER COLUMN booking_date DROP NOT NULL;
-- ALTER TABLE bookings ALTER COLUMN start_time DROP NOT NULL;
-- ALTER TABLE bookings ALTER COLUMN end_time DROP NOT NULL;

-- =============================================
-- STORAGE BUCKET SETUP
-- =============================================
-- Run this in the Supabase Dashboard SQL Editor

-- Create the images bucket (public access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'images');

-- Allow public access to view images
CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'images');

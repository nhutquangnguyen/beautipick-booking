/**
 * Apply RLS policy to allow customers to view their bookings
 * Run with: npx tsx apply-rls-policy.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSPolicy() {
  console.log('🔧 Applying RLS policy for customers to view bookings...\n');

  const sql = `
-- Allow customers to view their own bookings
CREATE POLICY IF NOT EXISTS "Customers can view own bookings"
    ON public.bookings
    FOR SELECT
    TO authenticated
    USING (customer_id = auth.uid());

-- Grant SELECT permission to authenticated users (customers)
GRANT SELECT ON public.bookings TO authenticated;
`;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ Error applying RLS policy:', error);
      console.log('\n⚠️  You need to run this SQL manually in Supabase SQL Editor:');
      console.log(sql);
      return;
    }

    console.log('✅ RLS policy applied successfully!');
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    console.log('\n⚠️  Please run this SQL manually in Supabase SQL Editor:');
    console.log(sql);
  }
}

applyRLSPolicy();

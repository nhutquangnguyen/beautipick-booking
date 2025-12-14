/**
 * Test script to verify database tables exist
 * Run with: npx tsx test-db-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  console.log('🔍 Checking database tables...\n');

  // Check customer_accounts table
  console.log('1. Checking customer_accounts table...');
  const { data: customerAccounts, error: customerError } = await supabase
    .from('customer_accounts')
    .select('id, email, name')
    .limit(5);

  if (customerError) {
    console.error('❌ customer_accounts table error:', customerError.message);
    console.log('   → Table might not exist. Run fix_customer_accounts.sql in Supabase SQL Editor\n');
  } else {
    console.log(`✅ customer_accounts table exists (${customerAccounts.length} accounts found)`);
    if (customerAccounts.length > 0) {
      console.log('   Sample accounts:', customerAccounts);
    }
    console.log();
  }

  // Check user_types table
  console.log('2. Checking user_types table...');
  const { data: userTypes, error: userTypesError } = await supabase
    .from('user_types')
    .select('user_id, user_type')
    .limit(5);

  if (userTypesError) {
    console.error('❌ user_types table error:', userTypesError.message);
    console.log('   → Table might not exist. Run fix_customer_accounts.sql in Supabase SQL Editor\n');
  } else {
    console.log(`✅ user_types table exists (${userTypes.length} entries found)`);
    if (userTypes.length > 0) {
      console.log('   Sample types:', userTypes);
    }
    console.log();
  }

  // Check merchants table
  console.log('3. Checking merchants table...');
  const { data: merchants, error: merchantsError } = await supabase
    .from('merchants')
    .select('id, email, business_name')
    .limit(5);

  if (merchantsError) {
    console.error('❌ merchants table error:', merchantsError.message);
  } else {
    console.log(`✅ merchants table exists (${merchants.length} merchants found)`);
    console.log();
  }

  // Check auth.users
  console.log('4. Checking auth.users...');
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 10,
  });

  if (usersError) {
    console.error('❌ Error fetching users:', usersError.message);
  } else {
    console.log(`✅ Found ${users.length} auth users`);

    // Cross-check: find users without customer_accounts
    if (users.length > 0 && !customerError) {
      console.log('\n5. Cross-checking users with customer_accounts...');
      for (const user of users) {
        const { data: customerAccount } = await supabase
          .from('customer_accounts')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        const { data: merchantAccount } = await supabase
          .from('merchants')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        const accountType = customerAccount ? '✅ customer' : merchantAccount ? '✅ merchant' : '❌ NO ACCOUNT';
        console.log(`   ${user.email}: ${accountType}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log('- If you see ❌ errors for customer_accounts or user_types,');
  console.log('  run the fix_customer_accounts.sql script in Supabase SQL Editor');
  console.log('- If you see users with "NO ACCOUNT", they need to sign up again');
  console.log('  or have their account created manually');
  console.log('='.repeat(60));
}

checkDatabase().catch(console.error);

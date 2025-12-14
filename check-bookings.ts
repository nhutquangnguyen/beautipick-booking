/**
 * Check bookings for a specific customer
 * Run with: npx tsx check-bookings.ts <email>
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const customerEmail = process.argv[2] || 'camuccon2k3@gmail.com';

async function checkBookings() {
  console.log(`🔍 Checking bookings for: ${customerEmail}\n`);

  // Get customer account
  const { data: customerAccount, error: customerError } = await supabase
    .from('customer_accounts')
    .select('*')
    .eq('email', customerEmail)
    .maybeSingle();

  if (customerError) {
    console.error('❌ Error fetching customer account:', customerError);
    return;
  }

  if (!customerAccount) {
    console.error('❌ No customer account found for:', customerEmail);
    return;
  }

  console.log('✅ Customer account found:');
  console.log('   ID:', customerAccount.id);
  console.log('   Name:', customerAccount.name);
  console.log('   Email:', customerAccount.email);
  console.log('   Phone:', customerAccount.phone);
  console.log();

  // Get ALL bookings for this customer (by customer_id OR by email/phone)
  console.log('📋 Searching for bookings by:');
  console.log('   - customer_id =', customerAccount.id);
  console.log('   - customer_email =', customerAccount.email);
  console.log('   - customer_phone =', customerAccount.phone);
  console.log();

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      start_time,
      status,
      total_price,
      created_at,
      merchants (
        business_name
      )
    `)
    .or(`customer_id.eq.${customerAccount.id},customer_email.eq.${customerAccount.email || 'null'},customer_phone.eq.${customerAccount.phone || 'null'}`)
    .order('created_at', { ascending: false });

  if (bookingsError) {
    console.error('❌ Error fetching bookings:', bookingsError);
    return;
  }

  console.log(`📊 Found ${bookings?.length || 0} booking(s):\n`);

  if (bookings && bookings.length > 0) {
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`);
      console.log('  ID:', booking.id);
      console.log('  Merchant:', (booking.merchants as any)?.business_name);
      console.log('  Customer ID:', booking.customer_id || '❌ NOT LINKED');
      console.log('  Customer Name:', booking.customer_name);
      console.log('  Customer Email:', booking.customer_email);
      console.log('  Customer Phone:', booking.customer_phone);
      console.log('  Booking Date:', booking.booking_date || 'N/A');
      console.log('  Start Time:', booking.start_time || 'N/A');
      console.log('  Status:', booking.status);
      console.log('  Total:', booking.total_price);
      console.log('  Created:', new Date(booking.created_at).toLocaleString());
      console.log();
    });
  } else {
    console.log('⚠️  No bookings found!');
    console.log();
    console.log('Possible reasons:');
    console.log('1. Booking was not created successfully');
    console.log('2. Booking was created with different email/phone');
    console.log('3. RLS policies are blocking the query');
    console.log();
    console.log('Let me check recent bookings (last 24 hours)...\n');

    // Check recent bookings (last 24 hours) regardless of customer
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        booking_date,
        created_at,
        merchants (
          business_name
        )
      `)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentBookings && recentBookings.length > 0) {
      console.log(`📋 Recent bookings (last 24 hours):\n`);
      recentBookings.forEach((booking, index) => {
        console.log(`${index + 1}. ${(booking.merchants as any)?.business_name || 'Unknown'}`);
        console.log('   Customer:', booking.customer_name, booking.customer_email, booking.customer_phone);
        console.log('   Customer ID:', booking.customer_id || 'NOT LINKED');
        console.log('   Created:', new Date(booking.created_at).toLocaleString());
        console.log();
      });
    } else {
      console.log('No recent bookings found in database.');
    }
  }

  // Check pending booking in localStorage (if running in browser context)
  console.log('💡 TIP: Check browser localStorage for "pending_booking_id"');
  console.log('   Run in browser console: localStorage.getItem("pending_booking_id")');
}

checkBookings().catch(console.error);

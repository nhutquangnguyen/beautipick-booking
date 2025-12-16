import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/business/dashboard";

  // Check for customer signup parameters (from Google OAuth redirect)
  const signupType = searchParams.get("type");
  const merchantIdParam = searchParams.get("merchant_id");
  const nameParam = searchParams.get("name");
  const phoneParam = searchParams.get("phone");
  const emailParam = searchParams.get("email");

  console.log('[Auth Callback] Received request with code:', code ? 'present' : 'missing');
  console.log('[Auth Callback] Signup type:', signupType);
  console.log('[Auth Callback] Next redirect:', next);

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${origin}/login?error=session_error`);
    }

    if (!data.user) {
      console.error('[Auth Callback] No user data after exchanging code');
      return NextResponse.redirect(`${origin}/login?error=no_user`);
    }

    console.log('[Auth Callback] User authenticated:', data.user.id, data.user.email);
    console.log('[Auth Callback] User metadata:', data.user.user_metadata);
    console.log('[Auth Callback] URL params:', { signupType, nameParam, phoneParam, emailParam, merchantIdParam });

    // Check user type from metadata or query params (for Google OAuth customer signup)
    // IMPORTANT: Prioritize URL params over Google metadata to use the name the user entered
    let userType = signupType || data.user.user_metadata?.user_type;
    let customerName = nameParam || data.user.user_metadata?.name;
    let customerPhone = phoneParam || data.user.user_metadata?.phone;
    let customerEmail = emailParam || data.user.user_metadata?.email;
    let firstMerchantId = merchantIdParam || data.user.user_metadata?.first_merchant_id;

    console.log('[Auth Callback] Resolved values:', { userType, customerName, customerPhone, customerEmail });

    // Use admin client to check existing profiles (bypasses RLS)
    const adminClient = createAdminClient();

    // Handle customer login/signup
    if (userType === "customer") {
      console.log('[Auth Callback] Customer login flow');

      // Check if customer account already exists
      const { data: existingCustomerAccount } = await adminClient
        .from("customer_accounts")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (existingCustomerAccount) {
        // Customer account exists, allow login
        console.log('[Auth Callback] Customer account found, redirecting to homepage');
        return NextResponse.redirect(`${origin}/`);
      }

      // Check if user has merchant account (to support dual accounts)
      const { data: existingMerchant } = await adminClient
        .from("merchants")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      // No customer account exists, create one
      // Allow merchants to also have customer accounts (dual accounts)
      console.log('[Auth Callback] Creating customer account' + (existingMerchant ? ' (merchant also becoming customer)' : ''));

      // Final fallback for name: use email prefix or Google's full name, or 'Customer'
      if (!customerName || customerName.trim() === '') {
        customerName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Customer';
      }
      customerEmail = customerEmail || data.user.email;

      const { error: customerError } = await (adminClient as any)
        .from("customer_accounts")
        .insert({
          id: data.user.id,
          email: customerEmail || data.user.email || '',
          name: customerName,
          phone: customerPhone,
          first_merchant_id: firstMerchantId,
          preferences: {},
        });

      if (customerError) {
        console.error('[Auth Callback] Error creating customer account:', customerError);
        return NextResponse.redirect(`${origin}/?error=customer_creation_failed`);
      }

      // Link pending booking to user if exists
      const cookieHeader = request.headers.get('cookie') || '';
      const pendingBookingMatch = cookieHeader.match(/pending_booking_id=([^;]+)/);
      if (pendingBookingMatch) {
        const pendingBookingId = pendingBookingMatch[1];
        console.log('[Auth Callback] Linking pending booking:', pendingBookingId, 'to user:', data.user.id);

        const { error: bookingUpdateError } = await (adminClient as any)
          .from("bookings")
          .update({ customer_id: data.user.id })
          .eq("id", pendingBookingId)
          .is("customer_id", null); // Only update if not already linked

        if (bookingUpdateError) {
          console.error('[Auth Callback] Error linking booking to user:', bookingUpdateError);
        } else {
          console.log('[Auth Callback] Successfully linked booking to user');
          // Note: Cookie will be cleared by browser when user navigates
          // localStorage will be cleared by the client-side code
        }
      }

      // Update user_type entry
      // If user already has merchant type, they now have both
      const { data: existingUserType } = await (adminClient as any)
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existingUserType) {
        // Create new user_type as customer
        const { error: userTypeError } = await (adminClient as any)
          .from("user_types")
          .insert({
            user_id: data.user.id,
            user_type: "customer",
          });

        if (userTypeError) {
          console.error('[Auth Callback] Error creating user type:', userTypeError);
        }
      } else {
        // User already has a type (merchant), keep it as is
        // They now have both accounts but user_type remains as merchant
        console.log('[Auth Callback] User already has type:', (existingUserType as any).user_type, ', now has both accounts');
      }

      console.log('[Auth Callback] Customer account created successfully, redirecting to homepage');
      return NextResponse.redirect(`${origin}/`);
    }

    // Handle merchant login/signup
    if (userType === "merchant") {
      console.log('[Auth Callback] Merchant login flow');

      // Check if merchant account already exists
      const { data: existingMerchant } = await adminClient
        .from("merchants")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (existingMerchant) {
        // Merchant account exists, allow login
        console.log('[Auth Callback] Merchant account found, redirecting to dashboard');
        return NextResponse.redirect(`${origin}/business/dashboard`);
      }

      // Check if user has customer account (to support dual accounts)
      const { data: existingCustomer } = await adminClient
        .from("customer_accounts")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      // No merchant account exists, create one
      // Allow customers to also have merchant accounts (dual accounts)
      console.log('[Auth Callback] Creating merchant account' + (existingCustomer ? ' (customer also becoming merchant)' : ''));
      const email = data.user.email || "";
      const businessName = data.user.user_metadata?.business_name || data.user.user_metadata?.full_name || email.split("@")[0];
      let slug = generateSlug(businessName);

      // Get locale from cookie or default to 'vi'
      const cookieHeader = request.headers.get('cookie') || '';
      const localeCookie = cookieHeader.split(';').find(c => c.trim().startsWith('locale='));
      const locale = localeCookie ? localeCookie.split('=')[1] : 'vi';

      // Set timezone and currency based on locale
      const timezone = locale === 'vi' ? 'Asia/Ho_Chi_Minh' : 'America/New_York';
      const currency = locale === 'vi' ? 'VND' : 'USD';

      // Check for slug conflicts and make it unique
      let slugAttempt = 0;
      let finalSlug = slug;
      while (slugAttempt < 10) {
        const { data: conflictCheck } = await adminClient
          .from("merchants")
          .select("slug")
          .eq("slug", finalSlug)
          .maybeSingle();

        if (!conflictCheck) break;

        slugAttempt++;
        finalSlug = `${slug}-${slugAttempt}`;
      }

      console.log('[Auth Callback] Creating merchant profile:', {
        id: data.user.id,
        email,
        businessName,
        slug: finalSlug,
        locale,
      });

      // Create merchant profile
      const simpleTheme = {
        primaryColor: "#8B5CF6",
        secondaryColor: "#EC4899",
        accentColor: "#FBBF24",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
        borderRadius: "md",
        buttonStyle: "solid",
      };

      const simpleSettings = {
        bookingLeadTime: 2,
        bookingWindow: 30,
        cancellationPolicy: "Free cancellation up to 24 hours before your appointment.",
        confirmationEmailEnabled: true,
        reminderEmailEnabled: true,
        reminderHoursBefore: 24,
        showStaffSelection: true,
        requirePhoneNumber: false,
        allowNotes: true,
      };

      const { error: insertError } = await (adminClient as any).from("merchants").insert({
        id: data.user.id,
        email,
        business_name: businessName,
        slug: finalSlug,
        theme: simpleTheme,
        settings: simpleSettings,
        timezone,
        currency,
      });

      if (insertError) {
        console.error('[Auth Callback] Error creating merchant profile:', insertError.message);
        return NextResponse.redirect(`${origin}/business/login?error=profile_creation_failed`);
      }

      // Update user_type entry
      // If user already has customer type, update to merchant (or keep as is)
      const { data: existingUserType } = await (adminClient as any)
        .from("user_types")
        .select("user_type")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!existingUserType) {
        // Create new user_type as merchant
        const { error: userTypeError } = await (adminClient as any)
          .from("user_types")
          .insert({
            user_id: data.user.id,
            user_type: "merchant",
          });

        if (userTypeError) {
          console.error('[Auth Callback] Error creating user type:', userTypeError);
        }
      } else if ((existingUserType as any).user_type === "customer") {
        // User was customer, now becoming merchant - update to merchant
        // (Merchant type has priority for primary landing page)
        const { error: updateError } = await (adminClient as any)
          .from("user_types")
          .update({ user_type: "merchant" })
          .eq("user_id", data.user.id);

        if (updateError) {
          console.error('[Auth Callback] Error updating user type:', updateError);
        } else {
          console.log('[Auth Callback] Updated user type from customer to merchant, user now has both accounts');
        }
      }

      console.log('[Auth Callback] Merchant profile created successfully, redirecting to onboarding');
      return NextResponse.redirect(`${origin}/business/dashboard/onboarding`);
    }

    // Fallback: No userType provided (legacy or direct callback)
    console.log('[Auth Callback] No userType provided, checking existing accounts');

    const { data: merchantData } = await adminClient
      .from("merchants")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    const { data: customerData } = await adminClient
      .from("customer_accounts")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    // If user has customer account, redirect to customer area
    if (customerData) {
      console.log('[Auth Callback] Customer account found, redirecting to homepage');
      return NextResponse.redirect(`${origin}/`);
    }

    // If user has merchant account, redirect to merchant area
    if (merchantData) {
      console.log('[Auth Callback] Merchant account found, redirecting to business dashboard');
      return NextResponse.redirect(`${origin}/business/dashboard`);
    }

    // No account found - this shouldn't happen with proper login flows
    console.error('[Auth Callback] No account found and no userType provided');
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/login?error=no_account_found`);
  }

  // Return the user to an error page with instructions
  console.error('[Auth Callback] No code provided in callback');
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log('[Auth Callback] Received request with code:', code ? 'present' : 'missing');
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

    // Use admin client to check merchant profile (bypasses RLS)
    const adminClient = createAdminClient();
    const { data: merchantData, error: merchantError } = await adminClient
      .from("merchants")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    console.log('[Auth Callback] Merchant check:', {
      exists: !!merchantData,
      error: merchantError?.message,
    });

    // If no merchant profile exists (new OAuth user), create one
    if (!merchantData) {
      const email = data.user.email || "";
      const businessName = data.user.user_metadata?.full_name || email.split("@")[0];
      let slug = generateSlug(businessName);

      // Get locale from cookie or default to 'en'
      const cookieHeader = request.headers.get('cookie') || '';
      const localeCookie = cookieHeader.split(';').find(c => c.trim().startsWith('NEXT_LOCALE='));
      const locale = localeCookie ? localeCookie.split('=')[1] : 'en';

      // Set timezone and currency based on locale
      const timezone = locale === 'vi' ? 'Asia/Ho_Chi_Minh' : 'America/New_York';
      const currency = locale === 'vi' ? 'VND' : 'USD';

      // Check for slug conflicts and make it unique
      let slugAttempt = 0;
      let finalSlug = slug;
      while (slugAttempt < 10) { // Max 10 attempts to avoid infinite loop
        const { data: conflictCheck } = await adminClient
          .from("merchants")
          .select("slug")
          .eq("slug", finalSlug)
          .maybeSingle();

        if (!conflictCheck) break; // Slug is available

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

      // Use admin client to create merchant profile (bypasses RLS)
      // Create simple theme and settings objects to avoid potential type mismatches
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
        console.error('[Auth Callback] Error details:', insertError);
        return NextResponse.redirect(`${origin}/login?error=profile_creation_failed&code=${insertError.code}`);
      }

      console.log('[Auth Callback] Merchant profile created successfully, redirecting to onboarding');
      // Redirect new OAuth users to onboarding
      return NextResponse.redirect(`${origin}/dashboard/onboarding`);
    }

    console.log('[Auth Callback] Existing merchant found, redirecting to:', next);
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Return the user to an error page with instructions
  console.error('[Auth Callback] No code provided in callback');
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}

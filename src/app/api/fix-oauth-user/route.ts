import { NextResponse, NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";

/**
 * This endpoint creates a merchant profile for an existing auth user
 * Usage: GET /api/fix-oauth-user?user_id=<UUID>
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({
        error: "Missing user_id parameter. Usage: /api/fix-oauth-user?user_id=<UUID>"
      }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get user from auth
    const { data: { user }, error: authError } = await adminClient.auth.admin.getUserById(userId);

    if (authError || !user) {
      return NextResponse.json({
        error: `User not found: ${authError?.message || 'Unknown error'}`
      }, { status: 404 });
    }

    // Check if merchant profile already exists
    const { data: existingMerchant } = await adminClient
      .from("merchants")
      .select("id, business_name, slug")
      .eq("id", userId)
      .maybeSingle();

    if (existingMerchant) {
      return NextResponse.json({
        success: true,
        message: "Merchant profile already exists",
        merchant: existingMerchant
      });
    }

    // Create merchant profile
    const email = user.email || "";
    const businessName = user.user_metadata?.full_name || email.split("@")[0];
    let slug = generateSlug(businessName);

    // Check for slug conflicts and make it unique
    let slugAttempt = 0;
    let finalSlug = slug;
    while (true) {
      const { data: conflictCheck } = await adminClient
        .from("merchants")
        .select("slug")
        .eq("slug", finalSlug)
        .maybeSingle();

      if (!conflictCheck) break; // Slug is available

      slugAttempt++;
      finalSlug = `${slug}-${slugAttempt}`;
    }

    console.log('[Fix OAuth User] Creating merchant profile:', {
      id: user.id,
      email,
      businessName,
      slug: finalSlug,
    });

    const { data: newMerchant, error: insertError } = await adminClient.from("merchants").insert({
      id: user.id,
      email,
      business_name: businessName,
      slug: finalSlug,
      theme: defaultTheme as any,
      settings: defaultSettings as any,
      timezone: 'America/New_York',
      currency: 'USD',
    }).select().single();

    if (insertError) {
      console.error('[Fix OAuth User] Error creating merchant profile:', insertError);
      return NextResponse.json({
        success: false,
        error: insertError.message,
        details: insertError
      }, { status: 500 });
    }

    console.log('[Fix OAuth User] Merchant profile created successfully');
    return NextResponse.json({
      success: true,
      message: "Merchant profile created successfully",
      merchant: newMerchant
    });
  } catch (error: any) {
    console.error('[Fix OAuth User] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

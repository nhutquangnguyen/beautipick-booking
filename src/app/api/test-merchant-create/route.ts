import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";

export async function GET() {
  try {
    const testUserId = "test-user-" + Date.now();
    const email = `test${Date.now()}@example.com`;
    const businessName = "Test Business";
    const slug = generateSlug(businessName + "-" + Date.now());

    console.log('[Test] Creating merchant profile:', {
      id: testUserId,
      email,
      businessName,
      slug,
    });

    const adminClient = createAdminClient();
    const { data, error: insertError } = await adminClient.from("merchants").insert({
      id: testUserId,
      email,
      business_name: businessName,
      slug,
      theme: defaultTheme,
      settings: defaultSettings,
      timezone: 'America/New_York',
      currency: 'USD',
    }).select();

    if (insertError) {
      console.error('[Test] Error creating merchant profile:', insertError.message);
      console.error('[Test] Error details:', insertError);
      return NextResponse.json({
        success: false,
        error: insertError.message,
        details: insertError
      }, { status: 500 });
    }

    console.log('[Test] Merchant profile created successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Test] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

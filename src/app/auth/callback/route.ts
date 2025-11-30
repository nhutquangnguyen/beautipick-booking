import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if merchant profile exists
      const { data: merchantData, error: merchantError } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", data.user.id)
        .single();

      // If no merchant profile exists (new OAuth user), create one
      if (merchantError || !merchantData) {
        const email = data.user.email || "";
        const businessName = data.user.user_metadata?.full_name || email.split("@")[0];
        const slug = generateSlug(businessName);

        await supabase.from("merchants").insert({
          id: data.user.id,
          email,
          business_name: businessName,
          slug,
          theme: defaultTheme,
          settings: defaultSettings,
        });

        // Redirect new OAuth users to onboarding
        return NextResponse.redirect(`${origin}/dashboard/onboarding`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}

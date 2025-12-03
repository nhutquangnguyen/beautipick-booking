import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json(
      { error: "Missing domain parameter" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Query for merchants with this custom domain
  const { data: merchants, error } = await supabase
    .from("merchants")
    .select("id, business_name, slug, custom_domain, is_active")
    .eq("custom_domain", domain);

  if (error) {
    return NextResponse.json(
      { error: "Database query failed", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    domain,
    found: merchants && merchants.length > 0,
    merchants: merchants || [],
    count: merchants?.length || 0,
  });
}

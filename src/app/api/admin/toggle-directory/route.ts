import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is admin
    const adminClient = createAdminClient();
    const { data: adminRecord } = await adminClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    // Get merchant ID and new value from request
    const { merchantId, showInDirectory } = await request.json();

    if (!merchantId || typeof showInDirectory !== "boolean") {
      return NextResponse.json(
        { error: "Missing merchantId or showInDirectory" },
        { status: 400 }
      );
    }

    // Update merchant's directory visibility
    const { data, error } = await (adminClient as any)
      .from("merchants")
      .update({ show_in_directory: showInDirectory })
      .eq("id", merchantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating directory visibility:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      merchant: data,
      message: `Directory listing ${showInDirectory ? "enabled" : "disabled"}`
    });
  } catch (error: any) {
    console.error("Error in toggle-directory API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

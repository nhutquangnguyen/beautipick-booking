import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  try {
    const { email, merchantId } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Get user by email from auth
    const { data: users } = await adminClient.auth.admin.listUsers();
    const user = users.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete merchant profile
    const { error: deleteMerchantError } = await (adminClient as any)
      .from("merchants")
      .delete()
      .eq("id", user.id);

    if (deleteMerchantError) {
      console.error("Error deleting merchant:", deleteMerchantError);
    }

    // Check if customer account exists
    const { data: existingCustomer } = await (adminClient as any)
      .from("customer_accounts")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingCustomer) {
      // Create customer account
      const { error: customerError } = await (adminClient as any)
        .from("customer_accounts")
        .insert({
          id: user.id,
          email: user.email || email,
          name: user.user_metadata?.full_name || email.split('@')[0],
          phone: null,
          first_merchant_id: merchantId || null,
          preferences: {},
        });

      if (customerError) {
        return NextResponse.json(
          { error: "Failed to create customer account", details: customerError },
          { status: 500 }
        );
      }
    }

    // Update or create user_type
    const { error: deleteUserTypeError } = await (adminClient as any)
      .from("user_types")
      .delete()
      .eq("user_id", user.id);

    const { error: userTypeError } = await (adminClient as any)
      .from("user_types")
      .insert({
        user_id: user.id,
        user_type: "customer",
      });

    if (userTypeError) {
      console.error("Error creating user type:", userTypeError);
    }

    return NextResponse.json({
      success: true,
      message: "Account converted to customer successfully",
    });
  } catch (error) {
    console.error("Error converting account:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

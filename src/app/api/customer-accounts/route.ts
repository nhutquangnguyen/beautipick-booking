import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function POST(request: Request) {
  try {
    const { userId, email, name, phone } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "User ID and email are required" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // Check if customer account already exists
    const { data: existingCustomer } = await (adminClient as any)
      .from("customer_accounts")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (existingCustomer) {
      return NextResponse.json({
        success: true,
        message: "Customer account already exists",
      });
    }

    // Create customer account
    const { error: customerError } = await (adminClient as any)
      .from("customer_accounts")
      .insert({
        id: userId,
        email: email,
        name: name || email.split('@')[0],
        phone: phone || null,
        preferences: {},
      });

    if (customerError) {
      console.error("Error creating customer account:", customerError);
      return NextResponse.json(
        { error: "Failed to create customer account", details: customerError },
        { status: 500 }
      );
    }

    // Create or update user_type
    const { error: deleteUserTypeError } = await (adminClient as any)
      .from("user_types")
      .delete()
      .eq("user_id", userId);

    if (deleteUserTypeError) {
      console.error("Error deleting old user type:", deleteUserTypeError);
    }

    const { error: userTypeError } = await (adminClient as any)
      .from("user_types")
      .insert({
        user_id: userId,
        user_type: "customer",
      });

    if (userTypeError) {
      console.error("Error creating user type:", userTypeError);
      return NextResponse.json(
        { error: "Failed to set user type", details: userTypeError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer account created successfully",
    });
  } catch (error) {
    console.error("Error creating customer account:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

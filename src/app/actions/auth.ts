'use server'

import { createAdminClient } from "@/lib/supabase/server-admin";
import { generateSlug } from "@/lib/utils";

export async function createCustomerAccount(data: {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  firstMerchantId?: string;
}) {
  try {
    const adminClient = createAdminClient();

    // Check if customer account already exists
    const { data: existingCustomer } = await adminClient
      .from("customer_accounts")
      .select("id")
      .eq("id", data.userId)
      .maybeSingle();

    if (existingCustomer) {
      return {
        success: false,
        error: "Customer account already exists"
      };
    }

    // Create customer account
    const { error: customerError } = await (adminClient as any)
      .from("customer_accounts")
      .insert({
        id: data.userId,
        email: data.email,
        name: data.name,
        phone: data.phone,
        first_merchant_id: data.firstMerchantId,
        preferences: {},
      });

    if (customerError) {
      console.error('[Create Customer Account] Error:', customerError);
      return {
        success: false,
        error: customerError.message
      };
    }

    // Check if user_type already exists
    const { data: existingUserType } = await adminClient
      .from("user_types")
      .select("user_type")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (!existingUserType) {
      // Create user_type entry for customer
      const { error: userTypeError } = await (adminClient as any)
        .from("user_types")
        .insert({
          user_id: data.userId,
          user_type: "customer",
        });

      if (userTypeError) {
        console.error('[Create Customer Account] Error creating user type:', userTypeError);
        // Don't fail the whole operation if user_type creation fails
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[Create Customer Account] Unexpected error:', error);
    return {
      success: false,
      error: "Failed to create customer account"
    };
  }
}

export async function createMerchantAccount(data: {
  userId: string;
  email: string;
  businessName: string;
  phone?: string;
  theme: any;
  settings: any;
  timezone: string;
  currency: string;
}) {
  try {
    const adminClient = createAdminClient();

    // Check if merchant account already exists
    const { data: existingMerchant } = await adminClient
      .from("merchants")
      .select("id")
      .eq("id", data.userId)
      .maybeSingle();

    if (existingMerchant) {
      return {
        success: false,
        error: "Merchant account already exists"
      };
    }

    // Generate unique slug
    let slug = generateSlug(data.businessName);
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

    // Create merchant account
    const { error: merchantError } = await (adminClient as any)
      .from("merchants")
      .insert({
        id: data.userId,
        email: data.email,
        business_name: data.businessName,
        phone: data.phone,
        slug: finalSlug,
        theme: data.theme,
        settings: data.settings,
        timezone: data.timezone,
        currency: data.currency,
      });

    if (merchantError) {
      console.error('[Create Merchant Account] Error:', merchantError);
      return {
        success: false,
        error: merchantError.message
      };
    }

    // Check if user_type already exists
    const { data: existingUserType } = await (adminClient as any)
      .from("user_types")
      .select("user_type")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (!existingUserType) {
      // Create user_type entry for merchant
      const { error: userTypeError } = await (adminClient as any)
        .from("user_types")
        .insert({
          user_id: data.userId,
          user_type: "merchant",
        });

      if (userTypeError) {
        console.error('[Create Merchant Account] Error creating user type:', userTypeError);
        // Don't fail the whole operation if user_type creation fails
      }
    } else if ((existingUserType as any).user_type === "customer") {
      // Update from customer to merchant
      const { error: updateError } = await (adminClient as any)
        .from("user_types")
        .update({ user_type: "merchant" })
        .eq("user_id", data.userId);

      if (updateError) {
        console.error('[Create Merchant Account] Error updating user type:', updateError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[Create Merchant Account] Unexpected error:', error);
    return {
      success: false,
      error: "Failed to create merchant account"
    };
  }
}

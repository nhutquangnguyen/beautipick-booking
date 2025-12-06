import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { isAdmin } from "@/lib/admin";

/**
 * POST /api/admin/fix-usage
 * Recalculate and fix usage counts for all merchants
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminCheck = await isAdmin(user.id);
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const adminClient = createAdminClient();

    // Get all merchants
    const { data: merchants, error: merchantsError } = await adminClient
      .from("merchants")
      .select("id, email, business_name, settings");

    if (merchantsError || !merchants) {
      throw new Error(`Failed to fetch merchants: ${merchantsError?.message}`);
    }

    const results: any[] = [];

    // Fix each merchant
    for (const merchant of (merchants as any[])) {
      // Count services
      const { count: servicesCount } = await adminClient
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("merchant_id", merchant.id);

      // Count products
      const { count: productsCount } = await adminClient
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("merchant_id", merchant.id);

      // Count gallery images from settings
      const gallery = (merchant.settings as any)?.gallery || [];
      const galleryCount = Array.isArray(gallery) ? gallery.length : 0;

      // Update subscription_usage
      const { error: updateError } = await (adminClient
        .from("subscription_usage")
        .upsert as any)({
          merchant_id: merchant.id,
          services_count: servicesCount || 0,
          products_count: productsCount || 0,
          gallery_images_count: galleryCount,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "merchant_id"
        });

      if (updateError) {
        console.error(`Error updating ${merchant.email}:`, updateError);
        results.push({
          email: merchant.email,
          success: false,
          error: updateError.message,
        });
      } else {
        results.push({
          email: merchant.email,
          success: true,
          counts: {
            services: servicesCount,
            products: productsCount,
            gallery: galleryCount,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed usage counts for ${results.filter(r => r.success).length} merchants`,
      results,
    });
  } catch (error) {
    console.error("Error fixing usage counts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

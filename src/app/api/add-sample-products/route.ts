import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sample products data matching onboarding flow
const SAMPLE_PRODUCTS = {
  hair: [
    { name: "Professional Shampoo", price: 28 },
    { name: "Deep Conditioning Treatment", price: 32 },
    { name: "Hair Serum", price: 38 },
    { name: "Styling Gel", price: 22 },
    { name: "Heat Protection Spray", price: 25 },
  ],
  nail: [
    { name: "Premium Nail Polish", price: 18 },
    { name: "Nail Strengthener", price: 24 },
    { name: "Cuticle Oil", price: 16 },
    { name: "Hand Cream", price: 20 },
    { name: "Nail Care Kit", price: 42 },
  ],
  spa: [
    { name: "Luxury Face Cream", price: 52 },
    { name: "Body Butter", price: 38 },
    { name: "Essential Oil Set", price: 45 },
    { name: "Exfoliating Scrub", price: 35 },
    { name: "Massage Oil", price: 40 },
  ],
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get merchant data
    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("id, currency")
      .eq("id", user.id)
      .single();

    if (merchantError || !merchant) {
      return NextResponse.json({ error: "Merchant not found" }, { status: 404 });
    }

    // Check if user already has products
    const { data: existingProducts } = await supabase
      .from("products")
      .select("id")
      .eq("merchant_id", user.id);

    if (existingProducts && existingProducts.length > 0) {
      return NextResponse.json({
        message: "Products already exist",
        count: existingProducts.length
      });
    }

    // Get category from request body or default to 'spa'
    const body = await request.json();
    const category = body.category || "spa";

    if (!["hair", "nail", "spa"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    // Get currency multiplier
    const priceMultiplier = merchant.currency === "VND" ? 25000 : 1;

    // Insert products
    const productsToInsert = SAMPLE_PRODUCTS[category as keyof typeof SAMPLE_PRODUCTS].map((product) => ({
      merchant_id: user.id,
      name: product.name,
      price: Math.round(product.price * priceMultiplier),
      is_active: true,
    }));

    const { data: insertedProducts, error: insertError } = await supabase
      .from("products")
      .insert(productsToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting products:", insertError);
      return NextResponse.json({
        error: "Failed to insert products",
        details: insertError.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Added ${insertedProducts.length} sample products`,
      products: insertedProducts,
      category
    });

  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 });
  }
}

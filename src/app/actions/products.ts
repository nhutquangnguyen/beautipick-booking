"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateProduct } from "@/lib/pricing/enforcement";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_visible?: boolean;
}) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Check if user can create product (quota check)
  const canCreate = await canCreateProduct(user.id);
  if (!canCreate) {
    return {
      error: "Product limit reached. Upgrade to Pro for unlimited products.",
      limitReached: true,
    };
  }

  // Create product
  const { error } = await supabase.from("products").insert({
    merchant_id: user.id,
    ...formData,
    price: Number(formData.price),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/business/dashboard/products");
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Delete product (trigger will auto-update usage count)
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("merchant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/business/dashboard/products");
  return { success: true };
}

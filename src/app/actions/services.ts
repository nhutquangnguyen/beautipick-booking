"use server";

import { createClient } from "@/lib/supabase/server";
import { canCreateService } from "@/lib/pricing/enforcement";
import { revalidatePath } from "next/cache";

export async function createService(formData: {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category?: string;
  image_url?: string;
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

  // Check if user can create service (quota check)
  const canCreate = await canCreateService(user.id);
  if (!canCreate) {
    return {
      error: "Service limit reached. Upgrade to Pro for unlimited services.",
      limitReached: true,
    };
  }

  // Create service
  const { error } = await supabase.from("services").insert({
    merchant_id: user.id,
    ...formData,
    price: Number(formData.price),
    duration_minutes: Number(formData.duration_minutes),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Delete service (trigger will auto-update usage count)
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId)
    .eq("merchant_id", user.id); // Ensure user owns the service

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/services");
  return { success: true };
}

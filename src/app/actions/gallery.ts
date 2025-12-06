"use server";

import { createClient } from "@/lib/supabase/server";
import { canUploadImage } from "@/lib/pricing/enforcement";
import { revalidatePath } from "next/cache";

export async function createGalleryImage(formData: {
  image_url: string;
  caption?: string;
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

  // Check if user can upload image (quota check)
  const canUpload = await canUploadImage(user.id);
  if (!canUpload) {
    return {
      error: "Gallery image limit reached. Upgrade to Pro for 500 images.",
      limitReached: true,
    };
  }

  // Create gallery image
  const { error } = await supabase.from("gallery").insert({
    merchant_id: user.id,
    ...formData,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/gallery");
  return { success: true };
}

export async function deleteGalleryImage(imageId: string) {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthorized" };
  }

  // Delete gallery image (trigger will auto-update usage count)
  const { error } = await supabase
    .from("gallery")
    .delete()
    .eq("id", imageId)
    .eq("merchant_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/gallery");
  return { success: true };
}

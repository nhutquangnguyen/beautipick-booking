import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Check if the current authenticated user is an admin
 * @param userId - The user ID to check (optional, defaults to current user)
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isAdmin(userId?: string): Promise<boolean> {
  const supabase = await createClient();

  // Get user ID if not provided
  let checkUserId = userId;
  if (!checkUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    checkUserId = user.id;
  }

  // Check if user exists in admins table
  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", checkUserId)
    .single();

  return !!data && !error;
}

/**
 * Check if user is admin (client-side version)
 * @param supabase - Supabase client instance
 * @param userId - The user ID to check (optional, defaults to current user)
 */
export async function isAdminClient(
  supabase: SupabaseClient,
  userId?: string
): Promise<boolean> {
  // Get user ID if not provided
  let checkUserId = userId;
  if (!checkUserId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    checkUserId = user.id;
  }

  // Check if user exists in admins table
  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", checkUserId)
    .single();

  return !!data && !error;
}

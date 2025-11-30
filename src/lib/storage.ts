import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const BUCKET_NAME = "images";

/**
 * Upload a file to Supabase Storage (server-side)
 */
export async function uploadToStorage(
  file: Buffer,
  path: string,
  contentType: string
): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return data.path;
}

/**
 * Get a public URL for a file in Supabase Storage
 */
export async function getPublicUrl(path: string): Promise<string> {
  const supabase = await createClient();

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get a signed URL for a private file (valid for 1 hour)
 */
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Failed to create signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFromStorage(path: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Check if a value is a storage path (not a full URL)
 */
export function isStoragePath(value: string): boolean {
  return !value.startsWith("http");
}

/**
 * Get the display URL for an image - handles both legacy URLs and storage paths
 */
export async function getImageDisplayUrl(value: string | null): Promise<string | null> {
  if (!value) return null;

  // If it's already a full URL (legacy), use it directly
  if (value.startsWith("http")) {
    return value;
  }

  // Otherwise, get the public URL from Supabase Storage
  try {
    return await getPublicUrl(value);
  } catch (error) {
    console.error("Failed to get image URL:", error);
    return null;
  }
}

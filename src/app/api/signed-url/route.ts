import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "images";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Get public URL from Supabase Storage
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}

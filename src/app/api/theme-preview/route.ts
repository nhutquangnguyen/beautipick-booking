import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

// POST /api/theme-preview - Create a temporary theme preview
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { theme } = await request.json();

    // Generate a unique hash for this preview (valid for 24 hours)
    const hash = randomBytes(16).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Store preview in database (we'll create a table for this)
    const { data, error } = await supabase
      .from("theme_previews")
      .insert({
        hash,
        merchant_id: user.id,
        theme_data: theme,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ hash, expiresAt: data.expires_at });
  } catch (error) {
    console.error("Error creating theme preview:", error);
    return NextResponse.json(
      { error: "Failed to create preview" },
      { status: 500 }
    );
  }
}

// DELETE /api/theme-preview?hash=xxx - Delete a preview
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const hash = searchParams.get("hash");

  if (!hash) {
    return NextResponse.json({ error: "Hash required" }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from("theme_previews")
      .delete()
      .eq("hash", hash)
      .eq("merchant_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting theme preview:", error);
    return NextResponse.json(
      { error: "Failed to delete preview" },
      { status: 500 }
    );
  }
}

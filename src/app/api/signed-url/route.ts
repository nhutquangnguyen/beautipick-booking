import { NextRequest, NextResponse } from "next/server";
import { getSignedImageUrl } from "@/lib/wasabi";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Generate a signed URL valid for 1 hour
    const signedUrl = await getSignedImageUrl(key, 3600);

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Signed URL error:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}

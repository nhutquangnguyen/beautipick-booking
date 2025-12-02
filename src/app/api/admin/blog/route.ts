import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { NextRequest, NextResponse } from "next/server";

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminClient = createAdminClient();
    const { data: adminRecord } = await adminClient
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (!adminRecord) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get request body
    const body = await request.json();

    // Create blog post
    const { data, error } = await adminClient
      .from("blog_posts")
      .insert({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.cover_image,
        author_id: body.author_id,
        published: body.published,
        published_at: body.published_at,
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        meta_keywords: body.meta_keywords,
        tags: body.tags,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/admin/blog:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

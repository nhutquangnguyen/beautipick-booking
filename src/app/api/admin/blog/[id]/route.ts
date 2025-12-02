import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { NextRequest, NextResponse } from "next/server";

// PUT - Update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Build update object with only provided fields
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.cover_image !== undefined) updateData.cover_image = body.cover_image;
    if (body.published !== undefined) {
      updateData.published = body.published;
      // Auto-set published_at when publishing
      if (body.published && body.published_at === undefined) {
        updateData.published_at = new Date().toISOString();
      } else if (body.published_at !== undefined) {
        updateData.published_at = body.published_at;
      }
    }
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description;
    if (body.meta_keywords !== undefined) updateData.meta_keywords = body.meta_keywords;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // Update blog post
    const { data, error } = await adminClient
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in PUT /api/admin/blog/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Delete blog post
    const { error } = await adminClient
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/blog/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

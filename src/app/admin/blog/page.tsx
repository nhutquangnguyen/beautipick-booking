import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { redirect } from "next/navigation";
import { BlogManagement } from "@/components/admin/blog-management";

export default async function AdminBlogPage() {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client to check if user is admin (bypasses RLS)
  const adminClient = createAdminClient();

  const { data: adminRecord } = await adminClient
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRecord) {
    redirect("/business/dashboard");
  }

  // Fetch all blog posts using admin client
  const { data: blogPosts } = await (adminClient as any)
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogManagement blogPosts={blogPosts || []} userId={user.id} />
    </div>
  );
}

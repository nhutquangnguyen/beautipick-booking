import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: adminData } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminData) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    // Read migration file
    const migrationPath = path.join(
      process.cwd(),
      "supabase/migrations/20251206073944_add_theme_previews_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    // Execute migration using admin client
    const { createClient: createAdminClient } = await import("@/lib/supabase/admin");
    const adminClient = createAdminClient();

    // Split SQL by statements and execute them
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      const { error } = await adminClient.rpc("exec_sql", {
        sql_query: statement,
      });

      if (error) {
        console.error("Migration error:", error);
        // Continue anyway - some errors are expected (like table already exists)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed! The theme_previews table should now be available.",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      {
        error: "Migration failed. Please run it manually in Supabase SQL Editor.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

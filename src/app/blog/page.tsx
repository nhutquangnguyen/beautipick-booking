import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Tag, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcherIcon } from "@/components/language-switcher";
import { MobileMenu } from "@/components/landing/mobile-menu";

export const metadata: Metadata = {
  title: "Blog - Beauty Tips & Insights | BeautiPick",
  description: "Discover the latest tips, trends, and insights for beauty professionals. Learn how to grow your salon or spa business with BeautiPick.",
  keywords: ["beauty blog", "salon tips", "spa management", "beauty business"],
};

export default async function BlogListPage() {
  const supabase = await createClient();
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  // Fetch all published blog posts
  const { data: blogPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      blogPosts?.flatMap((post) => post.tags || []) || []
    )
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-purple-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{t("brand")}</span>
            </Link>
            <nav className="flex items-center gap-3">
              {/* Mobile Menu (hamburger) */}
              <div className="md:hidden">
                <MobileMenu
                  loginText={t("login")}
                  getStartedText={t("getStarted")}
                  languageText={tNav("language")}
                />
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Blog</span>
                </Link>
                <div className="h-6 w-px bg-gray-200" />
                <LanguageSwitcherIcon />
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
                >
                  {t("getStarted")}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 mb-6">
              <BookOpen className="h-4 w-4" />
              Blog & Insights
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
              Beauty Business{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Tips, trends, and insights to help you grow your salon or spa business
            </p>
          </div>
        </div>
      </section>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <section className="py-6 border-b bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Topics:</span>
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-medium bg-white border border-gray-200 text-gray-700 rounded-full hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!blogPosts || blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for our latest insights!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                >
                  {post.cover_image ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-purple-600" />
                    </div>
                  )}
                  <div className="p-6">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {post.published_at && formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-purple-50/50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">{t("brand")}</span>
                <p className="text-xs text-gray-500">{t("footerTagline")}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {t("brand")}. {t("footerRights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

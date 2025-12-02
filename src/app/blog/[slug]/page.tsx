import Link from "next/link";
import { BookOpen, Clock, ArrowLeft, Tag, Eye, Sparkles, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { formatDistanceToNow } from "date-fns";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcherIcon } from "@/components/language-switcher";
import { MobileMenu } from "@/components/landing/mobile-menu";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    return {
      title: "Post Not Found | BeautiPick Blog",
    };
  }

  return {
    title: post.meta_title || `${post.title} | BeautiPick Blog`,
    description: post.meta_description || post.excerpt || post.title,
    keywords: post.meta_keywords || post.tags || [],
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: ["BeautiPick"],
      images: post.cover_image ? [post.cover_image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || "",
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  // Fetch blog post
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    notFound();
  }

  // Increment view count using admin client (bypasses RLS)
  const adminClient = createAdminClient();
  await adminClient
    .from("blog_posts")
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq("id", post.id);

  // Fetch related posts (same tags)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, published_at")
    .eq("published", true)
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(3);

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

      {/* Article */}
      <article className="pt-24">
        {/* Hero Image */}
        {post.cover_image && (
          <div className="w-full aspect-[21/9] max-h-[500px] overflow-hidden bg-gray-100">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {post.published_at && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.view_count} views
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 mb-8" />

          {/* Content */}
          <div className="prose prose-lg prose-purple max-w-none">
            <div
              className="whitespace-pre-wrap leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share this article</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Social share buttons could go here */}
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                  >
                    {relatedPost.cover_image ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={relatedPost.cover_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-purple-600" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      {relatedPost.excerpt && (
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-8 sm:p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Beauty Business?
              </h2>
              <p className="text-purple-100 text-lg mb-6">
                Join thousands of beauty professionals using Beautipick
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                Start Free Trial
                <Sparkles className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      </article>

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

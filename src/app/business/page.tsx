import Link from "next/link";
import {
  Images,
  Calendar,
  ShoppingBag,
  Palette,
  Link as LinkIcon,
  Scissors,
  Star,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  BookOpen,
  Clock,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LandingHeader } from "@/components/landing/landing-header";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  // Fetch latest published blog posts
  const supabase = await createClient();
  const { data: blogPosts } = await (supabase as any)
    .from("blog_posts")
    .select("id, title, excerpt, cover_image, published_at, slug, tags")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader
        brand={t("brand")}
        store={t("pricing")}
        login={t("login")}
        getStarted={t("getStarted")}
        language={tNav("language")}
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32 bg-gradient-to-b from-green-50 via-emerald-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Tag - Now emphasizing FREE */}
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700 mb-6 border border-green-200">
              <span className="text-lg">🎉</span>
              {t("heroTag")}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900">
              {t("heroTitle1")}
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {t("heroTitle2")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* Key Value Props - NEW */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Check className="h-5 w-5" />
                <span>{t("pricingFeatureBookings")}</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Check className="h-5 w-5" />
                <span>{t("pricingFeatureNoFees")}</span>
              </div>
              <div className="flex items-center gap-2 text-green-700 font-medium">
                <Check className="h-5 w-5" />
                <span>{t("pricingNotATrial")}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/business/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-green-500/25"
              >
                {t("startFreeTrial")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#free-features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {t("learnMore")}
              </Link>
            </div>

            {/* Trust Badge */}
            <p className="mt-8 text-sm text-gray-500">{t("trustedBy")}</p>

            {/* Mock Preview */}
            <div className="mt-12 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
              <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-purple-500/10 overflow-hidden">
                {/* Browser Bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded-md px-3 py-1.5 text-sm text-gray-500 border text-center">
                      beautipick.com/your-salon
                    </div>
                  </div>
                </div>
                {/* Mock Content */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Left - Profile */}
                    <div className="flex-shrink-0 text-center sm:text-left">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 mx-auto sm:mx-0" />
                      <h3 className="mt-4 font-bold text-gray-900">Glamour Studio</h3>
                      <p className="text-sm text-gray-500">Hair & Beauty Salon</p>
                    </div>
                    {/* Right - Content Grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-pink-200 to-purple-200" />
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-orange-200 to-pink-200" />
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-purple-200 to-blue-200" />
                      <div className="col-span-2 sm:col-span-3 rounded-xl bg-gray-100 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="h-3 w-24 bg-gray-300 rounded" />
                            <div className="h-2 w-16 bg-gray-200 rounded mt-2" />
                          </div>
                          <div className="h-8 w-20 bg-purple-500 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's FREE Section - NEW PROMINENT SECTION */}
      <section id="free-features" className="py-20 sm:py-32 bg-gradient-to-b from-green-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 mb-4">
              {t("pricingBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900">
              {t("featuresTitle")}
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              {t("featuresSubtitle")}
            </p>
          </div>

          {/* FREE Features Box */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-2 border-green-200">
                <div className="flex items-center justify-center gap-3 mb-8">
                  <span className="text-5xl font-bold text-green-600">$0</span>
                  <div className="text-left">
                    <span className="block text-2xl font-bold text-gray-900">{t("pricingFreeTrialTitle")}</span>
                    <span className="block text-green-600 font-medium">{t("pricingFreeTrialDuration")}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFreeWebsite")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureFreeServices")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureFreeProducts")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureFreeImages")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureBookings")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureNoFees")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingFeatureStarterPack")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">{t("pricingNotATrial")}</span>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/business/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg"
                  >
                    {t("startFreeTrial")}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <p className="mt-3 text-sm text-gray-500">{t("ctaNoCard")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Images className="h-6 w-6" />}
              title={t("featurePortfolio")}
              description={t("featurePortfolioDesc")}
              gradient="from-green-500 to-emerald-500"
            />
            <FeatureCard
              icon={<Scissors className="h-6 w-6" />}
              title={t("featureServices")}
              description={t("featureServicesDesc")}
              gradient="from-teal-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title={t("featureBooking")}
              description={t("featureBookingDesc")}
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<ShoppingBag className="h-6 w-6" />}
              title={t("featureProducts")}
              description={t("featureProductsDesc")}
              gradient="from-orange-500 to-amber-500"
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title={t("featureBranding")}
              description={t("featureBrandingDesc")}
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<LinkIcon className="h-6 w-6" />}
              title={t("featureOneLink")}
              description={t("featureOneLinkDesc")}
              gradient="from-violet-500 to-purple-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("howItWorksTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t("howItWorksSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <StepCard
              number="1"
              title={t("step1Title")}
              description={t("step1Desc")}
            />
            <StepCard
              number="2"
              title={t("step2Title")}
              description={t("step2Desc")}
            />
            <StepCard
              number="3"
              title={t("step3Title")}
              description={t("step3Desc")}
            />
          </div>
        </div>
      </section>

      {/* Why FREE Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700 mb-4">
              <Shield className="h-4 w-4" />
              {t("pricingWhyFreeTitle")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t("pricingTitle")}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t("pricingWhyFreeDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("testimonialsTitle")}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <TestimonialCard
              quote={t("testimonial1")}
              author={t("testimonial1Author")}
              role={t("testimonial1Role")}
            />
            <TestimonialCard
              quote={t("testimonial2")}
              author={t("testimonial2Author")}
              role={t("testimonial2Role")}
            />
            <TestimonialCard
              quote={t("testimonial3")}
              author={t("testimonial3Author")}
              role={t("testimonial3Role")}
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-20 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 mb-4">
                <BookOpen className="h-4 w-4" />
                {t("blogBadge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {t("blogTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {t("blogSubtitle")}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post: any) => (
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
                        {post.tags.slice(0, 2).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-gray-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span suppressHydrationWarning>
                        {post.published_at && formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      {t("blogReadMore")}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-full font-semibold hover:bg-purple-50 transition-colors"
              >
                {t("blogViewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-16 sm:py-24 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white mb-6">
                <span className="text-lg">🎉</span>
                100% FREE
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white">
                {t("ctaTitle")}
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-green-100 max-w-2xl mx-auto">
                {t("ctaSubtitle")}
              </p>
              <Link
                href="/business/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-green-600 hover:bg-green-50 transition-colors shadow-lg"
              >
                {t("ctaButton")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-4 text-sm text-green-200">{t("ctaNoCard")}</p>
            </div>
          </div>
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

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white shadow-lg shadow-purple-500/25">
        {number}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex gap-1 text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-5 w-5 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
        <div>
          <p className="font-semibold text-gray-900">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

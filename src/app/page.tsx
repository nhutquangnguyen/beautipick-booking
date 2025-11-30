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
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcherIcon } from "@/components/language-switcher";

export default async function Home() {
  const t = await getTranslations("landing");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-purple-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{t("brand")}</span>
            </div>
            <nav className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcherIcon />
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                {t("getStarted")}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-32 bg-gradient-to-b from-purple-50 via-pink-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700 mb-6">
              <Sparkles className="h-4 w-4" />
              {t("heroTag")}
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900">
              {t("heroTitle1")}
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {t("heroTitle2")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 leading-relaxed">
              {t("heroSubtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
              >
                {t("startFreeTrial")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#how-it-works"
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

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("featuresTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {t("featuresSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Images className="h-6 w-6" />}
              title={t("featurePortfolio")}
              description={t("featurePortfolioDesc")}
              gradient="from-pink-500 to-rose-500"
            />
            <FeatureCard
              icon={<Scissors className="h-6 w-6" />}
              title={t("featureServices")}
              description={t("featureServicesDesc")}
              gradient="from-purple-500 to-indigo-500"
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
              gradient="from-fuchsia-500 to-pink-500"
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

      {/* Comparison Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {t("comparisonTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t("comparisonSubtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Other Tools */}
              <div className="rounded-2xl border-2 border-gray-200 p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-gray-500 mb-6">
                  {t("comparisonTotal")}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">{t("comparisonWebsite")}</span>
                    <span className="font-semibold">$10-15/mo</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">{t("comparisonBooking")}</span>
                    <span className="font-semibold">$10-20/mo</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-gray-600">{t("comparisonPortfolio")}</span>
                    <span className="font-semibold">$5-10/mo</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-gray-900">{t("comparisonTotal")}</span>
                    <span className="font-bold text-2xl text-red-500">$25-45/mo</span>
                  </div>
                </div>
              </div>

              {/* BeautiPick */}
              <div className="rounded-2xl border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                  {t("comparisonBeautipick")}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t("comparisonFree")}
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{t("featurePortfolio")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{t("featureServices")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{t("featureBooking")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{t("featureProducts")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{t("featureBranding")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center mt-8 text-lg font-medium text-gray-600">
              {t("comparisonSave")}
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

      {/* Final CTA */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-8 py-16 sm:py-24 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-bold text-white">
                {t("ctaTitle")}
              </h2>
              <p className="mt-4 text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto">
                {t("ctaSubtitle")}
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-purple-600 hover:bg-purple-50 transition-colors shadow-lg"
              >
                {t("ctaButton")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-4 text-sm text-purple-200">{t("ctaNoCard")}</p>
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

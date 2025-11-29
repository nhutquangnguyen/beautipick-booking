import Link from "next/link";
import { Calendar, Clock, Palette, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
              <span className="text-xl font-bold text-gray-900">BeautiPick</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="btn btn-primary btn-md"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create Your Beauty Booking Page
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              in 5 Minutes
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            The easiest way for beauty professionals to accept online bookings.
            Customize your page, add your services, and start accepting appointments today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
            </Link>
            <Link href="#features" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything You Need to Manage Bookings
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, powerful, and designed for beauty professionals
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Quick Setup"
              description="Create your booking page in minutes. No technical skills required."
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="Customizable Design"
              description="Match your brand with custom colors, fonts, and styling options."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Smart Scheduling"
              description="Set your availability and let clients book available time slots."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Staff Management"
              description="Add team members and assign services to each stylist."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Automatic Reminders"
              description="Reduce no-shows with automated email reminders."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure & Reliable"
              description="Your data is safe with enterprise-grade security."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 text-lg text-purple-100">
              Join thousands of beauty professionals using BeautiPick
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-purple-600 hover:bg-purple-50"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600" />
              <span className="font-semibold text-gray-900">BeautiPick</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BeautiPick. All rights reserved.
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
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Sparkles, BookOpen } from "lucide-react";
import { LanguageSwitcherIcon } from "@/components/language-switcher";
import { MobileMenu } from "@/components/landing/mobile-menu";

interface LandingHeaderProps {
  brand: string;
  store: string;
  login: string;
  getStarted: string;
  language: string;
}

export function LandingHeader({
  brand,
  store,
  login,
  getStarted,
  language,
}: LandingHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm shadow-purple-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{brand}</span>
          </Link>
          <nav className="flex items-center gap-3">
            {/* Mobile Menu (hamburger) */}
            <div className="md:hidden">
              <MobileMenu
                storeText={store}
                loginText={login}
                getStartedText={getStarted}
                languageText={language}
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/store"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                {store}
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <LanguageSwitcherIcon />
              <Link
                href="/business/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
              >
                {login}
              </Link>
              <Link
                href="/business/signup"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
              >
                {getStarted}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

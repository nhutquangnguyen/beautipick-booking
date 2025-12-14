"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, Store } from "lucide-react";
import { LanguageSwitcherIcon } from "@/components/language-switcher";

interface MobileMenuProps {
  storeText: string;
  loginText: string;
  getStartedText: string;
  languageText: string;
}

export function MobileMenu({ storeText, loginText, getStartedText, languageText }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 right-0 left-0 bg-white border-t border-gray-200 shadow-xl z-50 md:hidden animate-in slide-in-from-top duration-200">
            <div className="px-6 py-6 space-y-2">
              {/* Store Link */}
              <Link
                href="/store"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
              >
                <Store className="h-5 w-5" />
                <span>{storeText}</span>
              </Link>

              {/* Blog Link */}
              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
              >
                <BookOpen className="h-5 w-5" />
                <span>Blog</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3" />

              {/* Language Switcher */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">{languageText}</span>
                <LanguageSwitcherIcon />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3" />

              {/* Login Button */}
              <Link
                href="/business/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
              >
                {loginText}
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/business/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-base font-semibold text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200 shadow-md mt-2"
              >
                {getStartedText}
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}

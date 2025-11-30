"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LanguageSwitcherIcon } from "@/components/language-switcher";

interface MobileMenuProps {
  loginText: string;
  getStartedText: string;
}

export function MobileMenu({ loginText, getStartedText }: MobileMenuProps) {
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
          <div className="fixed top-16 right-0 left-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
            <div className="px-4 py-4 space-y-3">
              {/* Language Switcher */}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">Language</span>
                <LanguageSwitcherIcon />
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Login Button */}
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {loginText}
              </Link>

              {/* Sign Up Button */}
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
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

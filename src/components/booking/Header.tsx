"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  businessName: string;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  onScrollToServices?: () => void;
}

export function Header({ businessName, logoUrl, primaryColor, accentColor, secondaryColor, backgroundColor, onScrollToServices }: HeaderProps) {
  const t = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'shadow-xl' : 'shadow-md'
      }`}
      style={{
        background: backgroundColor || '#ffffff',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 4px 20px ${primaryColor}30`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('section-hero')}
          >
            {logoUrl && (
              <div className="relative">
                <img
                  src={logoUrl}
                  alt={businessName}
                  className="h-14 w-14 object-cover rounded-full ring-2 ring-offset-2 transition-all duration-300 group-hover:ring-4"
                  style={{
                    // @ts-ignore - ringColor is not a standard CSS property but works with Tailwind
                    ringColor: accentColor,
                  }}
                />
              </div>
            )}
            <span
              className="text-2xl font-bold transition-colors duration-300"
              style={{ color: primaryColor }}
            >
              {businessName}
            </span>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {['about', 'gallery', 'services', 'products', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(`section-${item.toLowerCase()}`)}
                className="relative text-base font-semibold transition-all duration-200 group"
                style={{ color: '#333333' }}
              >
                {t(item)}
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: accentColor }}
                />
              </button>
            ))}
          </nav>

          {/* Book Now Button & Language Switcher */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher accentColor={accentColor} primaryColor={primaryColor} position="inline" />

            <button
              onClick={onScrollToServices || (() => scrollToSection('section-services'))}
              className="hidden sm:block px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-3"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor || accentColor})`,
                color: primaryColor,
                border: `3px solid ${primaryColor}`,
                boxShadow: `0 4px 14px ${accentColor}40`,
                textShadow: '0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              {t("bookNow")}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: primaryColor }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {['about', 'gallery', 'services', 'products', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(`section-${item.toLowerCase()}`)}
                  className="text-left py-2 font-medium transition-colors duration-200"
                  style={{ color: '#333333' }}
                >
                  {t(item)}
                </button>
              ))}

              {/* Mobile Language Switcher */}
              <div className="py-2">
                <LanguageSwitcher accentColor={accentColor} position="inline" />
              </div>

              <button
                onClick={onScrollToServices || (() => scrollToSection('section-services'))}
                className="mt-2 px-6 py-3 rounded-full font-bold text-sm text-center border-3"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor || accentColor})`,
                  color: primaryColor,
                  border: `3px solid ${primaryColor}`,
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                }}
              >
                {t("bookNow")}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

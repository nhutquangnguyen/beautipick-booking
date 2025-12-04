"use client";

import { LayoutProps } from "./types";
import { useEffect, useState } from "react";

/**
 * LUXURY LAYOUT - PREMIUM EDITION
 *
 * Design: Ultra-luxury with cinematic parallax, glass morphism, and metallic accents
 * Best for: Opulence, Coastal (High-end spas, Resort spas, Premium wellness)
 *
 * Premium Features:
 * - Cinematic full-screen hero with advanced parallax
 * - Split-screen content blocks
 * - Glass morphism frosted backgrounds
 * - Metallic gold/silver shimmer accents
 * - Sophisticated typography with optical sizing
 * - Smooth scroll-based animations
 * - Floating side navigation
 * - Premium shadows and depth layers
 */
export function LuxuryLayout({ children }: LayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Detect active section for navigation
      const sections = document.querySelectorAll('.luxury-layout section');
      let current = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = index;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax transform based on scroll
  const parallaxTransform = `translateY(${scrollY * 0.5}px)`;
  const parallaxOpacity = Math.max(1 - scrollY / 600, 0);

  return (
    <div className="luxury-layout min-h-screen">
      {/* Ambient background effects */}
      <div className="luxury-ambient-bg" />

      {/* Floating side navigation dots */}
      <nav className="luxury-side-nav" aria-label="Page sections">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={`luxury-nav-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => {
              const sections = document.querySelectorAll('.luxury-layout section');
              sections[index]?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label={`Section ${index + 1}`}
          />
        ))}
      </nav>

      {/* Parallax overlay for hero */}
      <div
        className="luxury-parallax-overlay"
        style={{
          transform: parallaxTransform,
          opacity: parallaxOpacity
        }}
      />

      {/* Full-screen sections with parallax */}
      <div className="relative luxury-content-wrapper">
        {children}
      </div>

      <style jsx global>{`
        .luxury-layout {
          scroll-behavior: smooth;
          background: linear-gradient(to bottom, #FAFAFA 0%, #F5F5F5 50%, #FAFAFA 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Floating side navigation */
        .luxury-side-nav {
          position: fixed;
          right: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          opacity: 0;
          animation: luxuryNavFadeIn 0.6s ease 1s forwards;
        }

        @media (max-width: 1024px) {
          .luxury-side-nav {
            display: none;
          }
        }

        @keyframes luxuryNavFadeIn {
          to {
            opacity: 1;
          }
        }

        .luxury-nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.3);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .luxury-nav-dot::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .luxury-nav-dot:hover::before,
        .luxury-nav-dot.active::before {
          opacity: 1;
        }

        .luxury-nav-dot:hover,
        .luxury-nav-dot.active {
          background: #D4AF37;
          border-color: #D4AF37;
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
          transform: scale(1.3);
        }

        /* Parallax overlay */
        .luxury-parallax-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(
            circle at 50% 30%,
            rgba(212, 175, 55, 0.1),
            transparent 60%
          );
          pointer-events: none;
          z-index: 1;
          will-change: transform, opacity;
        }

        /* Content wrapper with split layouts */
        .luxury-content-wrapper {
          position: relative;
          z-index: 2;
        }

        /* Ambient luxury background with subtle animation */
        .luxury-ambient-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.4;
          background:
            radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(192, 192, 192, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.04) 0%, transparent 70%);
          animation: luxuryAmbience 20s ease-in-out infinite alternate;
        }

        @keyframes luxuryAmbience {
          0% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          100% {
            opacity: 0.5;
            transform: scale(1.1) rotate(2deg);
          }
        }

        /* Hero section - cinematic commanding presence with adaptive height */
        .luxury-layout section:first-child {
          min-height: 60vh;
          max-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%);
          overflow: hidden;
        }

        /* Allow hero images to be responsive */
        .luxury-layout section:first-child img {
          width: 100%;
          height: auto;
          max-height: 90vh;
          object-fit: cover;
        }

        .luxury-layout section:first-child::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.15), transparent 60%);
          pointer-events: none;
          animation: luxuryGlow 8s ease-in-out infinite alternate;
          z-index: 1;
        }

        @keyframes luxuryGlow {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .luxury-layout section:first-child {
            min-height: 50vh;
            max-height: 70vh;
          }

          .luxury-layout section:first-child img {
            max-height: 70vh;
          }
        }

        /* Refined section spacing - luxurious breathing room */
        .luxury-layout section {
          padding: 6rem 3.5rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Split-screen luxury sections */
        .luxury-layout section.luxury-split {
          max-width: 100%;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 80vh;
          align-items: center;
        }

        .luxury-layout section.luxury-split > * {
          padding: 6rem 4rem;
        }

        .luxury-layout section.luxury-split .luxury-split-image {
          position: relative;
          height: 100%;
          min-height: 80vh;
          background-size: cover;
          background-position: center;
        }

        .luxury-layout section.luxury-split .luxury-split-image::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(0,0,0,0.3) 0%,
            rgba(212, 175, 55, 0.1) 100%
          );
          mix-blend-mode: multiply;
        }

        .luxury-layout section.luxury-split .luxury-split-content {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.98) 0%,
            rgba(250,250,250,0.95) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* Alternating split layout */
        .luxury-layout section.luxury-split:nth-child(even) {
          grid-template-columns: 1fr 1fr;
        }

        .luxury-layout section.luxury-split:nth-child(even) .luxury-split-content {
          order: 1;
        }

        .luxury-layout section.luxury-split:nth-child(even) .luxury-split-image {
          order: 2;
        }

        @media (max-width: 1024px) {
          .luxury-layout section.luxury-split {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .luxury-layout section.luxury-split > * {
            padding: 4rem 2rem;
          }

          .luxury-layout section.luxury-split .luxury-split-image {
            min-height: 50vh;
            order: 1 !important;
          }

          .luxury-layout section.luxury-split .luxury-split-content {
            order: 2 !important;
          }
        }

        /* Full-bleed luxury sections */
        .luxury-layout section.luxury-full-bleed {
          max-width: 100%;
          padding: 8rem 4rem;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          position: relative;
        }

        .luxury-layout section.luxury-full-bleed::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.7) 0%,
            rgba(0,0,0,0.5) 50%,
            rgba(0,0,0,0.7) 100%
          );
          z-index: 0;
        }

        .luxury-layout section.luxury-full-bleed > * {
          position: relative;
          z-index: 1;
          color: white;
        }

        /* Default luxury sections with glass container */
        .luxury-layout section.luxury-default-section {
          padding: 8rem 3.5rem;
          max-width: 1600px;
          margin: 0 auto;
          position: relative;
        }

        .luxury-layout .luxury-glass-container {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.85) 100%
          );
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 24px;
          padding: 4rem 3rem;
          box-shadow:
            0 4px 24px rgba(0,0,0,0.06),
            0 16px 56px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);
          position: relative;
          overflow: hidden;
        }

        .luxury-layout .luxury-glass-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: luxuryGlassShimmer 8s ease-in-out infinite;
        }

        @keyframes luxuryGlassShimmer {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20%, 20%) scale(1.2);
            opacity: 0.8;
          }
        }

        @media (max-width: 768px) {
          .luxury-layout section.luxury-default-section {
            padding: 4rem 1.5rem;
          }

          .luxury-layout .luxury-glass-container {
            padding: 3rem 2rem;
            border-radius: 16px;
          }
        }

        .luxury-layout section + section {
          border-top: 1px solid transparent;
          border-image: linear-gradient(
            to right,
            transparent,
            rgba(212, 175, 55, 0.2) 25%,
            rgba(212, 175, 55, 0.3) 50%,
            rgba(212, 175, 55, 0.2) 75%,
            transparent
          ) 1;
          position: relative;
        }

        .luxury-layout section + section::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.6), transparent);
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
        }

        @media (max-width: 768px) {
          .luxury-layout section {
            padding: 4rem 1.75rem;
          }
        }

        /* Luxury typography - ultra-refined editorial style with gold accents */
        .luxury-layout h1 {
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 1.05;
          font-weight: 200;
          letter-spacing: -0.02em;
          margin-bottom: 1.75rem;
          text-transform: uppercase;
          background: linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          text-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .luxury-layout h1::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.8), transparent);
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
        }

        .luxury-layout h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          line-height: 1.25;
          font-weight: 300;
          letter-spacing: 0.08em;
          margin-bottom: 2.5rem;
          text-transform: uppercase;
          color: rgba(0,0,0,0.85);
          position: relative;
          padding-bottom: 1rem;
        }

        .luxury-layout h2::first-letter {
          color: #D4AF37;
          font-size: 1.3em;
          font-weight: 400;
        }

        .luxury-layout h3 {
          font-size: clamp(1.35rem, 2.25vw, 1.85rem);
          line-height: 1.35;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
          text-transform: uppercase;
          color: rgba(0,0,0,0.8);
        }

        .luxury-layout p {
          font-size: clamp(1.0625rem, 1.6vw, 1.1875rem);
          line-height: 1.9;
          font-weight: 300;
          margin-bottom: 1.75rem;
          max-width: 68ch;
          margin-left: auto;
          margin-right: auto;
          color: rgba(0,0,0,0.7);
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
        }

        /* Center-aligned content with breathing room */
        .luxury-layout .content-container {
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }

        /* Elegant image overlays */
        .luxury-layout .image-overlay {
          position: relative;
        }

        .luxury-layout .image-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5));
          z-index: 1;
        }

        .luxury-layout .image-overlay > * {
          position: relative;
          z-index: 2;
        }

        /* Smooth fade-in animations */
        @media (prefers-reduced-motion: no-preference) {
          .luxury-layout section {
            opacity: 0;
            animation: luxuryFadeIn 0.6s ease-out forwards;
          }

          @keyframes luxuryFadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Stagger animation for sections */
          .luxury-layout section:nth-child(1) { animation-delay: 0s; }
          .luxury-layout section:nth-child(2) { animation-delay: 0.1s; }
          .luxury-layout section:nth-child(3) { animation-delay: 0.2s; }
          .luxury-layout section:nth-child(4) { animation-delay: 0.3s; }
          .luxury-layout section:nth-child(5) { animation-delay: 0.4s; }
        }

        /* Luxury buttons - premium with gold shimmer */
        .luxury-layout button,
        .luxury-layout .btn {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Gold shimmer effect on all buttons */
        .luxury-layout button::after,
        .luxury-layout .btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.5s ease, height 0.5s ease;
          pointer-events: none;
          z-index: 0;
        }

        .luxury-layout button:hover::after,
        .luxury-layout .btn:hover::after {
          width: 200px;
          height: 200px;
        }

        /* Enhance buttons with inline styles (from theme) */
        .luxury-layout button[style*="background"]:hover {
          filter: brightness(1.1) saturate(1.2);
          box-shadow:
            0 8px 24px rgba(0,0,0,0.2),
            0 0 20px rgba(212, 175, 55, 0.4) !important;
          transform: translateY(-2px) scale(1.02);
        }

        /* Product add buttons - gold ring effect */
        .luxury-layout button.rounded-full,
        .luxury-layout button[class*="rounded-full"] {
          box-shadow:
            0 2px 8px rgba(0,0,0,0.15),
            0 0 0 0 rgba(212, 175, 55, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-layout button.rounded-full:hover,
        .luxury-layout button[class*="rounded-full"]:hover {
          box-shadow:
            0 4px 16px rgba(0,0,0,0.2),
            0 0 0 4px rgba(212, 175, 55, 0.2),
            0 0 20px rgba(212, 175, 55, 0.3) !important;
          transform: translateY(-3px) scale(1.15);
        }

        /* Large buttons - text buttons with borders */
        .luxury-layout button[class*="px-"][class*="py-"]:not([class*="rounded-full"]) {
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
        }

        .luxury-layout button[class*="px-"][class*="py-"]:not([class*="rounded-full"]):hover {
          border-color: rgba(212, 175, 55, 0.6) !important;
          box-shadow:
            0 8px 24px rgba(0,0,0,0.15),
            0 0 20px rgba(212, 175, 55, 0.25) !important;
        }

        /* Small icon buttons - add subtle gold ring */
        .luxury-layout button[class*="p-1"],
        .luxury-layout button[class*="p-2"],
        .luxury-layout button[class*="p-3"] {
          position: relative;
        }

        .luxury-layout button[class*="p-1"]:hover,
        .luxury-layout button[class*="p-2"]:hover,
        .luxury-layout button[class*="p-3"]:hover {
          box-shadow:
            0 4px 12px rgba(0,0,0,0.15),
            0 0 16px rgba(212, 175, 55, 0.25) !important;
        }

        /* Ensure button content stays above shimmer */
        .luxury-layout button > * {
          position: relative;
          z-index: 1;
        }

        /* Luxury cards - glass morphism with premium depth */
        .luxury-layout .card {
          background: linear-gradient(135deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.9) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.1);
          box-shadow:
            0 2px 8px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8);
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .luxury-layout .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(212, 175, 55, 0.08),
            transparent);
          transition: left 0.6s ease;
        }

        .luxury-layout .card:hover::before {
          left: 100%;
        }

        .luxury-layout .card:hover {
          box-shadow:
            0 4px 16px rgba(0,0,0,0.06),
            0 12px 32px rgba(0,0,0,0.08),
            0 0 40px rgba(212, 175, 55, 0.15),
            inset 0 1px 0 rgba(255,255,255,0.9);
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.2);
        }

        /* Gallery - magazine-style masonry grid with premium presentation */
        .luxury-layout .gallery-grid,
        .luxury-layout [class*="grid"] {
          gap: 1.5rem;
        }

        /* Magazine-style featured image */
        .luxury-layout [class*="grid"] > *:first-child {
          grid-column: span 2;
          grid-row: span 2;
        }

        @media (max-width: 768px) {
          .luxury-layout [class*="grid"] > *:first-child {
            grid-column: span 1;
            grid-row: span 1;
          }
        }

        .luxury-layout img {
          filter: saturate(0.92) contrast(1.05) brightness(0.98);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .luxury-layout img:hover {
          filter: saturate(1.05) contrast(1.08) brightness(1.02);
          box-shadow:
            0 12px 40px rgba(0,0,0,0.15),
            0 0 30px rgba(212, 175, 55, 0.25);
          transform: scale(1.02);
        }

        /* Image overlay effect */
        .luxury-layout img[alt]::after {
          content: attr(alt);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.5rem;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.8) 0%,
            rgba(0,0,0,0.4) 50%,
            transparent 100%
          );
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        /* Service items - premium list presentation */
        .luxury-layout .service-item,
        .luxury-layout [class*="service"] {
          padding: 2.5rem 0;
          border-bottom: 1px solid transparent;
          border-image: linear-gradient(
            to right,
            transparent,
            rgba(212, 175, 55, 0.15),
            transparent
          ) 1;
          position: relative;
        }

        .luxury-layout .service-item::before,
        .luxury-layout [class*="service"]::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 0;
          background: linear-gradient(to bottom, rgba(212, 175, 55, 0.8), transparent);
          transition: height 0.4s ease;
        }

        .luxury-layout .service-item:hover::before,
        .luxury-layout [class*="service"]:hover::before {
          height: 100%;
        }

        .luxury-layout .service-item:last-child {
          border-bottom: none;
        }

        /* Elegant section titles with gold accent */
        .luxury-layout section > h2:first-child,
        .luxury-layout section > div > h2:first-child {
          position: relative;
          padding-bottom: 2rem;
          margin-bottom: 3.5rem;
        }

        .luxury-layout section > h2:first-child::after,
        .luxury-layout section > div > h2:first-child::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 2px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(212, 175, 55, 0.8),
            transparent
          );
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
        }

        .luxury-layout section > h2:first-child::before,
        .luxury-layout section > div > h2:first-child::before {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D4AF37;
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
        }

        /* Refined spacing between elements */
        .luxury-layout * + h2 {
          margin-top: 4rem;
        }

        .luxury-layout * + h3 {
          margin-top: 2.5rem;
        }

        /* Premium link styling with gold underline */
        .luxury-layout a {
          color: inherit;
          text-decoration: none;
          background-image: linear-gradient(
            to right,
            rgba(212, 175, 55, 0.4),
            rgba(212, 175, 55, 0.7),
            rgba(212, 175, 55, 0.4)
          );
          background-position: 0 100%;
          background-repeat: no-repeat;
          background-size: 100% 1px;
          transition: all 0.3s ease;
          position: relative;
        }

        .luxury-layout a:hover {
          background-size: 100% 2px;
          color: #D4AF37;
          text-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
        }

        /* Scroll reveal animation for premium experience */
        @keyframes luxuryScrollReveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Premium scrollbar */
        .luxury-layout::-webkit-scrollbar {
          width: 10px;
        }

        .luxury-layout::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
        }

        .luxury-layout::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            rgba(212, 175, 55, 0.3),
            rgba(212, 175, 55, 0.5),
            rgba(212, 175, 55, 0.3)
          );
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .luxury-layout::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            to bottom,
            rgba(212, 175, 55, 0.5),
            rgba(212, 175, 55, 0.7),
            rgba(212, 175, 55, 0.5)
          );
          background-clip: content-box;
        }
      `}</style>
    </div>
  );
}

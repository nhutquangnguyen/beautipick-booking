"use client";

import { LayoutProps } from "./types";

/**
 * LUXURY LAYOUT
 *
 * Design: Full-screen hero with parallax, elegant spacing
 * Best for: Opulence, Coastal (High-end spas, Resort spas)
 *
 * Features:
 * - Full-screen hero sections
 * - Large imagery with overlay
 * - Generous whitespace
 * - Elegant typography scaling
 * - Smooth scroll parallax effect
 * - Center-aligned content
 */
export function LuxuryLayout({ children }: LayoutProps) {
  return (
    <div className="luxury-layout min-h-screen">
      {/* Full-screen sections with parallax */}
      <div className="relative">
        {children}
      </div>

      <style jsx global>{`
        .luxury-layout {
          scroll-behavior: smooth;
        }

        /* Full-screen hero sections */
        .luxury-layout section:first-child {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Generous section spacing */
        .luxury-layout section {
          padding: 8rem 2rem;
        }

        @media (max-width: 768px) {
          .luxury-layout section {
            padding: 4rem 1.5rem;
          }
        }

        /* Large typography for luxury feel */
        .luxury-layout h1 {
          font-size: clamp(3rem, 6vw, 5rem);
          line-height: 1.1;
          font-weight: 300;
          letter-spacing: -0.02em;
        }

        .luxury-layout h2 {
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 1.2;
          font-weight: 300;
          letter-spacing: -0.01em;
          margin-bottom: 2rem;
        }

        .luxury-layout p {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          line-height: 1.8;
          font-weight: 300;
        }

        /* Center-aligned content */
        .luxury-layout .content-container {
          max-width: 1400px;
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
        .luxury-layout section {
          opacity: 0;
          animation: luxuryFadeIn 1s ease-out forwards;
        }

        @keyframes luxuryFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stagger animation for sections */
        .luxury-layout section:nth-child(1) { animation-delay: 0s; }
        .luxury-layout section:nth-child(2) { animation-delay: 0.2s; }
        .luxury-layout section:nth-child(3) { animation-delay: 0.4s; }
        .luxury-layout section:nth-child(4) { animation-delay: 0.6s; }
        .luxury-layout section:nth-child(5) { animation-delay: 0.8s; }

        /* Luxury buttons */
        .luxury-layout button,
        .luxury-layout .btn {
          font-size: 0.875rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 1rem 3rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .luxury-layout button:hover,
        .luxury-layout .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

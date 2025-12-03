"use client";

import { LayoutProps } from "./types";

/**
 * MODERN LAYOUT
 *
 * Design: Dynamic split-screen, Instagram-grid gallery, vibrant
 * Best for: Radiance, Glamour, Blossom (Hair salons, Makeup artists, Nail salons)
 *
 * Features:
 * - Split-screen hero layouts
 * - Grid-based gallery sections
 * - Card-based content
 * - Before/After showcase support
 * - Vibrant, energetic spacing
 * - Mobile-first responsive
 */
export function ModernLayout({ children }: LayoutProps) {
  return (
    <div className="modern-layout">
      <div className="modern-container">
        {children}
      </div>

      <style jsx global>{`
        .modern-layout {
          background: var(--background);
        }

        .modern-container {
          max-width: 1440px;
          margin: 0 auto;
        }

        /* Split-screen hero */
        .modern-layout section:first-child {
          min-height: 90vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        @media (max-width: 1024px) {
          .modern-layout section:first-child {
            grid-template-columns: 1fr;
            min-height: auto;
          }
        }

        /* Modern section spacing */
        .modern-layout section {
          padding: 5rem 2rem;
        }

        @media (max-width: 768px) {
          .modern-layout section {
            padding: 3rem 1.5rem;
          }
        }

        /* Typography - Bold and modern */
        .modern-layout h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }

        .modern-layout h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.2;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .modern-layout h3 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          line-height: 1.3;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .modern-layout p {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          line-height: 1.6;
        }

        /* Card-based layouts */
        .modern-layout .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        @media (max-width: 768px) {
          .modern-layout .card-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        .modern-layout .card {
          background: white;
          border-radius: var(--radius-lg, 1rem);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .modern-layout .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }

        /* Instagram-style gallery grid */
        .modern-layout .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 640px) {
          .modern-layout .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
        }

        .modern-layout .gallery-item {
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: var(--radius-md, 0.75rem);
          position: relative;
          cursor: pointer;
        }

        .modern-layout .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .modern-layout .gallery-item:hover img {
          transform: scale(1.05);
        }

        /* Split content sections */
        .modern-layout .split-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 1024px) {
          .modern-layout .split-section {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* Modern buttons */
        .modern-layout button,
        .modern-layout .btn {
          font-weight: 600;
          padding: 0.875rem 2rem;
          border-radius: var(--radius-full, 9999px);
          transition: all 0.2s ease;
          font-size: 1rem;
        }

        .modern-layout button:hover,
        .modern-layout .btn:hover {
          transform: scale(1.02);
        }

        /* Smooth scroll */
        .modern-layout {
          scroll-behavior: smooth;
        }

        /* Fade-in animation for sections */
        @media (prefers-reduced-motion: no-preference) {
          .modern-layout section {
            opacity: 0;
            animation: modernFadeIn 0.6s ease-out forwards;
          }

          @keyframes modernFadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .modern-layout section:nth-child(1) { animation-delay: 0s; }
          .modern-layout section:nth-child(2) { animation-delay: 0.1s; }
          .modern-layout section:nth-child(3) { animation-delay: 0.2s; }
          .modern-layout section:nth-child(4) { animation-delay: 0.3s; }
          .modern-layout section:nth-child(5) { animation-delay: 0.4s; }
        }

        /* Service cards specific styling */
        .modern-layout .service-card {
          padding: 2rem;
          border-left: 4px solid var(--primary, currentColor);
        }

        /* Pill badges */
        .modern-layout .badge {
          display: inline-block;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

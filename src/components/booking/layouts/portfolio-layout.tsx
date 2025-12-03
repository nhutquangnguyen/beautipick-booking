"use client";

import { LayoutProps } from "./types";

/**
 * PORTFOLIO LAYOUT
 *
 * Design: Dark full-width showcase, bold typography, edge-to-edge imagery
 * Best for: Artisan, Powerhouse (Tattoo studios, Fitness trainers, Bold brands)
 *
 * Features:
 * - Full-width, edge-to-edge sections
 * - Dark mode aesthetic
 * - Portfolio-first gallery
 * - Bold, impactful typography
 * - Sharp, angular design
 * - High contrast
 */
export function PortfolioLayout({ children }: LayoutProps) {
  return (
    <div className="portfolio-layout">
      {children}

      <style jsx global>{`
        .portfolio-layout {
          background: #0A0A0A;
          color: #F5F5F5;
          min-height: 100vh;
        }

        /* Full-width sections */
        .portfolio-layout section {
          padding: 6rem 0;
          width: 100%;
        }

        @media (max-width: 768px) {
          .portfolio-layout section {
            padding: 4rem 0;
          }
        }

        /* Content padding within sections */
        .portfolio-layout .section-content {
          padding: 0 3rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .portfolio-layout .section-content {
            padding: 0 1.5rem;
          }
        }

        /* Bold, impactful typography */
        .portfolio-layout h1 {
          font-size: clamp(3rem, 7vw, 6rem);
          line-height: 0.95;
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .portfolio-layout h2 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1;
          font-weight: 800;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .portfolio-layout h3 {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .portfolio-layout p {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          line-height: 1.6;
          font-weight: 400;
        }

        /* Full-width hero section */
        .portfolio-layout section:first-child {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* Portfolio grid - masonry style */
        .portfolio-layout .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 0;
          margin: 0;
        }

        @media (max-width: 768px) {
          .portfolio-layout .portfolio-grid {
            grid-template-columns: 1fr;
          }
        }

        .portfolio-layout .portfolio-item {
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .portfolio-layout .portfolio-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.6s ease;
          filter: grayscale(30%);
        }

        .portfolio-layout .portfolio-item:hover img {
          transform: scale(1.1);
          filter: grayscale(0%);
        }

        .portfolio-layout .portfolio-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7));
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .portfolio-layout .portfolio-item:hover::after {
          opacity: 1;
        }

        /* Sharp, angular cards */
        .portfolio-layout .card {
          background: #1A1A1A;
          border: none;
          border-radius: 0;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .portfolio-layout .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--primary, currentColor);
        }

        .portfolio-layout .card:hover {
          background: #222;
        }

        /* Bold buttons */
        .portfolio-layout button,
        .portfolio-layout .btn {
          font-weight: 700;
          padding: 1.25rem 3rem;
          border-radius: 0;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: var(--primary, white);
          color: #0A0A0A;
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .portfolio-layout button::before,
        .portfolio-layout .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.2);
          transition: left 0.4s ease;
        }

        .portfolio-layout button:hover::before,
        .portfolio-layout .btn:hover::before {
          left: 100%;
        }

        .portfolio-layout button:hover,
        .portfolio-layout .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
        }

        /* High contrast sections */
        .portfolio-layout section:nth-child(even) {
          background: #0F0F0F;
        }

        /* Accent lines */
        .portfolio-layout .accent-line {
          width: 80px;
          height: 4px;
          background: var(--primary, white);
          margin-bottom: 2rem;
        }

        /* Stats/Numbers */
        .portfolio-layout .stat-number {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 1;
          color: var(--primary, white);
        }

        .portfolio-layout .stat-label {
          font-size: 1rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.6);
          margin-top: 0.5rem;
        }

        /* Service cards - bold list */
        .portfolio-layout .service-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .portfolio-layout .service-item {
          padding: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          transition: background 0.3s ease, padding-left 0.3s ease;
        }

        .portfolio-layout .service-item:hover {
          background: rgba(255,255,255,0.03);
          padding-left: 3rem;
        }

        /* Dramatic animations */
        @media (prefers-reduced-motion: no-preference) {
          .portfolio-layout section {
            opacity: 0;
            animation: portfolioReveal 1s ease-out forwards;
          }

          @keyframes portfolioReveal {
            from {
              opacity: 0;
              transform: translateY(40px);
              clip-path: inset(0 0 100% 0);
            }
            to {
              opacity: 1;
              transform: translateY(0);
              clip-path: inset(0 0 0 0);
            }
          }

          .portfolio-layout section:nth-child(1) { animation-delay: 0s; }
          .portfolio-layout section:nth-child(2) { animation-delay: 0.2s; }
          .portfolio-layout section:nth-child(3) { animation-delay: 0.4s; }
          .portfolio-layout section:nth-child(4) { animation-delay: 0.6s; }
          .portfolio-layout section:nth-child(5) { animation-delay: 0.8s; }
        }

        /* Edge-to-edge images */
        .portfolio-layout .full-width-image {
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          height: 60vh;
          object-fit: cover;
        }

        /* Text on dark backgrounds */
        .portfolio-layout {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Links */
        .portfolio-layout a {
          color: var(--primary, white);
          text-decoration: none;
          border-bottom: 2px solid var(--primary, white);
          transition: border-color 0.3s ease;
        }

        .portfolio-layout a:hover {
          border-bottom-color: transparent;
        }
      `}</style>
    </div>
  );
}

"use client";

import { LayoutProps } from "./types";

/**
 * CLASSIC LAYOUT
 *
 * Design: Traditional symmetrical, heritage feel, vintage-modern
 * Best for: Distinguished (Barbershops, Traditional services, Men's grooming)
 *
 * Features:
 * - Symmetrical grid layouts
 * - Traditional card designs
 * - Stacked header (logo above content)
 * - Formal typography
 * - Heritage color schemes
 * - Professional, timeless aesthetic
 */
export function ClassicLayout({ children }: LayoutProps) {
  return (
    <div className="classic-layout">
      <div className="classic-container">
        {children}
      </div>

      <style jsx global>{`
        .classic-layout {
          background: var(--background);
        }

        .classic-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Traditional section spacing */
        .classic-layout section {
          padding: 5rem 3rem;
        }

        @media (max-width: 768px) {
          .classic-layout section {
            padding: 3rem 1.5rem;
          }
        }

        /* Stacked header layout */
        .classic-layout header {
          text-align: center;
          padding: 4rem 2rem;
          border-bottom: 2px solid rgba(0,0,0,0.1);
        }

        .classic-layout header img {
          max-width: 150px;
          margin: 0 auto 2rem;
        }

        /* Traditional typography */
        .classic-layout h1 {
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          line-height: 1.2;
          font-weight: 400;
          letter-spacing: 0.01em;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .classic-layout h2 {
          font-size: clamp(1.875rem, 3vw, 2.5rem);
          line-height: 1.3;
          font-weight: 500;
          margin-bottom: 2rem;
          text-align: center;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding-bottom: 1rem;
        }

        .classic-layout h3 {
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          line-height: 1.4;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .classic-layout p {
          font-size: clamp(1rem, 1.5vw, 1.0625rem);
          line-height: 1.7;
        }

        /* Symmetrical grid layouts */
        .classic-layout .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-top: 3rem;
        }

        .classic-layout .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 3rem;
        }

        @media (max-width: 1024px) {
          .classic-layout .grid-3 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .classic-layout .grid-2,
          .classic-layout .grid-3 {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* Traditional card style */
        .classic-layout .card {
          background: white;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: var(--radius-sm, 0.5rem);
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .classic-layout .card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }

        /* Formal buttons */
        .classic-layout button,
        .classic-layout .btn {
          font-weight: 500;
          padding: 0.875rem 2.5rem;
          border-radius: var(--radius-sm, 0.5rem);
          font-size: 1rem;
          text-transform: none;
          transition: all 0.2s ease;
          border: 2px solid currentColor;
        }

        .classic-layout button:hover,
        .classic-layout .btn:hover {
          background: currentColor;
          color: white;
        }

        /* Service list - menu style */
        .classic-layout .service-list {
          max-width: 900px;
          margin: 3rem auto;
        }

        .classic-layout .service-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 1.5rem 0;
          border-bottom: 1px dashed rgba(0,0,0,0.2);
        }

        .classic-layout .service-item:last-child {
          border-bottom: none;
        }

        .classic-layout .service-name {
          font-weight: 500;
          font-size: 1.125rem;
        }

        .classic-layout .service-price {
          font-weight: 600;
          font-size: 1.125rem;
          min-width: 100px;
          text-align: right;
        }

        .classic-layout .service-duration {
          font-size: 0.875rem;
          color: rgba(0,0,0,0.6);
          margin-left: 1rem;
        }

        /* Professional image treatment */
        .classic-layout img {
          border-radius: var(--radius-sm, 0.5rem);
          border: 1px solid rgba(0,0,0,0.1);
        }

        /* Centered content containers */
        .classic-layout .centered-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        /* Traditional dividers */
        .classic-layout .divider {
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(0,0,0,0.2), transparent);
          margin: 4rem 0;
        }

        /* Elegant fade-in */
        @media (prefers-reduced-motion: no-preference) {
          .classic-layout section {
            opacity: 0;
            animation: classicFadeIn 0.8s ease-out forwards;
          }

          @keyframes classicFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .classic-layout section:nth-child(1) { animation-delay: 0s; }
          .classic-layout section:nth-child(2) { animation-delay: 0.15s; }
          .classic-layout section:nth-child(3) { animation-delay: 0.3s; }
          .classic-layout section:nth-child(4) { animation-delay: 0.45s; }
          .classic-layout section:nth-child(5) { animation-delay: 0.6s; }
        }

        /* Contact info styling */
        .classic-layout .contact-info {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .classic-layout .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Gallery - traditional grid */
        .classic-layout .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }

        @media (max-width: 768px) {
          .classic-layout .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        .classic-layout .gallery-item {
          aspect-ratio: 4/3;
          overflow: hidden;
          border-radius: var(--radius-sm, 0.5rem);
        }

        .classic-layout .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .classic-layout .gallery-item:hover img {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}

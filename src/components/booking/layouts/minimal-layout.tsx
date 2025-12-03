"use client";

import { LayoutProps } from "./types";

/**
 * MINIMAL LAYOUT
 *
 * Design: Zen flowing sections, asymmetric, generous whitespace
 * Best for: Serenity, Tranquil (Yoga studios, Massage therapy, Wellness)
 *
 * Features:
 * - Asymmetric section layouts
 * - Generous breathing space
 * - Soft, flowing transitions
 * - Minimal header (blurred background)
 * - Light, airy typography
 * - Calming animations
 */
export function MinimalLayout({ children }: LayoutProps) {
  return (
    <div className="minimal-layout">
      <div className="minimal-container">
        {children}
      </div>

      <style jsx global>{`
        .minimal-layout {
          background: var(--background);
          font-weight: 300;
        }

        .minimal-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Generous section spacing */
        .minimal-layout section {
          padding: 6rem 3rem;
        }

        @media (max-width: 768px) {
          .minimal-layout section {
            padding: 4rem 2rem;
          }
        }

        /* Asymmetric content positioning */
        .minimal-layout section:nth-child(odd) .content {
          max-width: 65%;
          margin-left: 0;
        }

        .minimal-layout section:nth-child(even) .content {
          max-width: 65%;
          margin-left: auto;
          text-align: right;
        }

        @media (max-width: 1024px) {
          .minimal-layout section:nth-child(odd) .content,
          .minimal-layout section:nth-child(even) .content {
            max-width: 100%;
            margin: 0;
            text-align: left;
          }
        }

        /* Light, airy typography */
        .minimal-layout h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.3;
          font-weight: 200;
          letter-spacing: -0.01em;
          margin-bottom: 2rem;
        }

        .minimal-layout h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.4;
          font-weight: 200;
          margin-bottom: 2rem;
        }

        .minimal-layout h3 {
          font-size: clamp(1.5rem, 3vw, 2rem);
          line-height: 1.5;
          font-weight: 300;
          margin-bottom: 1.5rem;
        }

        .minimal-layout p {
          font-size: clamp(1rem, 1.5vw, 1.125rem);
          line-height: 2;
          font-weight: 300;
        }

        /* Minimal header - blurred backdrop */
        .minimal-layout header {
          position: relative;
          padding: 3rem;
          text-align: center;
        }

        .minimal-layout header::before {
          content: '';
          position: absolute;
          inset: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: -1;
        }

        /* Soft, flowing images */
        .minimal-layout img {
          border-radius: var(--radius-md, 0.75rem);
          transition: opacity 0.6s ease;
        }

        /* Ghost buttons */
        .minimal-layout button,
        .minimal-layout .btn {
          background: transparent;
          border: 1px solid currentColor;
          padding: 0.875rem 2rem;
          border-radius: var(--radius-md, 0.75rem);
          font-weight: 300;
          font-size: 1rem;
          letter-spacing: 0.02em;
          transition: all 0.4s ease;
        }

        .minimal-layout button:hover,
        .minimal-layout .btn:hover {
          background: currentColor;
          color: white;
        }

        /* Flowing section transitions */
        .minimal-layout section {
          position: relative;
        }

        .minimal-layout section::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, var(--background));
          pointer-events: none;
        }

        .minimal-layout section:last-child::after {
          display: none;
        }

        /* Calm fade-in animations */
        @media (prefers-reduced-motion: no-preference) {
          .minimal-layout section {
            opacity: 0;
            animation: minimalFadeIn 1.2s ease-out forwards;
          }

          @keyframes minimalFadeIn {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .minimal-layout section:nth-child(1) { animation-delay: 0s; }
          .minimal-layout section:nth-child(2) { animation-delay: 0.3s; }
          .minimal-layout section:nth-child(3) { animation-delay: 0.6s; }
          .minimal-layout section:nth-child(4) { animation-delay: 0.9s; }
          .minimal-layout section:nth-child(5) { animation-delay: 1.2s; }
        }

        /* Subtle cards without borders */
        .minimal-layout .card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: var(--radius-md, 0.75rem);
          padding: 2.5rem;
          transition: transform 0.6s ease;
        }

        .minimal-layout .card:hover {
          transform: translateX(8px);
        }

        /* Zen list styling */
        .minimal-layout ul {
          list-style: none;
          padding: 0;
        }

        .minimal-layout li {
          padding: 1.5rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .minimal-layout li:last-child {
          border-bottom: none;
        }

        /* Breathing space */
        .minimal-layout * + * {
          margin-top: 0;
        }

        .minimal-layout p + p {
          margin-top: 1.5rem;
        }

        .minimal-layout h2 + p,
        .minimal-layout h3 + p {
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}

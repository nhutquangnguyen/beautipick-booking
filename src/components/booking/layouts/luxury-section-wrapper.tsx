"use client";

import { ReactNode } from "react";

interface LuxurySectionWrapperProps {
  children: ReactNode;
  sectionType: "about" | "services" | "gallery" | "products" | "contact" | "video" | "social";
  imageUrl?: string | null;
  index: number;
}

/**
 * Luxury Section Wrapper
 *
 * Transforms regular content sections into luxury layouts:
 * - Split-screen layouts for alternating sections
 * - Full-bleed backgrounds for galleries
 * - Glass morphism cards for content
 */
export function LuxurySectionWrapper({
  children,
  sectionType,
  imageUrl,
  index
}: LuxurySectionWrapperProps) {

  // Determine layout style based on section type and index
  const shouldUseSplitLayout = (sectionType === "about" || sectionType === "services") && imageUrl;
  const shouldUseFullBleed = sectionType === "gallery" && imageUrl;

  // Split-screen layout for content with images
  if (shouldUseSplitLayout) {
    return (
      <section className="luxury-split">
        <div
          className="luxury-split-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
          role="img"
          aria-label={`${sectionType} background`}
        />
        <div className="luxury-split-content">
          {children}
        </div>
      </section>
    );
  }

  // Full-bleed background for galleries
  if (shouldUseFullBleed) {
    return (
      <section
        className="luxury-full-bleed"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {children}
      </section>
    );
  }

  // Default luxury section with glass morphism
  return (
    <section className="luxury-default-section">
      <div className="luxury-glass-container">
        {children}
      </div>
    </section>
  );
}

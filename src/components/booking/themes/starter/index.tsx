"use client";

import { ThemeComponentProps } from "../types";
import { StarterHeroSection } from "./HeroSection";
import { StarterAboutSection } from "./AboutSection";
import { StarterServicesSection } from "./ServicesSection";
import { StarterProductsSection } from "./ProductsSection";
import { StarterGallerySection } from "./GallerySection";
import { StarterContactSection } from "./ContactSection";
import { StarterSocialSection } from "./SocialSection";
import { StarterVideoSection } from "./VideoSection";
import { getYouTubeVideoId } from "../utils";

export function StarterTheme({ data, colors, cart }: ThemeComponentProps) {
  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: colors.fontFamily,
        backgroundColor: "#FFFFFF",
        color: colors.textColor,
      }}
    >
      {/* Linktree-style single column layout */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-6">
          <StarterHeroSection merchant={data.merchant} colors={colors} onScrollToServices={() => {}} />

          {data.merchant.description && (
            <StarterAboutSection merchant={data.merchant} colors={colors} />
          )}

          {data.services.length > 0 && (
            <StarterServicesSection
              services={data.services}
              merchant={data.merchant}
              colors={colors}
              cart={cart}
            />
          )}

          {data.products.length > 0 && (
            <StarterProductsSection
              products={data.products}
              merchant={data.merchant}
              colors={colors}
              cart={cart}
            />
          )}

          {data.gallery.length > 0 && (
            <StarterGallerySection gallery={data.gallery} colors={colors} />
          )}

          {videoId && (
            <StarterVideoSection
              videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              colors={colors}
            />
          )}

          <StarterContactSection merchant={data.merchant} colors={colors} />

          {data.socialLinks.length > 0 && (
            <StarterSocialSection socialLinks={data.socialLinks} colors={colors} />
          )}
        </div>
      </div>
    </div>
  );
}

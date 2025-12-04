"use client";

import { ThemeComponentProps } from "../types";
import { ClassicHeroSection } from "./HeroSection";
import { ClassicAboutSection } from "./AboutSection";
import { ClassicServicesSection } from "./ServicesSection";
import { ClassicProductsSection } from "./ProductsSection";
import { ClassicGallerySection } from "./GallerySection";
import { ClassicContactSection } from "./ContactSection";
import { ClassicSocialSection } from "./SocialSection";
import { ClassicVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function ClassicTheme({ data, colors, cart }: ThemeComponentProps) {
  const handleScrollToServices = () => {
    scrollToElement('section-services');
  };

  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;

  return (
    <div
      className="classic-layout min-h-screen bg-white"
      style={{ fontFamily: colors.fontFamily }}
    >
      {/* Stacked header style - traditional symmetrical layout */}
      <ClassicHeroSection merchant={data.merchant} colors={colors} onScrollToServices={handleScrollToServices} />
      <ClassicAboutSection merchant={data.merchant} colors={colors} />
      <ClassicServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
      <ClassicGallerySection gallery={data.gallery} colors={colors} />
      <ClassicProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
      {videoId && <ClassicVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
      <ClassicContactSection merchant={data.merchant} colors={colors} />
      <ClassicSocialSection socialLinks={data.socialLinks} colors={colors} />

      <style jsx global>{`
        .classic-layout {
          scroll-behavior: smooth;
        }

        /* Section separators */
        .classic-layout section + section {
          position: relative;
        }

        /* Smooth fade-in animations */
        @media (prefers-reduced-motion: no-preference) {
          .classic-layout section {
            opacity: 0;
            animation: classicFadeIn 0.5s ease-out forwards;
          }

          @keyframes classicFadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Stagger animation for sections */
          .classic-layout section:nth-child(1) { animation-delay: 0s; }
          .classic-layout section:nth-child(2) { animation-delay: 0.1s; }
          .classic-layout section:nth-child(3) { animation-delay: 0.15s; }
          .classic-layout section:nth-child(4) { animation-delay: 0.2s; }
          .classic-layout section:nth-child(5) { animation-delay: 0.25s; }
        }

        /* Classic scrollbar */
        .classic-layout::-webkit-scrollbar {
          width: 8px;
        }

        .classic-layout::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        .classic-layout::-webkit-scrollbar-thumb {
          background: ${colors.primaryColor};
          border-radius: 4px;
        }

        .classic-layout::-webkit-scrollbar-thumb:hover {
          background: ${colors.secondaryColor};
        }
      `}</style>
    </div>
  );
}

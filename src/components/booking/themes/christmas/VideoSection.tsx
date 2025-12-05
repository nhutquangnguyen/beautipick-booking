"use client";

import { useTranslations } from "next-intl";
import { VideoSectionProps } from "../types";

export function ChristmasVideoSection({ videoUrl, colors }: VideoSectionProps) {
  const t = useTranslations("common");
  if (!videoUrl) return null;

  return (
    <section
      id="section-video"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🎬</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("watchOurStory")}
            </h2>
            <span className="text-3xl">🎬</span>
          </div>
          <p
            className="text-lg"
            style={{ color: colors.secondaryColor }}
          >
            {t("christmasVideoSubtitle")}
          </p>
        </div>

        {/* Video container with festive styling */}
        <div className="relative">
          {/* Festive border wrapper */}
          <div
            className="p-2 rounded-3xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
            }}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: '16/9',
                backgroundColor: "#000",
              }}
            >
              <iframe
                src={videoUrl}
                title={t("businessVideo")}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Decorative snowflakes */}
          <div className="absolute -top-4 -left-4 text-4xl opacity-80">
            ❄️
          </div>
          <div className="absolute -top-4 -right-4 text-4xl opacity-80">
            ❄️
          </div>
          <div className="absolute -bottom-4 -left-4 text-4xl opacity-80">
            🎄
          </div>
          <div className="absolute -bottom-4 -right-4 text-4xl opacity-80">
            🎁
          </div>
        </div>

        {/* Bottom festive decoration */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <span className="text-2xl">⭐</span>
          <div
            className="h-1 w-20 rounded-full"
            style={{ backgroundColor: colors.accentColor }}
          />
          <span className="text-2xl">🔔</span>
          <div
            className="h-1 w-20 rounded-full"
            style={{ backgroundColor: colors.accentColor }}
          />
          <span className="text-2xl">⭐</span>
        </div>
      </div>
    </section>
  );
}

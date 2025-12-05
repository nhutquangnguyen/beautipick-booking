"use client";

import { useTranslations } from "next-intl";
import { VideoSectionProps } from "../types";

export function TetHolidayVideoSection({ videoUrl, colors }: VideoSectionProps) {
  const t = useTranslations("common");
  if (!videoUrl) return null;

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.accentColor }}
    >
      {/* Cinematic background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${colors.primaryColor} 25%, transparent 25%),
            linear-gradient(-45deg, ${colors.primaryColor} 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${colors.secondaryColor} 75%),
            linear-gradient(-45deg, transparent 75%, ${colors.secondaryColor} 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Tết header */}
        <div className="text-center mb-12 animate-fade-down">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🎬</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("featuredVideo")}
            </h2>
            <span className="text-3xl">🎬</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetVideoSubtitle") || "Khám Phá Thêm"}
          </p>
        </div>

        {/* Video container with cinematic frame */}
        <div className="relative group">
          {/* Outer golden glow with pulse */}
          <div
            className="absolute -inset-2 rounded-3xl opacity-60 blur-xl animate-tet-video-pulse"
            style={{
              background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
            }}
          />

          {/* Decorative corner frames (film reel style) */}
          <div
            className="absolute -top-4 -left-4 w-16 h-16 border-l-4 border-t-4 rounded-tl-2xl transition-all duration-500 group-hover:scale-110"
            style={{
              borderColor: colors.primaryColor,
            }}
          />
          <div
            className="absolute -top-4 -right-4 w-16 h-16 border-r-4 border-t-4 rounded-tr-2xl transition-all duration-500 group-hover:scale-110"
            style={{
              borderColor: colors.primaryColor,
            }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-16 h-16 border-l-4 border-b-4 rounded-bl-2xl transition-all duration-500 group-hover:scale-110"
            style={{
              borderColor: colors.secondaryColor,
            }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-16 h-16 border-r-4 border-b-4 rounded-br-2xl transition-all duration-500 group-hover:scale-110"
            style={{
              borderColor: colors.secondaryColor,
            }}
          />

          {/* Main video frame */}
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-3xl"
            style={{
              border: `5px solid ${colors.secondaryColor}`,
              boxShadow: `0 20px 60px ${colors.secondaryColor}80, inset 0 0 20px ${colors.primaryColor}1A`,
            }}
          >
            {/* Inner border for luxury double-frame effect */}
            <div
              className="absolute inset-2 rounded-xl pointer-events-none z-10"
              style={{
                border: `2px solid ${colors.primaryColor}`,
                opacity: 0.3,
              }}
            />

            {/* Video embed */}
            <div className="relative pb-[56.25%]">
              <iframe
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Decorative overlay icons */}
            <div
              className="absolute top-4 left-4 text-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
              style={{ color: colors.secondaryColor }}
            >
              🎥
            </div>
            <div
              className="absolute bottom-4 right-4 text-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-0 pointer-events-none"
              style={{ color: colors.secondaryColor }}
            >
              ✨
            </div>
          </div>

          {/* Floating play indicator (pulse effect) */}
          <div
            className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-tet-play-bounce"
            style={{
              background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
              color: colors.primaryColor,
              border: `2px solid ${colors.primaryColor}`,
            }}
          >
            ▶ {t("watchNow") || "Xem Ngay"}
          </div>
        </div>

        {/* Decorative flourish below video */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <span className="text-2xl animate-pulse" style={{ animationDuration: '2s' }}>🌸</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <span className="text-3xl">🎬</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.secondaryColor}, ${colors.primaryColor})`,
            }}
          />
          <span className="text-2xl animate-pulse" style={{ animationDuration: '2.5s' }}>✿</span>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes tet-video-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }
        .animate-tet-video-pulse {
          animation: tet-video-pulse 3s ease-in-out infinite;
        }
        @keyframes tet-play-bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        .animate-tet-play-bounce {
          animation: tet-play-bounce 2s ease-in-out infinite;
        }
        @keyframes fade-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-down {
          animation: fade-down 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}

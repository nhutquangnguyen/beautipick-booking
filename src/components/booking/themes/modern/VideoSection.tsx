"use client";

import { VideoSectionProps } from "../types";

export function ModernVideoSection({ videoUrl, colors }: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <section
      id="section-video"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Watch Our Story
        </h2>

        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            aspectRatio: '16/9',
            boxShadow: `0 20px 60px ${colors.primaryColor}20`,
          }}
        >
          {/* Gradient border effect */}
          <div
            className="absolute inset-0 p-1 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          >
            <div
              className="w-full h-full rounded-3xl overflow-hidden"
              style={{ backgroundColor: colors.backgroundColor }}
            >
              <iframe
                src={videoUrl}
                title="Business video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

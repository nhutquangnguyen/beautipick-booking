"use client";

import { VideoSectionProps } from "../types";

export function EleganceGridVideoSection({ videoUrl, colors }: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            Watch Our Story
          </h2>
          <div
            className="w-20 h-1 mx-auto mb-6"
            style={{ backgroundColor: colors.accentColor }}
          />
        </div>

        {/* Video Container */}
        <div className="relative">
          {/* Decorative Corners */}
          <div
            className="absolute -top-4 -left-4 w-20 h-20 rounded-tl-2xl"
            style={{
              borderTop: `4px solid ${colors.accentColor}`,
              borderLeft: `4px solid ${colors.accentColor}`,
            }}
          />
          <div
            className="absolute -top-4 -right-4 w-20 h-20 rounded-tr-2xl"
            style={{
              borderTop: `4px solid ${colors.primaryColor}`,
              borderRight: `4px solid ${colors.primaryColor}`,
            }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-20 h-20 rounded-bl-2xl"
            style={{
              borderBottom: `4px solid ${colors.primaryColor}`,
              borderLeft: `4px solid ${colors.primaryColor}`,
            }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-20 h-20 rounded-br-2xl"
            style={{
              borderBottom: `4px solid ${colors.accentColor}`,
              borderRight: `4px solid ${colors.accentColor}`,
            }}
          />

          {/* Video Iframe */}
          <div
            className="relative overflow-hidden aspect-video rounded-2xl"
            style={{
              boxShadow: `0 20px 60px ${colors.accentColor}30`,
            }}
          >
            <iframe
              src={videoUrl}
              title="Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

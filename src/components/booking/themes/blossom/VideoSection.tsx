"use client";

import { VideoSectionProps } from "../types";

export function BlossomVideoSection({ videoUrl, colors }: VideoSectionProps) {
  return (
    <section className="blossom-section py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: colors.textColor,
          }}
        >
          Watch Our Story
        </h2>

        <div
          className="relative overflow-hidden shadow-lg"
          style={{
            paddingBottom: "56.25%",
            borderRadius: "16px",
            boxShadow: `0 8px 24px ${colors.primaryColor}30`,
          }}
        >
          <iframe
            src={videoUrl}
            title="Business video"
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "16px" }}
          />
        </div>
      </div>
    </section>
  );
}

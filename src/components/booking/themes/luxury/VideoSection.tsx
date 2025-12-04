"use client";

import { VideoSectionProps } from "../types";
import { getBorderRadius } from "../utils";

export function LuxuryVideoSection({ videoUrl, colors }: VideoSectionProps) {
  const cardRadius = getBorderRadius(colors.borderRadius);

  return (
    <section className="luxury-section py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative w-full overflow-hidden shadow-2xl"
          style={{ borderRadius: cardRadius, paddingBottom: "56.25%" }}
        >
          <iframe
            className="absolute inset-0 w-full h-full"
            src={videoUrl}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}

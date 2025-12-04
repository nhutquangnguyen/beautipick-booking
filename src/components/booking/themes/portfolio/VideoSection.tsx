"use client";

import { VideoSectionProps } from "../types";

export function PortfolioVideoSection({ videoUrl, colors }: VideoSectionProps) {
  return (
    <section
      className="py-24 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        <div
          className="relative w-full overflow-hidden"
          style={{
            paddingBottom: "56.25%",
            borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
            boxShadow: `0 20px 60px ${colors.primaryColor}40`,
            border: `4px solid ${colors.primaryColor}`,
          }}
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

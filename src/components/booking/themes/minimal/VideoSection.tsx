"use client";

import { VideoSectionProps } from "../types";

export function MinimalVideoSection({ videoUrl, colors }: VideoSectionProps) {
  return (
    <section
      className="py-32 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="relative w-full overflow-hidden"
          style={{
            paddingBottom: "56.25%",
            borderRadius: colors.borderRadius === "full" ? "16px" : colors.borderRadius === "none" ? "0" : "8px",
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

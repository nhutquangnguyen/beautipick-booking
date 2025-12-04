"use client";

import { VideoSectionProps } from "../types";

export function ClassicVideoSection({ videoUrl, colors }: VideoSectionProps) {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative w-full overflow-hidden rounded shadow-2xl"
          style={{ paddingBottom: "56.25%" }}
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

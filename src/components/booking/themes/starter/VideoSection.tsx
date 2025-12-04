"use client";

import { VideoSectionProps } from "../types";

export function StarterVideoSection({ videoUrl, colors }: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          Video
        </h2>
      </div>

      {/* Video Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={videoUrl}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        </div>
      </div>
    </div>
  );
}

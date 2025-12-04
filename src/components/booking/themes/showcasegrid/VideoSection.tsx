"use client";

import { VideoSectionProps } from "../types";

export function ShowcaseGridVideoSection({ videoUrl, colors }: VideoSectionProps) {
  if (!videoUrl) return null;

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    // Already embed format
    if (url.includes('/embed/')) return url;

    // youtu.be format
    const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (youtuBeMatch) return `https://www.youtube.com/embed/${youtuBeMatch[1]}`;

    // youtube.com/watch?v= format
    const watchMatch = url.match(/watch\?v=([a-zA-Z0-9_-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section
      id="section-video"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Decorative background shapes */}
      <div className="absolute top-20 right-10 w-48 h-48 rounded-full opacity-5 blur-3xl" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-20 left-10 w-40 h-40 opacity-5 blur-3xl" style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight mb-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                letterSpacing: '-0.02em',
              }}
            >
              Watch Our Story
            </h2>

            {/* Decorative underline */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-16 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
            </div>
          </div>
          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Discover Our Journey
          </p>
        </div>

        {/* Video Container - Premium Frame */}
        <div className="relative group">
          {/* Decorative frame elements */}
          <div
            className="absolute -top-6 -left-6 w-32 h-32 opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110"
            style={{
              borderTop: `4px solid ${colors.accentColor}`,
              borderLeft: `4px solid ${colors.accentColor}`,
            }}
          />
          <div
            className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 transition-all duration-500 group-hover:opacity-30 group-hover:scale-110"
            style={{
              borderBottom: `4px solid ${colors.accentColor}`,
              borderRight: `4px solid ${colors.accentColor}`,
            }}
          />

          {/* Video iframe with shadow */}
          <div
            className="relative overflow-hidden aspect-video shadow-2xl transition-all duration-500 group-hover:shadow-3xl"
            style={{
              borderRadius: '8px',
              border: `3px solid ${colors.accentColor}30`,
            }}
          >
            <iframe
              src={embedUrl}
              title="Watch Our Story"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Accent decoration */}
          <div
            className="absolute -bottom-8 -right-8 w-48 h-48 -z-10 opacity-20"
            style={{
              background: `radial-gradient(circle at bottom right, ${colors.accentColor}, transparent)`,
              filter: 'blur(30px)'
            }}
          />
        </div>
      </div>
    </section>
  );
}

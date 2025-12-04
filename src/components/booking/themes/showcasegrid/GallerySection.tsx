"use client";

import { GallerySectionProps } from "../types";

export function ShowcaseGridGallerySection({ gallery, colors }: GallerySectionProps) {
  if (!gallery || gallery.length === 0) return null;

  // Creative Asymmetric Pattern - Editorial style
  const getCreativeLayout = (index: number) => {
    const patterns = [
      { span: "col-span-2 row-span-2", radius: "rounded-tl-[100px] rounded-br-[100px]" }, // Hero with curves
      { span: "col-span-1 row-span-1", radius: "rounded-3xl" },
      { span: "col-span-1 row-span-1", radius: "rounded-full" }, // Circle!
      { span: "col-span-1 row-span-2", radius: "rounded-tl-[80px] rounded-bl-[80px]" }, // Tall pill left
      { span: "col-span-2 row-span-1", radius: "rounded-tr-[80px] rounded-br-[80px]" }, // Wide pill right
      { span: "col-span-1 row-span-1", radius: "rounded-3xl" },
      { span: "col-span-2 row-span-2", radius: "rounded-bl-[100px] rounded-tr-[100px]" }, // Hero opposite curves
      { span: "col-span-1 row-span-1", radius: "rounded-2xl" },
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section
      id="section-gallery"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Decorative floating shapes */}
      <div className="absolute top-10 right-20 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-20 left-10 w-48 h-48 opacity-5 blur-3xl" style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-24">
          <div className="inline-block relative">
            {/* Mini decorative elements */}
            <div className="absolute -top-6 left-0 w-12 h-1" style={{ backgroundColor: colors.accentColor }} />
            <div className="absolute -top-6 right-0 w-8 h-1 opacity-50" style={{ backgroundColor: colors.accentColor }} />

            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight mb-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                letterSpacing: '-0.02em',
              }}
            >
              Gallery
            </h2>

            {/* Creative underline */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-16 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
            </div>
          </div>

          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Portfolio Showcase
          </p>
        </div>

        {/* Creative Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
          {gallery.map((image, index) => {
            const layout = getCreativeLayout(index);

            return (
              <div
                key={image.id || index}
                className={`${layout.span} group cursor-pointer relative`}
              >
                {/* Image Container với creative shapes */}
                <div className={`relative w-full h-full overflow-hidden ${layout.radius} transition-all duration-700 hover:shadow-2xl group-hover:scale-[1.02]`}>
                  <img
                    src={image.image_url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Minimal overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                  {/* Caption on hover */}
                  {image.caption && (
                    <div className="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-sm font-bold uppercase tracking-wider backdrop-blur-md bg-black/30 px-5 py-2.5 rounded-full">
                          {image.caption}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Number indicator for large items */}
                  {layout.span.includes("row-span-2") && (
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/90 flex items-center justify-center shadow-xl">
                        <span className="text-sm font-black" style={{ color: colors.accentColor }}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative accent line */}
                {index % 3 === 0 && (
                  <div className="absolute -bottom-2 -right-2 w-16 h-16 opacity-20 -z-10" style={{
                    background: `linear-gradient(135deg, ${colors.accentColor}, transparent)`,
                    borderRadius: '50%',
                    filter: 'blur(15px)'
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* View More CTA - Editorial style */}
        <div className="text-center mt-16">
          <button
            onClick={() => {
              // Scroll to top of gallery or you can add custom navigation
              const gallerySection = document.getElementById('section-gallery');
              if (gallerySection) {
                gallerySection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 border-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            style={{
              borderColor: colors.accentColor,
              color: colors.primaryColor,
              borderRadius: '0',
              borderWidth: '3px',
              backgroundColor: 'transparent'
            }}
          >
            <span className="text-sm font-bold uppercase tracking-widest">View All Work</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke={colors.accentColor} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

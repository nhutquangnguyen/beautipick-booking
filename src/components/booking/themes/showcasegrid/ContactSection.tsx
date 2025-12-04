"use client";

import { ContactSectionProps } from "../types";

export function ShowcaseGridContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#F8F9FA',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-10 right-20 w-56 h-56 rounded-full opacity-5 blur-3xl" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-20 left-10 w-40 h-40 opacity-5 blur-3xl" style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-24">
          <div className="inline-block relative">
            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight mb-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                letterSpacing: '-0.02em',
              }}
            >
              Contact
            </h2>

            {/* Decorative underline */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-16 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
            </div>
          </div>
          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Get In Touch
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="mb-10">
              <h3
                className="text-3xl font-black uppercase tracking-tight mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                Info
              </h3>
              <div className="w-16 h-1" style={{ backgroundColor: colors.accentColor }} />
            </div>

            {/* Address Card with hover effects */}
            {merchant.address && (
              <div
                className="group/contact p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-l-4 cursor-pointer"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderLeftColor: colors.accentColor,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${colors.accentColor}15` }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke={colors.accentColor}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Địa chỉ</h4>
                    <p className="text-gray-600">{merchant.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Phone Card */}
            {merchant.phone && (
              <div
                className="p-6 transition-all duration-500 hover:-translate-y-1 border-l-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderLeftColor: colors.accentColor,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${colors.accentColor}15` }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke={colors.accentColor}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Số điện thoại</h4>
                    <a
                      href={`tel:${merchant.phone}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {merchant.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Email Card */}
            {merchant.email && (
              <div
                className="p-6 transition-all duration-500 hover:-translate-y-1 border-l-4"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderLeftColor: colors.accentColor,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${colors.accentColor}15` }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke={colors.accentColor}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <a
                      href={`mailto:${merchant.email}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {merchant.email}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Business Hours Card - Removed: business_hours field doesn't exist in schema */}
          </div>

          {/* Contact Form */}
          <div>
            <div
              className="p-8 border-t-4"
              style={{
                backgroundColor: '#FFFFFF',
                borderTopColor: colors.accentColor,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              }}
            >
              <div className="mb-8">
                <h3
                  className="text-3xl font-black uppercase tracking-tight mb-2"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.primaryColor,
                  }}
                >
                  Message
                </h3>
                <div className="w-16 h-1" style={{ backgroundColor: colors.accentColor }} />
              </div>

              <form className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="0123 456 789"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lời nhắn
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    placeholder="Bạn muốn nhắn gì cho chúng tôi?"
                  />
                </div>

                {/* Submit Button with pulse */}
                <button
                  type="submit"
                  className="group/submit relative w-full py-4 font-black uppercase tracking-widest text-white overflow-hidden"
                  style={{
                    backgroundColor: colors.accentColor,
                    borderRadius: '0',
                    border: `3px solid ${colors.accentColor}`,
                    transition: 'all 0.3s ease',
                    animation: 'button-pulse-contact 3s ease-in-out infinite',
                  }}
                >
                  {/* Glow ring */}
                  <div
                    className="absolute -inset-1 blur-lg"
                    style={{
                      backgroundColor: `${colors.accentColor}30`,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  />

                  {/* Arrow icon appears on hover */}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Message
                    <svg className="w-5 h-5 opacity-0 -translate-x-2 group-hover/submit:opacity-100 group-hover/submit:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>

                {/* CSS animation */}
                <style jsx>{`
                  @keyframes button-pulse-contact {
                    0%, 100% {
                      transform: scale(1);
                      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    }
                    50% {
                      transform: scale(1.02);
                      box-shadow: 0 6px 30px rgba(59, 130, 246, 0.4);
                    }
                  }
                `}</style>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

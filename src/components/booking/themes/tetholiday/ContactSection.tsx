"use client";

import { useTranslations } from "next-intl";
import { ContactSectionProps } from "../types";
import { Mail, Phone, MapPin } from "lucide-react";

export function TetHolidayContactSection({ merchant, colors }: ContactSectionProps) {
  const t = useTranslations("common");

  const hasContactInfo =
    merchant.email ||
    merchant.phone ||
    merchant.address;

  if (!hasContactInfo) return null;

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Decorative Tết pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, ${colors.secondaryColor} 6px, transparent 6px),
            radial-gradient(circle at 85% 75%, ${colors.primaryColor} 5px, transparent 5px)
          `,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Floating lanterns decoration */}
      <div className="absolute top-10 left-10 text-6xl opacity-15 animate-lantern-swing">
        🏮
      </div>
      <div className="absolute top-20 right-20 text-5xl opacity-15 animate-lantern-swing-delayed">
        🏮
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header: "Liên Hệ Với Chúng Tôi" */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">✉️</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("contactUs")}
            </h2>
            <span className="text-3xl">✉️</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetContactSubtitle") || "Liên Hệ Với Chúng Tôi"}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Phone - Red Velvet Style like "Gửi Lời Chúc" button */}
          {merchant.phone && (
            <a
              href={`tel:${merchant.phone}`}
              className="group relative block p-8 rounded-2xl transition-all duration-300 hover:shadow-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.primaryColor} 100%)`,
                border: `3px solid ${colors.secondaryColor}`,
                boxShadow: `0 15px 40px ${colors.primaryColor}66`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animation = 'wiggle 0.5s ease-in-out';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animation = '';
              }}
            >
              {/* Golden shimmer effect on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(120deg, transparent 0%, ${colors.secondaryColor}80 50%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease-in-out infinite',
                }}
              />

              {/* Decorative pattern overlay */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${colors.secondaryColor} 2px, transparent 2px)`,
                  backgroundSize: '30px 30px',
                }}
              />

              <div className="flex items-start gap-4 relative z-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                    boxShadow: `0 4px 20px ${colors.secondaryColor}99`,
                  }}
                >
                  <Phone
                    className="w-7 h-7"
                    style={{
                      color: colors.primaryColor,
                      animation: 'phone-swing 2.5s ease-in-out infinite, phone-pulse 1.5s ease-in-out infinite'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colors.secondaryColor }}
                  >
                    {t("phone")}
                  </h3>
                  <p
                    className="text-2xl font-bold transition-colors duration-300"
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {merchant.phone}
                  </p>
                  <p className="text-sm mt-2" style={{ color: colors.accentColor, opacity: 0.9 }}>
                    {t("tetCallNow") || "Gọi ngay để nhận ưu đãi Tết"} 🧧
                  </p>
                </div>
              </div>
            </a>
          )}

          {/* Email */}
          {merchant.email && (
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2"
              style={{
                backgroundColor: '#fff',
                border: `3px solid ${colors.secondaryColor}`,
                boxShadow: `0 8px 25px ${colors.secondaryColor}4D`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                    boxShadow: `0 4px 15px ${colors.secondaryColor}80`,
                  }}
                >
                  <Mail className="w-7 h-7" style={{ color: colors.primaryColor }} />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colors.primaryColor }}
                  >
                    {t("email")}
                  </h3>
                  <a
                    href={`mailto:${merchant.email}`}
                    className="hover:underline break-all transition-colors duration-300"
                    style={{ color: colors.textColor }}
                  >
                    {merchant.email}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          {merchant.address && (
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 md:col-span-2"
              style={{
                backgroundColor: '#fff',
                border: `3px solid ${colors.secondaryColor}`,
                boxShadow: `0 8px 25px ${colors.secondaryColor}4D`,
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                    boxShadow: `0 4px 15px ${colors.secondaryColor}80`,
                  }}
                >
                  <MapPin className="w-7 h-7" style={{ color: colors.primaryColor }} />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: colors.primaryColor }}
                  >
                    {t("address")}
                  </h3>
                  <p style={{ color: colors.textColor }}>{merchant.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Blessing message */}
        <div
          className="text-center mt-12 p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.primaryColor} 100%)`,
            boxShadow: `0 15px 40px ${colors.primaryColor}66`,
            border: `4px solid ${colors.secondaryColor}`,
          }}
        >
          {/* Decorative pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, ${colors.secondaryColor} 2px, transparent 2px)`,
              backgroundSize: '30px 30px',
            }}
          />

          <div className="relative z-10">
            <p
              className="text-2xl font-bold mb-3"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.secondaryColor,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {t("tetContactBlessing") || "Chúc Quý Khách Vạn Sự Như Ý"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="text-3xl">🧧</span>
              <span className="text-3xl">🌸</span>
              <span className="text-3xl">🧧</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes lantern-swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }
        .animate-lantern-swing {
          animation: lantern-swing 3s ease-in-out infinite;
        }
        .animate-lantern-swing-delayed {
          animation: lantern-swing 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-2deg) scale(1.02); }
          50% { transform: rotate(2deg) scale(1.05); }
          75% { transform: rotate(-2deg) scale(1.02); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes phone-swing {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          50% { transform: rotate(5deg) scale(1); }
        }
        @keyframes phone-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}

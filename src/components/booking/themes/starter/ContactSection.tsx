"use client";

import { useState } from "react";
import { ContactSectionProps } from "../types";
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";

export function StarterContactSection({ merchant, colors }: ContactSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const contactItems = [
    {
      id: 'phone',
      icon: Phone,
      label: 'Phone',
      value: merchant.phone,
      href: `tel:${merchant.phone}`,
      show: !!merchant.phone,
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email',
      value: merchant.email,
      href: `mailto:${merchant.email}`,
      show: !!merchant.email,
    },
    {
      id: 'address',
      icon: MapPin,
      label: 'Address',
      value: merchant.address,
      href: merchant.address ? `https://maps.google.com/?q=${encodeURIComponent(merchant.address)}` : undefined,
      show: !!merchant.address,
    },
  ].filter(item => item.show);

  if (contactItems.length === 0) return null;

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          Contact
        </h2>
      </div>

      {/* Contact Cards */}
      <div className="flex flex-col gap-3">
        {contactItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredId === item.id;

          return (
            <a
              key={item.id}
              href={item.href}
              target={item.id === 'address' ? '_blank' : undefined}
              rel={item.id === 'address' ? 'noopener noreferrer' : undefined}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center justify-between cursor-pointer border border-gray-200"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primaryColor + '15' }}
                >
                  <Icon className="w-5 h-5" style={{ color: colors.primaryColor }} />
                </div>
                <div className="text-left">
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <div className="font-medium text-gray-900">{item.value}</div>
                </div>
              </div>
              <ChevronRight
                className="w-5 h-5"
                style={{ color: isHovered ? colors.primaryColor : '#9CA3AF' }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}

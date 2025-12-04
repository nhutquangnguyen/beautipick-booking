"use client";

import { AboutSectionProps } from "../types";

export function StarterAboutSection({ merchant, colors }: AboutSectionProps) {
  // Use description field which exists in the database
  if (!merchant.description) return null;

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          About
        </h2>
      </div>

      {/* About Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-700 text-center leading-relaxed whitespace-pre-wrap">
          {merchant.description}
        </p>
      </div>
    </div>
  );
}

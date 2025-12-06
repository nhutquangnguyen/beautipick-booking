"use client";

import Link from "next/link";

interface PoweredByFooterProps {
  show: boolean;
  accentColor?: string;
}

export function PoweredByFooter({ show, accentColor = "#8B5CF6" }: PoweredByFooterProps) {
  if (!show) return null;

  return (
    <div className="w-full py-4 px-4 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <Link
          href="https://www.beautipick.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span>Powered by</span>
          <span
            className="font-bold"
            style={{ color: accentColor }}
          >
            BeautiPick
          </span>
        </Link>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

interface FloatingZaloButtonProps {
  phone: string;
}

export function FloatingZaloButton({ phone }: FloatingZaloButtonProps) {
  if (!phone) return null;

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanPhone = phone.replace(/[\s\-()]/g, "");

  // Zalo link format
  const zaloLink = `https://zalo.me/${cleanPhone}`;

  return (
    <a
      href={zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
      aria-label="Chat qua Zalo"
    >
      {/* Zalo Icon */}
      <Image
        src="/zalo-icon.svg"
        alt="Zalo"
        width={64}
        height={64}
        className="w-full h-full"
        priority
      />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat qua Zalo
      </span>

      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-2xl bg-blue-400 animate-ping opacity-30"></span>
    </a>
  );
}

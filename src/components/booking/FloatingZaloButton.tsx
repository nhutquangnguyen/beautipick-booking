"use client";

import Image from "next/image";

interface FloatingZaloButtonProps {
  phoneNumber: string;
  accentColor?: string;
}

export function FloatingZaloButton({ phoneNumber, accentColor = "#0068FF" }: FloatingZaloButtonProps) {
  const zaloUrl = `https://zalo.me/${phoneNumber.replace(/\D/g, '')}`;

  return (
    <a
      href={zaloUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
      style={{
        backgroundColor: 'transparent',
      }}
      aria-label="Contact us on Zalo"
    >
      {/* Glow effect on hover */}
      <div
        className="absolute -inset-1 blur-sm opacity-0 group-hover:opacity-50 rounded-full transition-opacity duration-300"
        style={{
          backgroundColor: '#0068FF',
        }}
      />

      {/* Zalo Icon */}
      <Image
        src="/zalo-icon.svg"
        alt="Zalo"
        width={56}
        height={56}
        className="relative z-10 transition-transform duration-300 group-hover:scale-110"
      />

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#0068FF' }} />
    </a>
  );
}

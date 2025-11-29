"use client";

import { useState, useRef, useEffect } from "react";
import { X, Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  businessName: string;
  logoUrl: string | null;
}

export function QRCodeModal({
  isOpen,
  onClose,
  url,
  businessName,
  logoUrl,
}: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  // Fetch logo and convert to data URL to avoid CORS issues
  useEffect(() => {
    if (logoUrl) {
      fetchLogoAsDataUrl(logoUrl);
    } else {
      setLogoDataUrl(null);
    }
  }, [logoUrl]);

  const fetchLogoAsDataUrl = async (imageUrl: string) => {
    try {
      // Use proxy API to avoid CORS issues
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to fetch logo:", error);
      setLogoDataUrl(null);
    }
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, url, logoDataUrl]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;
    setLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    try {
      // Generate QR code
      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H", // High error correction to allow logo overlay
      });

      // Add logo in the center
      if (logoDataUrl) {
        const logo = new Image();
        logo.onload = () => {
          const logoSize = size * 0.25; // Logo takes 25% of QR code
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw white background behind logo
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10, 10);
          ctx.fill();

          // Draw logo
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(logoX, logoY, logoSize, logoSize, 8);
          ctx.clip();
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
          ctx.restore();

          setLoading(false);
        };
        logo.onerror = () => {
          // If logo fails to load, show QR with default logo
          addDefaultLogo(ctx, size);
          setLoading(false);
        };
        logo.src = logoDataUrl;
      } else {
        // Add default logo with first letter
        addDefaultLogo(ctx, size);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setLoading(false);
    }
  };

  const addDefaultLogo = (ctx: CanvasRenderingContext2D, size: number) => {
    const logoSize = size * 0.2;
    const logoX = (size - logoSize) / 2;
    const logoY = (size - logoSize) / 2;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(
      logoX,
      logoY,
      logoX + logoSize,
      logoY + logoSize
    );
    gradient.addColorStop(0, "#8B5CF6");
    gradient.addColorStop(1, "#EC4899");

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(logoX - 3, logoY - 3, logoSize + 6, logoSize + 6, 8);
    ctx.fill();

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(logoX, logoY, logoSize, logoSize, 6);
    ctx.fill();

    // Draw first letter
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${logoSize * 0.5}px Inter, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      businessName.charAt(0).toUpperCase(),
      logoX + logoSize / 2,
      logoY + logoSize / 2 + 2
    );
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Create a new canvas with padding and branding
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    const qrSize = 300;
    const padding = 40;
    const bottomHeight = 60;
    const totalWidth = qrSize + padding * 2;
    const totalHeight = qrSize + padding * 2 + bottomHeight;

    exportCanvas.width = totalWidth;
    exportCanvas.height = totalHeight;

    // White background
    exportCtx.fillStyle = "#ffffff";
    exportCtx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw QR code
    exportCtx.drawImage(canvasRef.current, padding, padding);

    // Draw business name
    exportCtx.fillStyle = "#1F2937";
    exportCtx.font = "bold 18px Inter, sans-serif";
    exportCtx.textAlign = "center";
    exportCtx.fillText(
      businessName,
      totalWidth / 2,
      qrSize + padding + 30
    );

    // Draw URL
    exportCtx.fillStyle = "#6B7280";
    exportCtx.font = "12px Inter, sans-serif";
    exportCtx.fillText(
      url.replace("https://", "").replace("http://", ""),
      totalWidth / 2,
      qrSize + padding + 50
    );

    // Download
    const link = document.createElement("a");
    link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          {/* QR Code Canvas */}
          <div className="relative bg-white p-4 rounded-xl border border-gray-200">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              </div>
            )}
            <canvas ref={canvasRef} className="block" />
          </div>

          {/* Business Name */}
          <p className="mt-4 font-semibold text-gray-900">{businessName}</p>
          <p className="text-sm text-gray-500 truncate max-w-full">
            {url.replace("https://", "").replace("http://", "")}
          </p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="h-5 w-5" />
            Download QR Code
          </button>

          <p className="mt-3 text-xs text-gray-400 text-center">
            Print this QR code and display it in your salon.
            Customers can scan to book appointments.
          </p>
        </div>
      </div>
    </div>
  );
}

export function QRCodeButton({
  url,
  businessName,
  logoUrl,
}: {
  url: string;
  businessName: string;
  logoUrl: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        title="Download QR Code"
      >
        <QrCode className="h-4 w-4" />
        Download QR Code
      </button>
      <QRCodeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        url={url}
        businessName={businessName}
        logoUrl={logoUrl}
      />
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

type QRLayout = "logo-inside" | "logo-left" | "logo-right" | "qr-only";

interface QRCodeGeneratorProps {
  url: string;
  businessName: string;
  logoUrl: string | null;
}

export function QRCodeGenerator({
  url,
  businessName,
  logoUrl,
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layout, setLayout] = useState<QRLayout>("logo-inside");
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
    generateQRCode();
  }, [url, logoDataUrl, layout]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;
    setLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const qrSize = 200;
    const padding = 24;
    const logoSize = layout === "logo-inside" ? qrSize * 0.25 : 80;

    let totalWidth: number;
    let totalHeight: number;
    let qrX: number;
    let qrY: number;
    let logoX: number;
    let logoY: number;

    // Calculate dimensions based on layout
    switch (layout) {
      case "logo-left":
        totalWidth = qrSize + logoSize + padding * 3;
        totalHeight = qrSize + padding * 2 + 50; // Extra for text
        qrX = logoSize + padding * 2;
        qrY = padding;
        logoX = padding;
        logoY = padding + (qrSize - logoSize) / 2;
        break;
      case "logo-right":
        totalWidth = qrSize + logoSize + padding * 3;
        totalHeight = qrSize + padding * 2 + 50;
        qrX = padding;
        qrY = padding;
        logoX = qrSize + padding * 2;
        logoY = padding + (qrSize - logoSize) / 2;
        break;
      case "qr-only":
        totalWidth = qrSize + padding * 2;
        totalHeight = qrSize + padding * 2 + 50;
        qrX = padding;
        qrY = padding;
        logoX = 0;
        logoY = 0;
        break;
      default: // logo-inside
        totalWidth = qrSize + padding * 2;
        totalHeight = qrSize + padding * 2 + 50;
        qrX = padding;
        qrY = padding;
        logoX = padding + (qrSize - logoSize) / 2;
        logoY = padding + (qrSize - logoSize) / 2;
    }

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    try {
      // Create temp canvas for QR code
      const tempCanvas = document.createElement("canvas");
      await QRCode.toCanvas(tempCanvas, url, {
        width: qrSize,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });

      // Draw QR code
      ctx.drawImage(tempCanvas, qrX, qrY);

      // Draw logo based on layout
      if (layout === "logo-inside" && logoDataUrl) {
        await drawLogoInside(ctx, logoDataUrl, logoX, logoY, logoSize);
      } else if (layout === "logo-inside" && !logoDataUrl) {
        drawDefaultLogoInside(ctx, logoX, logoY, logoSize);
      } else if ((layout === "logo-left" || layout === "logo-right") && logoDataUrl) {
        await drawLogoSide(ctx, logoDataUrl, logoX, logoY, logoSize);
      } else if ((layout === "logo-left" || layout === "logo-right") && !logoDataUrl) {
        drawDefaultLogoSide(ctx, logoX, logoY, logoSize);
      }

      // Draw business name and URL at bottom
      const textY = qrY + qrSize + 20;
      ctx.fillStyle = "#1F2937";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(businessName, totalWidth / 2, textY);

      ctx.fillStyle = "#6B7280";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.fillText(
        url.replace("https://", "").replace("http://", ""),
        totalWidth / 2,
        textY + 18
      );

      setLoading(false);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setLoading(false);
    }
  };

  const drawLogoInside = (
    ctx: CanvasRenderingContext2D,
    logoSrc: string,
    x: number,
    y: number,
    size: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const logo = new Image();
      logo.onload = () => {
        // White background
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.roundRect(x - 4, y - 4, size + 8, size + 8, 8);
        ctx.fill();

        // Draw logo
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 6);
        ctx.clip();
        ctx.drawImage(logo, x, y, size, size);
        ctx.restore();
        resolve();
      };
      logo.onerror = () => resolve();
      logo.src = logoSrc;
    });
  };

  const drawDefaultLogoInside = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, "#8B5CF6");
    gradient.addColorStop(1, "#EC4899");

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 4, size + 8, size + 8, 8);
    ctx.fill();

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 6);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * 0.5}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(businessName.charAt(0).toUpperCase(), x + size / 2, y + size / 2 + 2);
  };

  const drawLogoSide = (
    ctx: CanvasRenderingContext2D,
    logoSrc: string,
    x: number,
    y: number,
    size: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const logo = new Image();
      logo.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 12);
        ctx.clip();
        ctx.drawImage(logo, x, y, size, size);
        ctx.restore();

        // Border
        ctx.strokeStyle = "#E5E7EB";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, 12);
        ctx.stroke();
        resolve();
      };
      logo.onerror = () => resolve();
      logo.src = logoSrc;
    });
  };

  const drawDefaultLogoSide = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) => {
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, "#8B5CF6");
    gradient.addColorStop(1, "#EC4899");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 12);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${size * 0.4}px Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(businessName.charAt(0).toUpperCase(), x + size / 2, y + size / 2 + 2);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `${businessName.toLowerCase().replace(/\s+/g, "-")}-qr-code.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const layouts: { value: QRLayout; label: string; description: string }[] = [
    { value: "logo-inside", label: "Logo Inside", description: "Logo centered in QR" },
    { value: "logo-left", label: "Logo Left", description: "Logo on left side" },
    { value: "logo-right", label: "Logo Right", description: "Logo on right side" },
    { value: "qr-only", label: "QR Only", description: "No logo" },
  ];

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="h-5 w-5 text-purple-600" />
        <h3 className="text-base font-semibold text-gray-900">QR Code</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Download a QR code for your booking page. Print and display in your salon.
      </p>

      {/* Layout Options */}
      <div className="mb-6">
        <label className="label mb-2">Layout Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {layouts.map((l) => (
            <button
              key={l.value}
              onClick={() => setLayout(l.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                layout === l.value
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-medium text-gray-900">{l.label}</p>
              <p className="text-xs text-gray-500">{l.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center">
        <div className="relative bg-gray-50 p-6 rounded-xl border border-gray-200 mb-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-xl">
              <div className="h-6 w-6 animate-spin rounded-full border-3 border-purple-500 border-t-transparent" />
            </div>
          )}
          <canvas ref={canvasRef} className="block max-w-full h-auto" />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="h-5 w-5" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}

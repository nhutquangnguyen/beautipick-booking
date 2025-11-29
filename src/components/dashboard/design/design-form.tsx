"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MerchantTheme } from "@/types/database";

interface GalleryImage {
  id: string;
  image_url: string;
  display_url: string | null;
  caption: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  display_url: string | null;
}

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Lato", label: "Lato" },
];

const RADIUS_OPTIONS = [
  { value: "none", label: "Square" },
  { value: "sm", label: "Slightly rounded" },
  { value: "md", label: "Rounded" },
  { value: "lg", label: "Very rounded" },
  { value: "full", label: "Pill" },
];

const BUTTON_STYLES = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost" },
];

export function DesignForm({
  merchantId,
  theme,
  slug,
  gallery,
  products,
}: {
  merchantId: string;
  theme: MerchantTheme;
  slug: string;
  gallery: GalleryImage[];
  products: Product[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<MerchantTheme>(theme);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({ theme: formData })
        .eq("id", merchantId);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = (field: keyof MerchantTheme, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">Colors</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Primary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => updateTheme("primaryColor", e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor}
                    onChange={(e) => updateTheme("primaryColor", e.target.value)}
                    className="input flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="label">Secondary Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor}
                    onChange={(e) => updateTheme("secondaryColor", e.target.value)}
                    className="input flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="label">Background</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => updateTheme("backgroundColor", e.target.value)}
                    className="input flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="label">Text Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => updateTheme("textColor", e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={formData.textColor}
                    onChange={(e) => updateTheme("textColor", e.target.value)}
                    className="input flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Typography</h3>
            <div className="mt-4">
              <label className="label">Font Family</label>
              <select
                value={formData.fontFamily}
                onChange={(e) => updateTheme("fontFamily", e.target.value)}
                className="input mt-1"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Buttons</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Corner Radius</label>
                <select
                  value={formData.borderRadius}
                  onChange={(e) =>
                    updateTheme("borderRadius", e.target.value as MerchantTheme["borderRadius"])
                  }
                  className="input mt-1"
                >
                  {RADIUS_OPTIONS.map((radius) => (
                    <option key={radius.value} value={radius.value}>
                      {radius.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Button Style</label>
                <select
                  value={formData.buttonStyle}
                  onChange={(e) =>
                    updateTheme("buttonStyle", e.target.value as MerchantTheme["buttonStyle"])
                  }
                  className="input mt-1"
                >
                  {BUTTON_STYLES.map((style) => (
                    <option key={style.value} value={style.value}>
                      {style.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary btn-md">
              {loading ? "Saving..." : "Save Design"}
            </button>
            {success && (
              <span className="text-sm text-green-600">Design saved successfully!</span>
            )}
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="card overflow-hidden">
        <div className="border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Preview</span>
            <Link
              href={`/${slug}`}
              target="_blank"
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-500"
            >
              Open page <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <div
          className="p-4"
          style={{
            backgroundColor: formData.backgroundColor,
            color: formData.textColor,
            fontFamily: formData.fontFamily,
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: formData.textColor }}>
            Your Business Name
          </h2>
          <p className="mt-1 text-xs opacity-80">Book your appointment today</p>

          {/* Gallery Preview */}
          {gallery.length > 0 && (
            <div className="mt-3 flex gap-1.5 overflow-hidden">
              {gallery.slice(0, 4).map((image) => (
                image.display_url && (
                  <img
                    key={image.id}
                    src={image.display_url}
                    alt={image.caption || "Gallery"}
                    className="h-12 w-12 object-cover flex-shrink-0"
                    style={{
                      borderRadius:
                        formData.borderRadius === "none"
                          ? "0"
                          : formData.borderRadius === "sm"
                            ? "2px"
                            : formData.borderRadius === "md"
                              ? "4px"
                              : "6px",
                    }}
                  />
                )
              ))}
            </div>
          )}

          {/* Products Preview */}
          {products.length > 0 && (
            <div className="mt-3">
              <p className="text-xs opacity-60 mb-2 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> Products
              </p>
              <div className="flex gap-2">
                {products.slice(0, 2).map((product) => (
                  <div
                    key={product.id}
                    className="flex-1 p-2 text-xs"
                    style={{
                      borderRadius:
                        formData.borderRadius === "none"
                          ? "0"
                          : formData.borderRadius === "sm"
                            ? "2px"
                            : formData.borderRadius === "md"
                              ? "4px"
                              : "6px",
                      border: `1px solid ${formData.primaryColor}30`,
                    }}
                  >
                    {product.display_url ? (
                      <img
                        src={product.display_url}
                        alt={product.name}
                        className="w-full h-10 object-cover rounded mb-1"
                      />
                    ) : (
                      <div
                        className="w-full h-10 flex items-center justify-center rounded mb-1"
                        style={{ backgroundColor: formData.primaryColor + "15" }}
                      >
                        <ShoppingBag className="h-4 w-4 opacity-30" />
                      </div>
                    )}
                    <p className="truncate font-medium">{product.name}</p>
                    <p style={{ color: formData.primaryColor }}>${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div
              className="p-3"
              style={{
                borderRadius:
                  formData.borderRadius === "none"
                    ? "0"
                    : formData.borderRadius === "sm"
                      ? "4px"
                      : formData.borderRadius === "md"
                        ? "6px"
                        : "8px",
                border: `1px solid ${formData.primaryColor}40`,
              }}
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">Haircut</span>
                <span style={{ color: formData.primaryColor }}>$45</span>
              </div>
              <p className="mt-0.5 text-xs opacity-70">45 minutes</p>
            </div>

            <button
              className="w-full py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor:
                  formData.buttonStyle === "solid" ? formData.primaryColor : "transparent",
                color: formData.buttonStyle === "solid" ? "#fff" : formData.primaryColor,
                border:
                  formData.buttonStyle === "outline"
                    ? `2px solid ${formData.primaryColor}`
                    : "none",
                borderRadius:
                  formData.borderRadius === "none"
                    ? "0"
                    : formData.borderRadius === "sm"
                      ? "4px"
                      : formData.borderRadius === "md"
                        ? "8px"
                        : formData.borderRadius === "lg"
                          ? "12px"
                          : "9999px",
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

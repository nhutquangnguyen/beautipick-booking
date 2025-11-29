"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (key: string | null) => void;
  folder: string;
  aspectRatio?: "square" | "cover";
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder,
  aspectRatio = "square",
  className,
  placeholder,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch signed URL when value (key) changes
  useEffect(() => {
    if (!value) {
      setDisplayUrl(null);
      return;
    }

    // If value is already a full URL (legacy or signed URL), use it directly
    if (value.startsWith("http")) {
      setDisplayUrl(value);
      return;
    }

    // Otherwise, fetch a signed URL for the key
    const fetchSignedUrl = async () => {
      setLoadingUrl(true);
      try {
        const response = await fetch(`/api/signed-url?key=${encodeURIComponent(value)}`);
        const data = await response.json();
        if (response.ok && data.url) {
          setDisplayUrl(data.url);
        } else {
          console.error("Failed to get signed URL:", data.error);
          setDisplayUrl(null);
        }
      } catch (err) {
        console.error("Failed to fetch signed URL:", err);
        setDisplayUrl(null);
      } finally {
        setLoadingUrl(false);
      }
    };

    fetchSignedUrl();
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Set display URL immediately from the response
      setDisplayUrl(data.url);
      // Pass the key to onChange for storage
      onChange(data.key);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: value }),
      });
    } catch {
      // Ignore delete errors, just clear the value
    }

    setDisplayUrl(null);
    onChange(null);
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />

      {loadingUrl ? (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl bg-gray-100",
            aspectRatio === "cover" ? "aspect-[5/1]" : "aspect-square w-32"
          )}
        >
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        </div>
      ) : displayUrl ? (
        <div
          className={cn(
            "relative group rounded-xl overflow-hidden bg-gray-100",
            aspectRatio === "cover" ? "aspect-[5/1]" : "aspect-square w-32"
          )}
        >
          <img
            src={displayUrl}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 transition-colors",
            aspectRatio === "cover" ? "aspect-[5/1] w-full" : "aspect-square w-32",
            uploading && "opacity-50 cursor-not-allowed"
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                {placeholder || "Upload"}
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

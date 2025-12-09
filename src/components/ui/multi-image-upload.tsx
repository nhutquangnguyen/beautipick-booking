"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MultiImageUploadProps {
  value: string[]; // Array of image URLs/keys
  onChange: (images: string[]) => void;
  folder: string; // e.g., "services" or "products"
  maxImages?: number;
  aspectRatio?: "square" | "video" | "landscape" | "portrait";
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder,
  maxImages = 5,
  aspectRatio = "square",
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const supabase = createClient();

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    landscape: "aspect-[4/3]",
    portrait: "aspect-[3/4]",
  };

  const getImageUrl = (imageKey: string): string => {
    if (!imageKey) return "";

    // If already a full URL, return as-is
    if (imageKey.startsWith("http://") || imageKey.startsWith("https://")) {
      return imageKey;
    }

    // Get public URL from Supabase storage
    const { data } = supabase.storage.from("images").getPublicUrl(imageKey);
    return data.publicUrl;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check if adding these files would exceed max
    if (value.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;
        return data.path;
      });

      const uploadedKeys = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedKeys]);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...value];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((imageKey, index) => (
            <div
              key={`${imageKey}-${index}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg overflow-hidden border-2 transition-all cursor-move ${
                index === 0 ? "border-purple-500" : "border-gray-200"
              } ${aspectRatioClasses[aspectRatio]}`}
            >
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
                  Primary
                </div>
              )}

              {/* Image */}
              <img
                src={getImageUrl(imageKey)}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Drag Handle Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded">
                  Drag to reorder
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {value.length < maxImages && (
        <label
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-2" />
                <p className="text-sm text-gray-600">Uploading...</p>
              </>
            ) : (
              <>
                {value.length === 0 ? (
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600 font-medium">
                  {value.length === 0 ? "Upload images" : "Add more images"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {value.length} / {maxImages} images
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      )}

      {/* Hints */}
      <div className="text-xs text-gray-500 space-y-1">
        {value.length > 0 && (
          <p>💡 Drag images to reorder. First image is the primary image.</p>
        )}
        {value.length === 0 && (
          <p>💡 You can upload multiple images (max {maxImages})</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Images, Trash2, Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface GalleryImage {
  id: string;
  merchant_id: string;
  image_url: string;
  display_url?: string; // Signed URL for display
  caption: string | null;
  display_order: number;
  created_at: string;
}

interface UploadedImage {
  key: string;
  url: string;
  caption: string;
}

export function GalleryManager({
  merchantId,
  images,
}: {
  merchantId: string;
  images: GalleryImage[];
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    const newUploaded: UploadedImage[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${totalFiles}...`);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(`${file.name} is not an image file, skipping...`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is larger than 5MB, skipping...`);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `merchants/${merchantId}/gallery`);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        newUploaded.push({
          key: data.key,
          url: data.url,
          caption: "",
        });
      } catch (err) {
        console.error("Upload error:", err);
        setError(`Failed to upload ${file.name}`);
      }
    }

    setUploadedImages((prev) => [...prev, ...newUploaded]);
    setUploadProgress(null);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveUploaded = (index: number) => {
    const image = uploadedImages[index];
    // Delete from Wasabi
    fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: image.key }),
    }).catch(() => {});

    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, caption: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  const handleAddImages = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) return;

    setIsUploading(true);

    // Insert all images
    const insertData = uploadedImages.map((img, index) => ({
      merchant_id: merchantId,
      image_url: img.key, // Store the key in image_url
      caption: img.caption || null,
      display_order: images.length + index,
    }));

    const { error } = await supabase.from("gallery").insert(insertData);

    if (error) {
      console.error("Failed to save images:", error);
      setError("Failed to save images. Please try again.");
      setIsUploading(false);
      return;
    }

    setUploadedImages([]);
    setShowAddModal(false);
    setIsUploading(false);
    router.refresh();
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!confirm("Delete this image?")) return;

    // Delete from Wasabi if we have the key (stored in image_url)
    const keyToDelete = image.image_url;
    if (keyToDelete && !keyToDelete.startsWith("http")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: keyToDelete }),
        });
      } catch {
        // Ignore delete errors from storage
      }
    }

    await supabase.from("gallery").delete().eq("id", image.id);
    router.refresh();
  };

  const handleCloseModal = () => {
    // Delete all uploaded images that weren't saved
    uploadedImages.forEach((img) => {
      fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: img.key }),
      }).catch(() => {});
    });

    setUploadedImages([]);
    setError(null);
    setShowAddModal(false);
  };

  return (
    <>
      {images.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((image) => (
              <div key={image.id} className="relative group aspect-square">
                <img
                  src={image.display_url || image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={() => handleDelete(image)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
                    <p className="text-white text-xs truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={() => setShowAddModal(true)}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-colors"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs">Add Image</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Images className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No images yet</h3>
          <p className="mt-2 text-gray-500">
            Add photos of your work to attract customers
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Add Image
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add high-quality photos of your best work. Before/after shots
          work great for showing your skills!
        </p>
      </div>

      {/* Add Images Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Images</h2>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddImages} className="mt-6 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full py-8 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="text-sm text-purple-600">{uploadProgress}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8" />
                      <span className="text-sm">Click to select images</span>
                      <span className="text-xs text-gray-400">Select multiple images (Max 5MB each)</span>
                    </>
                  )}
                </button>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} ready to add
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={img.key} className="relative group">
                        <img
                          src={img.url}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveUploaded(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) => handleCaptionChange(index, e.target.value)}
                          className="absolute bottom-2 left-2 right-2 px-2 py-1 text-xs rounded-lg bg-white/90 border border-gray-200 focus:outline-none focus:border-purple-500"
                          placeholder="Add caption..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || uploadedImages.length === 0}
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Saving..." : `Add ${uploadedImages.length || ""} Image${uploadedImages.length !== 1 ? "s" : ""}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Images, Trash2, Upload, Loader2, Crown, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
  const [tierInfo, setTierInfo] = useState<{
    tierKey: string;
    tierName: string;
    limit: number;
    currentCount: number;
  } | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Fetch tier info on mount
  useEffect(() => {
    async function fetchTierInfo() {
      const { data: subscription } = await supabase
        .from("merchant_subscriptions")
        .select(`
          *,
          pricing_tiers (
            tier_key,
            tier_name,
            max_gallery_images
          )
        `)
        .eq("merchant_id", merchantId)
        .single();

      const tierData = Array.isArray(subscription?.pricing_tiers)
        ? subscription.pricing_tiers[0]
        : subscription?.pricing_tiers;

      if (tierData) {
        setTierInfo({
          tierKey: tierData.tier_key,
          tierName: tierData.tier_name,
          limit: tierData.max_gallery_images,
          currentCount: images.length,
        });
      }
    }

    fetchTierInfo();
  }, [merchantId, images.length, supabase]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check quota before allowing upload
    const { count } = await supabase
      .from("gallery")
      .select("id", { count: "exact" })
      .eq("merchant_id", merchantId);

    const currentCount = count || 0;

    // Get subscription to check limit
    const { data: subscription } = await supabase
      .from("merchant_subscriptions")
      .select(`
        *,
        pricing_tiers (
          max_gallery_images
        )
      `)
      .eq("merchant_id", merchantId)
      .single();

    const tierData = Array.isArray(subscription?.pricing_tiers)
      ? subscription.pricing_tiers[0]
      : subscription?.pricing_tiers;

    const limit = tierData?.max_gallery_images || 20;
    const isUnlimited = limit === -1;

    // Calculate how many slots are available
    const availableSlots = isUnlimited ? Infinity : limit - currentCount;

    if (availableSlots <= 0) {
      setError(`Gallery image limit reached (${limit} images). Upgrade to Pro for 500 images.`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    // Warn if trying to upload more than available slots
    if (files.length > availableSlots) {
      setError(`You can only upload ${availableSlots} more image(s). You're at ${currentCount}/${limit}.`);
      setShowUpgradePrompt(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

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
    setError(null);

    // Check quota before inserting each image
    for (let i = 0; i < uploadedImages.length; i++) {
      const img = uploadedImages[i];

      // Check if we can upload this image (quota check)
      const { count } = await supabase
        .from("gallery")
        .select("id", { count: "exact" })
        .eq("merchant_id", merchantId);

      const currentCount = count || 0;

      // Get subscription to check limit
      const { data: subscription } = await supabase
        .from("merchant_subscriptions")
        .select(`
          *,
          pricing_tiers (
            max_gallery_images
          )
        `)
        .eq("merchant_id", merchantId)
        .single();

      const tierData = Array.isArray(subscription?.pricing_tiers)
        ? subscription.pricing_tiers[0]
        : subscription?.pricing_tiers;

      const limit = tierData?.max_gallery_images || 20;
      const isUnlimited = limit === -1;

      // Check if limit reached
      if (!isUnlimited && currentCount >= limit) {
        setError(`Gallery image limit reached (${limit} images). Upgrade to Pro for 500 images.`);
        setIsUploading(false);
        return;
      }

      // Insert this image
      const { error } = await supabase.from("gallery").insert({
        merchant_id: merchantId,
        image_url: img.key,
        caption: img.caption || null,
        display_order: images.length + i,
      });

      if (error) {
        console.error("Failed to save image:", error);
        setError(`Failed to save image ${i + 1}. Please try again.`);
        setIsUploading(false);
        return;
      }
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

  const isFree = tierInfo?.tierKey === "free";
  const isUnlimited = tierInfo && tierInfo.limit === -1;
  const usagePercentage = tierInfo && !isUnlimited
    ? (tierInfo.currentCount / tierInfo.limit) * 100
    : 0;

  return (
    <>
      {/* Tier Usage Notice Banner */}
      {tierInfo && isFree && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">
                  {tierInfo.tierName} Plan - Gallery Limit
                </h3>
              </div>
              <p className="text-sm text-purple-700 mb-3">
                You're using {tierInfo.currentCount} of {tierInfo.limit} gallery images
              </p>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    usagePercentage >= 90
                      ? "bg-red-500"
                      : usagePercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-purple-500"
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              {usagePercentage >= 90 && (
                <p className="text-sm text-purple-700 font-medium">
                  You're close to your limit! Upgrade to Pro for 500 images.
                </p>
              )}
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

      {/* Error/Upgrade Prompt */}
      {error && showUpgradePrompt && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Upload Limit Reached</h3>
              </div>
              <p className="text-sm text-red-700 mb-3">{error}</p>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}

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
                  <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                        {showUpgradePrompt && (
                          <Link
                            href="/dashboard/settings"
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Crown className="w-4 h-4" />
                            Upgrade to Pro
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
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

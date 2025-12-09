"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";

export function ServiceEditForm({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  const t = useTranslations("servicesForm");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description ?? "",
    duration_minutes: service.duration_minutes,
    price: service.price,
    category: service.category ?? "",
    image_url: service.image_url ?? "",
    images: (service as any).images ?? [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase
        .from("services")
        .update({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          duration_minutes: Number(formData.duration_minutes),
          category: formData.category,
          image_url: formData.image_url,
          images: formData.images,
        })
        .eq("id", service.id);

      if (error) {
        setError(error.message);
        return;
      }

      onClose();
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            {t("serviceName")} *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input mt-1"
            placeholder={t("serviceNamePlaceholder")}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="label">
            {t("categoryOptional")}
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="input mt-1"
            placeholder={t("categoryPlaceholder")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="label">
          {t("descriptionOptional")}
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input mt-1"
          rows={2}
          placeholder={t("descriptionPlaceholder")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="duration" className="label">
            {t("durationMinutes")} *
          </label>
          <input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) =>
              setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
            }
            className="input mt-1"
            min={5}
            step={5}
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="label">
            {t("priceLabel")} *
          </label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="input mt-1"
            min={0}
            step={0.01}
            placeholder={t("pricePlaceholder")}
            required
          />
        </div>
      </div>

      <div>
        <label className="label mb-2 block">
          {t("imageOptional")}
        </label>
        <MultiImageUpload
          value={formData.images}
          onChange={(images) => setFormData({ ...formData, images, image_url: images[0] || "" })}
          folder="services"
          maxImages={5}
          aspectRatio="square"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
          {tCommon("cancel")}
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
          {loading ? tCommon("saving") : t("saveChanges")}
        </button>
      </div>
    </form>
  );
}

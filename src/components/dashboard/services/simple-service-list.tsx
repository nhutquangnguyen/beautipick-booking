"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight, Scissors } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";

export function SimpleServiceList({ services }: { services: Service[] }) {
  const t = useTranslations("servicesForm");
  const tCommon = useTranslations("common");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const getServiceImageUrl = (service: Service): string | null => {
    const images = (service as any).images;
    const imageKey = images && images.length > 0 ? images[0] : service.image_url;

    if (!imageKey) return null;
    if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
      return imageKey;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(imageKey);
    return data.publicUrl;
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDeletePermanent"))) return;
    await supabase.from("services").delete().eq("id", id);
    router.refresh();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("services").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    await supabase
      .from("services")
      .update({
        name: editingService.name,
        price: editingService.price,
        duration_minutes: editingService.duration_minutes,
        description: editingService.description,
        category: editingService.category,
        image_url: editingService.image_url,
        images: (editingService as any).images || [],
      })
      .eq("id", editingService.id);

    setEditingService(null);
    router.refresh();
  };

  return (
    <>
      <div className="space-y-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`rounded-xl border bg-white p-4 transition-all ${
              service.is_active ? "border-gray-200" : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Service Avatar */}
              {getServiceImageUrl(service) ? (
                <img
                  src={getServiceImageUrl(service)!}
                  alt={service.name}
                  className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                  <Scissors className="h-5 w-5 text-purple-600" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${service.is_active ? "text-gray-900" : "text-gray-500"}`}>
                    {service.name}
                  </h3>
                  {!service.is_active && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                      {t("hidden")}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span>{formatDuration(service.duration_minutes)}</span>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(service.price)}
                  </span>
                  {service.category && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span>{service.category}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setOpenMenu(openMenu === service.id ? null : service.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {openMenu === service.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMenu(null)}
                    />
                    <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        onClick={() => {
                          setEditingService(service);
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        {t("edit")}
                      </button>
                      <button
                        onClick={() => {
                          toggleActive(service.id, service.is_active);
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {service.is_active ? (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            {t("hideFromBooking")}
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            {t("showOnBooking")}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(service.id);
                          setOpenMenu(null);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("delete")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="text-xl font-bold text-gray-900">{t("editService")}</h2>

            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("serviceName")}
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  placeholder={t("serviceNamePlaceholder")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("durationMinutes")}
                  </label>
                  <input
                    type="number"
                    value={editingService.duration_minutes}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration_minutes: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                    min={5}
                    step={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("priceLabel")}
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                    min={0}
                    step={0.01}
                    placeholder={t("pricePlaceholder")}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("categoryOptional")}
                </label>
                <input
                  type="text"
                  value={editingService.category || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  placeholder={t("categoryPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("descriptionOptional")}
                </label>
                <textarea
                  value={editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none resize-y"
                  rows={3}
                  placeholder={t("descriptionPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("imageOptional")}
                </label>
                <MultiImageUpload
                  value={(editingService as any).images || []}
                  onChange={(images) =>
                    setEditingService({ ...editingService, images: images as any, image_url: images[0] })
                  }
                  folder="services"
                  maxImages={5}
                  aspectRatio="square"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  {tCommon("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                >
                  {t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

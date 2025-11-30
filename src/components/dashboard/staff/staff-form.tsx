"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export function StaffForm({
  merchantId,
  services,
}: {
  merchantId: string;
  services: { id: string; name: string }[];
}) {
  const t = useTranslations("staffForm");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .insert({
          merchant_id: merchantId,
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          bio: formData.bio || null,
        })
        .select()
        .single();

      if (staffError) {
        setError(staffError.message);
        return;
      }

      // Add staff services
      if (selectedServices.length > 0 && staffData) {
        await supabase.from("staff_services").insert(
          selectedServices.map((serviceId) => ({
            staff_id: staffData.id,
            service_id: serviceId,
          }))
        );
      }

      setFormData({ name: "", email: "", phone: "", bio: "" });
      setSelectedServices([]);
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary btn-md">
        <Plus className="mr-2 h-4 w-4" />
        {t("addStaff")}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t("addStaffMember")}</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div>
            <label htmlFor="name" className="label">
              {t("name")} *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input mt-1"
              placeholder={t("namePlaceholder")}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="label">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input mt-1"
                placeholder={t("emailPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                {t("phone")}
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input mt-1"
                placeholder={t("phonePlaceholder")}
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="label">
              {t("bio")}
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="input mt-1"
              rows={2}
              placeholder={t("bioPlaceholder")}
            />
          </div>

          {services.length > 0 && (
            <div>
              <label className="label">{t("services")}</label>
              <p className="mb-2 text-xs text-gray-500">
                {t("servicesDesc")}
              </p>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                      selectedServices.includes(service.id)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary btn-md"
            >
              {t("cancel")}
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-md">
              {loading ? t("adding") : t("addStaff")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

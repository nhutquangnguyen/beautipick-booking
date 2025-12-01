"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Merchant } from "@/types/database";

export function ContactLocationForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("contactLocation");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    phone: merchant.phone ?? "",
    address: merchant.address ?? "",
    city: merchant.city ?? "",
    state: merchant.state ?? "",
    zip_code: merchant.zip_code ?? "",
    google_maps_url: merchant.google_maps_url ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({
          phone: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          zip_code: formData.zip_code || null,
          google_maps_url: formData.google_maps_url || null,
        })
        .eq("id", merchant.id);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900">{t("contactInfo")}</h3>
          <div>
            <label className="label">{t("phone")}</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input mt-1"
              placeholder={t("phonePlaceholder")}
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900">{t("location")}</h3>

          <div>
            <label className="label">{t("address")}</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input mt-1"
              placeholder={t("addressPlaceholder")}
            />
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            <div>
              <label className="label">{t("city")}</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">{t("state")}</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">{t("zipCode")}</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="input mt-1"
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("googleMapsLink")}
            </label>
            <input
              type="url"
              value={formData.google_maps_url}
              onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
              className="input mt-1"
              placeholder={t("googleMapsUrlPlaceholder")}
            />
            <p className="mt-2 text-xs text-gray-500">
              {t("googleMapsUrlDesc")}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-md">
            {loading ? t("saving") : t("saveChanges")}
          </button>
          {success && <span className="text-sm text-green-600">{t("saved")}</span>}
        </div>
      </form>
    </div>
  );
}

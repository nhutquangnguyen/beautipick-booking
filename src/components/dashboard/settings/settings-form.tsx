"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, MerchantSettings } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

export function SettingsForm({
  merchant,
  settings,
}: {
  merchant: Merchant;
  settings: MerchantSettings;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(merchant.logo_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(merchant.cover_image_url);

  const [businessInfo, setBusinessInfo] = useState({
    business_name: merchant.business_name,
    slug: merchant.slug,
    description: merchant.description ?? "",
    phone: merchant.phone ?? "",
    address: merchant.address ?? "",
    city: merchant.city ?? "",
    state: merchant.state ?? "",
    zip_code: merchant.zip_code ?? "",
    timezone: merchant.timezone,
    currency: merchant.currency,
  });

  const [bookingSettings, setBookingSettings] = useState<MerchantSettings>(settings);

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({
          ...businessInfo,
          logo_url: logoUrl,
          cover_image_url: coverUrl,
          description: businessInfo.description || null,
          phone: businessInfo.phone || null,
          address: businessInfo.address || null,
          city: businessInfo.city || null,
          state: businessInfo.state || null,
          zip_code: businessInfo.zip_code || null,
        })
        .eq("id", merchant.id);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({ settings: bookingSettings })
        .eq("id", merchant.id);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Logo & Cover Images */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Logo & Cover Image</h2>
        <p className="mt-1 text-sm text-gray-500">These images will appear on your public booking page</p>

        <div className="mt-6 space-y-6">
          {/* Cover Image */}
          <div>
            <label className="label mb-2">Cover Image</label>
            <ImageUpload
              value={coverUrl}
              onChange={setCoverUrl}
              folder={`merchants/${merchant.id}/cover`}
              aspectRatio="cover"
              placeholder="Upload cover image"
            />
            <p className="mt-2 text-xs text-gray-500">Recommended: 1200 x 400 pixels</p>
          </div>

          {/* Logo */}
          <div>
            <label className="label mb-2">Logo / Avatar</label>
            <ImageUpload
              value={logoUrl}
              onChange={setLogoUrl}
              folder={`merchants/${merchant.id}/logo`}
              aspectRatio="square"
              placeholder="Upload logo"
            />
            <p className="mt-2 text-xs text-gray-500">Recommended: 200 x 200 pixels</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Business Information</h2>
        <form onSubmit={handleBusinessSubmit} className="mt-4 sm:mt-6 space-y-4">
          <div>
            <label className="label">Business Name</label>
            <input
              type="text"
              value={businessInfo.business_name}
              onChange={(e) => {
                setBusinessInfo({
                  ...businessInfo,
                  business_name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="input mt-1"
              required
            />
          </div>
          <div>
            <label className="label">Booking Page URL</label>
            <div className="mt-1 flex flex-col sm:flex-row">
              <span className="flex items-center rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-b-0 sm:border-b sm:border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {process.env.NEXT_PUBLIC_APP_URL || ""}/
              </span>
              <input
                type="text"
                value={businessInfo.slug}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, slug: generateSlug(e.target.value) })
                }
                className="input rounded-t-none sm:rounded-l-none sm:rounded-tr-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
              className="input mt-1"
              rows={5}
              placeholder="Tell customers about your business..."
            />
          </div>

          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              className="input mt-1"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="label">Address</label>
            <input
              type="text"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              className="input mt-1"
              placeholder="123 Main St"
            />
          </div>

          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={businessInfo.city}
                onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div>
              <label className="label">State</label>
              <input
                type="text"
                value={businessInfo.state}
                onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                className="input mt-1"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="label">ZIP Code</label>
              <input
                type="text"
                value={businessInfo.zip_code}
                onChange={(e) => setBusinessInfo({ ...businessInfo, zip_code: e.target.value })}
                className="input mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="label">Timezone</label>
              <select
                value={businessInfo.timezone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, timezone: e.target.value })}
                className="input mt-1"
              >
                <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
                <option value="America/New_York">Eastern (US)</option>
                <option value="America/Chicago">Central (US)</option>
                <option value="America/Denver">Mountain (US)</option>
                <option value="America/Los_Angeles">Pacific (US)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Singapore">Singapore (GMT+8)</option>
              </select>
            </div>
            <div>
              <label className="label">Currency</label>
              <select
                value={businessInfo.currency}
                onChange={(e) => setBusinessInfo({ ...businessInfo, currency: e.target.value })}
                className="input mt-1"
              >
                <option value="USD">USD ($)</option>
                <option value="VND">VND (₫)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full sm:w-auto">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {success && (
              <span className="text-sm text-green-600">Saved!</span>
            )}
          </div>
        </form>
      </div>

      {/* Booking Settings */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Booking Settings</h2>
        <form onSubmit={handleSettingsSubmit} className="mt-4 sm:mt-6 space-y-4">
          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="label">Lead Time (hrs)</label>
              <input
                type="number"
                value={bookingSettings.bookingLeadTime}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    bookingLeadTime: parseInt(e.target.value),
                  })
                }
                className="input mt-1"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500 hidden sm:block">
                How far in advance customers must book
              </p>
            </div>
            <div>
              <label className="label">Window (days)</label>
              <input
                type="number"
                value={bookingSettings.bookingWindow}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    bookingWindow: parseInt(e.target.value),
                  })
                }
                className="input mt-1"
                min={1}
              />
              <p className="mt-1 text-xs text-gray-500 hidden sm:block">
                How far ahead customers can book
              </p>
            </div>
          </div>

          <div>
            <label className="label">Cancellation Policy</label>
            <textarea
              value={bookingSettings.cancellationPolicy}
              onChange={(e) =>
                setBookingSettings({ ...bookingSettings, cancellationPolicy: e.target.value })
              }
              className="input mt-1"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.showStaffSelection}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, showStaffSelection: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Allow customers to select staff</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.requirePhoneNumber}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, requirePhoneNumber: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Require phone number</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.allowNotes}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, allowNotes: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Allow booking notes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.confirmationEmailEnabled}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    confirmationEmailEnabled: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Send confirmation emails</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.reminderEmailEnabled}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    reminderEmailEnabled: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Send reminder emails</span>
            </label>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary btn-md w-full sm:w-auto">
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      {/* Account */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Account</h2>
        <p className="mt-1 text-sm text-gray-500">Sign out of your account</p>
        <div className="mt-4 sm:mt-6">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

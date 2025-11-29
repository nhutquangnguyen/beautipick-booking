"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Staff } from "@/types/database";

type StaffWithServices = Staff & {
  staff_services: { service_id: string }[];
};

export function StaffEditForm({
  staff,
  services,
  onClose,
}: {
  staff: StaffWithServices;
  services: { id: string; name: string }[];
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    staff.staff_services.map((ss) => ss.service_id)
  );
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: staff.name,
    email: staff.email ?? "",
    phone: staff.phone ?? "",
    bio: staff.bio ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("staff")
        .update({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          bio: formData.bio || null,
        })
        .eq("id", staff.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Update staff services
      await supabase.from("staff_services").delete().eq("staff_id", staff.id);

      if (selectedServices.length > 0) {
        await supabase.from("staff_services").insert(
          selectedServices.map((serviceId) => ({
            staff_id: staff.id,
            service_id: serviceId,
          }))
        );
      }

      onClose();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div>
        <label htmlFor="name" className="label">
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input mt-1"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input mt-1"
          />
        </div>

        <div>
          <label htmlFor="phone" className="label">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input mt-1"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="label">
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="input mt-1"
          rows={2}
        />
      </div>

      {services.length > 0 && (
        <div>
          <label className="label">Services</label>
          <div className="mt-2 flex flex-wrap gap-2">
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

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary btn-sm">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

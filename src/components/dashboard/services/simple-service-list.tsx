"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";
import { formatCurrency, formatDuration } from "@/lib/utils";

export function SimpleServiceList({ services }: { services: Service[] }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-medium ${service.is_active ? "text-gray-900" : "text-gray-500"}`}>
                    {service.name}
                  </h3>
                  {!service.is_active && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                      Hidden
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

              <div className="relative">
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
                        Edit
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
                            Hide from booking
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            Show on booking
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
                        Delete
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
            <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>

            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({ ...editingService, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (mins)
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
                    Price ($)
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
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category (optional)
                </label>
                <input
                  type="text"
                  value={editingService.category || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., Hair, Nails"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Service } from "@/types/database";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { ServiceEditForm } from "./service-edit-form";

export function ServiceList({ services }: { services: Service[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setDeleting(id);
    await supabase.from("services").delete().eq("id", id);
    router.refresh();
    setDeleting(null);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("services").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  };

  if (services.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">No services yet. Add your first service to get started.</p>
      </div>
    );
  }

  return (
    <div className="card divide-y">
      {services.map((service) => (
        <div key={service.id}>
          {editingId === service.id ? (
            <ServiceEditForm
              service={service}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <div className="flex items-center gap-4 p-4">
              <div className="cursor-move text-gray-400">
                <GripVertical className="h-5 w-5" />
              </div>

              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{service.name}</h3>
                  {!service.is_active && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      Inactive
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">
                    {service.description}
                  </p>
                )}
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                  <span>{formatDuration(service.duration_minutes)}</span>
                  <span>•</span>
                  <span>{formatCurrency(service.price)}</span>
                  {service.category && (
                    <>
                      <span>•</span>
                      <span>{service.category}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(service.id, service.is_active)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    service.is_active ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      service.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setEditingId(service.id)}
                  className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deleting === service.id}
                  className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

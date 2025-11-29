"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Staff } from "@/types/database";
import { StaffEditForm } from "./staff-edit-form";

type StaffWithServices = Staff & {
  staff_services: { service_id: string }[];
};

export function StaffList({
  staff,
  services,
}: {
  staff: StaffWithServices[];
  services: { id: string; name: string }[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    setDeleting(id);
    await supabase.from("staff_services").delete().eq("staff_id", id);
    await supabase.from("staff").delete().eq("id", id);
    router.refresh();
    setDeleting(null);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("staff").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  };

  if (staff.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">
          No staff members yet. Add your first team member to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {staff.map((member) => (
        <div key={member.id} className="card">
          {editingId === member.id ? (
            <StaffEditForm
              staff={member}
              services={services}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-medium text-purple-600">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    {!member.is_active && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>
                  {member.email && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </div>
                  )}
                  {member.phone && (
                    <div className="mt-0.5 flex items-center gap-1 text-sm text-gray-500">
                      <Phone className="h-3 w-3" />
                      {member.phone}
                    </div>
                  )}
                </div>
              </div>

              {member.bio && (
                <p className="mt-3 text-sm text-gray-600 line-clamp-2">{member.bio}</p>
              )}

              {member.staff_services.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.staff_services.slice(0, 3).map(({ service_id }) => {
                    const service = services.find((s) => s.id === service_id);
                    return service ? (
                      <span
                        key={service_id}
                        className="rounded bg-purple-50 px-2 py-0.5 text-xs text-purple-600"
                      >
                        {service.name}
                      </span>
                    ) : null;
                  })}
                  {member.staff_services.length > 3 && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      +{member.staff_services.length - 3} more
                    </span>
                  )}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <button
                  onClick={() => toggleActive(member.id, member.is_active)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    member.is_active ? "bg-purple-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      member.is_active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingId(member.id)}
                    className="rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    disabled={deleting === member.id}
                    className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

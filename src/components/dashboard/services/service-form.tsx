"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ServiceForm({ merchantId }: { merchantId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_minutes: 60,
    price: 0,
    category: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.from("services").insert({
        merchant_id: merchantId,
        ...formData,
        price: Number(formData.price),
        duration_minutes: Number(formData.duration_minutes),
      });

      if (error) {
        setError(error.message);
        return;
      }

      setFormData({
        name: "",
        description: "",
        duration_minutes: 60,
        price: 0,
        category: "",
      });
      setIsOpen(false);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn btn-primary btn-md">
        <Plus className="mr-2 h-4 w-4" />
        Add Service
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="card w-full max-w-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Add New Service</h2>
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
              Service Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input mt-1"
              placeholder="e.g., Haircut"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input mt-1"
              rows={3}
              placeholder="Describe this service..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="duration" className="label">
                Duration (minutes) *
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
                Price ($) *
              </label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="input mt-1"
                min={0}
                step={0.01}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input mt-1"
              placeholder="e.g., Hair, Nails, Skincare"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn btn-secondary btn-md"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-md">
              {loading ? "Adding..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

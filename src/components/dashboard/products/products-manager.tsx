"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ShoppingBag, MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  display_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export function ProductsManager({
  merchantId,
  products,
}: {
  merchantId: string;
  products: Product[];
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
  });

  const resetForm = () => {
    setFormData({ name: "", description: "", price: 0, image_url: "" });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("products").insert({
      merchant_id: merchantId,
      name: formData.name,
      description: formData.description || null,
      price: formData.price,
      image_url: formData.image_url || null,
    });
    resetForm();
    setShowAddModal(false);
    setLoading(false);
    router.refresh();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setLoading(true);
    await supabase
      .from("products")
      .update({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image_url: editingProduct.image_url,
      })
      .eq("id", editingProduct.id);
    setEditingProduct(null);
    setLoading(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    router.refresh();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from("products").update({ is_active: !isActive }).eq("id", id);
    router.refresh();
  };

  return (
    <>
      {products.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
              Add Product
            </button>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className={`rounded-xl border bg-white p-4 transition-all ${
                  product.is_active ? "border-gray-200" : "border-gray-100 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  {product.display_url ? (
                    <img
                      src={product.display_url}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${product.is_active ? "text-gray-900" : "text-gray-500"}`}>
                        {product.name}
                      </h3>
                      {!product.is_active && (
                        <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                          Hidden
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-500 truncate">{product.description}</p>
                    )}
                    <p className="font-medium text-gray-900">{formatCurrency(product.price)}</p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {openMenu === product.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              toggleActive(product.id, product.is_active);
                              setOpenMenu(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {product.is_active ? (
                              <>
                                <ToggleLeft className="h-4 w-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4" />
                                Show
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(product.id);
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
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products yet</h3>
          <p className="mt-2 text-gray-500">
            Sell products like hair care, skincare, or gift cards
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add products that complement your services, like professional
          hair care products or skincare items your customers can purchase.
        </p>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Product</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., Moroccan Oil Treatment"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  min={0}
                  step={0.01}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  rows={2}
                  placeholder="Brief description of the product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  placeholder="https://example.com/product.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={editingProduct.price || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value ? parseFloat(e.target.value) : 0 })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  min={0}
                  step={0.01}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={editingProduct.description || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={editingProduct.image_url || ""}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteMerchantModalProps {
  merchant: {
    id: string;
    email: string;
    business_name: string;
    total_bookings: number;
    total_customers: number;
    total_services: number;
    total_products: number;
  };
  onClose: () => void;
}

export function DeleteMerchantModal({ merchant, onClose }: DeleteMerchantModalProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== merchant.business_name) {
      setError("Business name does not match");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/delete-merchant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId: merchant.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to delete merchant");
      }

      // Close modal
      onClose();

      // Refresh the page
      router.refresh();

      // Show success (optional - you could use a toast notification here)
      alert("Merchant deleted successfully");
    } catch (err) {
      console.error("Error deleting merchant:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Merchant
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-2">
                  You are about to permanently delete this merchant:
                </p>
                <p className="font-medium text-red-900">
                  {merchant.business_name} ({merchant.email})
                </p>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-3">
              This will permanently delete:
            </p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span><strong>{merchant.total_services}</strong> services</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span><strong>{merchant.total_products}</strong> products</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span><strong>{merchant.total_bookings}</strong> bookings/orders</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span><strong>{merchant.total_customers}</strong> customer records</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>All gallery images</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>All staff members</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>Business settings and configuration</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                <span>Subscription information</span>
              </li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
              To confirm, type the business name: <span className="font-bold text-gray-900">{merchant.business_name}</span>
            </label>
            <input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              placeholder="Enter business name"
              disabled={isDeleting}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors disabled:opacity-50 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== merchant.business_name}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

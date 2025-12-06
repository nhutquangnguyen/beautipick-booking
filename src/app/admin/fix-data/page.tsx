"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FixDataPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFixUsage = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/fix-usage", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fix usage");
      }

      setResult(data);

      // Refresh the admin page to show updated data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fix Merchant Usage Data</h1>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-yellow-900 mb-2">⚠️ What this does:</h2>
        <p className="text-sm text-yellow-800">
          This will recalculate usage counts for all merchants by:
        </p>
        <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 space-y-1">
          <li>Counting actual services from the services table</li>
          <li>Counting actual products from the products table</li>
          <li>Counting gallery images from merchants.settings JSON</li>
          <li>Updating the subscription_usage table with correct counts</li>
        </ul>
      </div>

      <button
        onClick={handleFixUsage}
        disabled={loading}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        {loading ? "Fixing..." : "Fix All Merchant Usage Data"}
      </button>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">✓ Success!</h3>
          <p className="text-sm text-green-800 mb-4">{result.message}</p>

          <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold mb-2">Results:</h4>
            <div className="space-y-2">
              {result.results?.map((r: any, i: number) => (
                <div
                  key={i}
                  className={`p-2 rounded text-sm ${
                    r.success ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="font-medium">{r.email}</div>
                  {r.success ? (
                    <div className="text-xs text-gray-600 mt-1">
                      Services: {r.counts.services}, Products: {r.counts.products}, Gallery: {r.counts.gallery}
                    </div>
                  ) : (
                    <div className="text-xs text-red-600 mt-1">{r.error}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

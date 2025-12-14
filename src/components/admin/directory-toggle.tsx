"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface DirectoryToggleProps {
  merchantId: string;
  merchantName: string;
  initialValue: boolean;
  onToggle?: (newValue: boolean) => void;
}

export function DirectoryToggle({
  merchantId,
  merchantName,
  initialValue,
  onToggle,
}: DirectoryToggleProps) {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const newValue = !isEnabled;

    try {
      const response = await fetch("/api/admin/toggle-directory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId,
          showInDirectory: newValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update directory visibility");
      }

      setIsEnabled(newValue);
      onToggle?.(newValue);

      // Show success feedback
      console.log(`${merchantName}: Directory listing ${newValue ? "enabled" : "disabled"}`);
    } catch (error) {
      console.error("Error toggling directory visibility:", error);
      alert("Failed to update directory visibility. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${isEnabled ? "bg-purple-600" : "bg-gray-300"}
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
      `}
      title={isEnabled ? "Hide from directory" : "Show in directory"}
    >
      <span
        className={`
          inline-flex h-4 w-4 items-center justify-center transform rounded-full bg-white transition-transform
          ${isEnabled ? "translate-x-6" : "translate-x-1"}
        `}
      >
        {isEnabled ? (
          <Eye className="h-3 w-3 text-purple-600" />
        ) : (
          <EyeOff className="h-3 w-3 text-gray-400" />
        )}
      </span>
    </button>
  );
}

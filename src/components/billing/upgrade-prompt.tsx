"use client";

import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

interface UpgradePromptProps {
  feature: "services" | "products" | "gallery";
  onClose?: () => void;
}

export function UpgradePrompt({ feature, onClose }: UpgradePromptProps) {
  const t = useTranslations("billing");

  const featureKey = `${feature}Limit`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("upgradePromptTitle")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("upgradePromptMessage", { feature: t(featureKey) })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t("cancel", { defaultValue: "Cancel" })}
              </button>
              <button
                onClick={() => {
                  // In the future, this will redirect to payment page
                  // For now, show contact admin message
                  alert(t("contactAdmin"));
                  onClose?.();
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t("upgradeToPro")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

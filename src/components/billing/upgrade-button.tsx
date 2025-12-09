"use client";

import { useTranslations } from "next-intl";

export function UpgradeButton() {
  const t = useTranslations("billing");

  return (
    <button
      onClick={() => alert(t("contactAdmin"))}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
    >
      {t("upgradeNow")}
    </button>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { RevenueOverTimeChart } from "./charts";

interface RevenueChartData {
  date: string;
  revenue: number;
}

type TimePeriod = "7days" | "30days" | "90days" | "thisMonth" | "lastMonth";

interface RevenueAnalyticsProps {
  currency: string;
  allRevenueData: RevenueChartData[];
}

export function RevenueAnalytics({
  currency,
  allRevenueData,
}: RevenueAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30days");
  const t = useTranslations("dashboard");

  // Filter data based on selected period
  const revenueData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    let endDate: Date | null = null;

    switch (selectedPeriod) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(now.getDate() - 90);
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "lastMonth":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
    }

    return allRevenueData.filter((item) => {
      const itemDate = new Date(item.date);
      if (endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      }
      return itemDate >= startDate;
    });
  }, [selectedPeriod, allRevenueData]);

  const periodOptions: { value: TimePeriod; label: string }[] = [
    { value: "7days", label: t("period7days") },
    { value: "30days", label: t("period30days") },
    { value: "90days", label: t("period90days") },
    { value: "thisMonth", label: t("periodThisMonth") },
    { value: "lastMonth", label: t("periodLastMonth") },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Header with Time Period Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {t("revenueAnalytics")}
        </h2>
        <div className="flex gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPeriod(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                selectedPeriod === option.value
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <RevenueOverTimeChart
        data={revenueData}
        currency={currency}
        title={t("revenueOverTime")}
      />
    </div>
  );
}

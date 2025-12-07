"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { RevenueOverTimeChart, RevenueByItemChart } from "./charts";

interface RevenueChartData {
  date: string;
  revenue: number;
}

interface RevenueByItemData {
  name: string;
  revenue: number;
}

interface BookingData {
  booking_date: string;
  total_price: number;
  services: { name: string } | { name: string }[] | null;
}

type TimePeriod = "7days" | "30days" | "90days" | "thisMonth" | "lastMonth";
type ItemType = "all" | "services" | "products";

interface RevenueAnalyticsProps {
  currency: string;
  allRevenueData: RevenueChartData[];
  bookingsData: BookingData[];
}

export function RevenueAnalytics({
  currency,
  allRevenueData,
  bookingsData,
}: RevenueAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("30days");
  const [selectedItemType, setSelectedItemType] = useState<ItemType>("all");
  const t = useTranslations("dashboard");

  // Filter data based on selected period - use useMemo to ensure recalculation
  const { revenueData, itemData } = useMemo(() => {
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

    // Filter revenue data
    const filteredRevenueData = allRevenueData.filter((item) => {
      const itemDate = new Date(item.date);
      if (endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      }
      return itemDate >= startDate;
    });

    // Filter bookings for the same period and recalculate revenue by item
    const filteredBookings = bookingsData.filter((booking) => {
      const bookingDate = new Date(booking.booking_date);
      if (endDate) {
        return bookingDate >= startDate && bookingDate <= endDate;
      }
      return bookingDate >= startDate;
    });

    // Calculate revenue by service/product for filtered period
    const revenueByItem: Record<string, number> = {};
    filteredBookings.forEach((booking) => {
      let itemName = "Other";
      if (booking.services) {
        if (Array.isArray(booking.services)) {
          itemName = booking.services[0]?.name || "Other";
        } else {
          itemName = booking.services.name || "Other";
        }
      }
      revenueByItem[itemName] = (revenueByItem[itemName] || 0) + (booking.total_price || 0);
    });

    // Sort by revenue descending
    const itemData = Object.entries(revenueByItem)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10

    // Filter by item type (all/services/products)
    let finalItemData = itemData;
    if (selectedItemType === "services") {
      // For now, filter out "Other" which typically represents products
      finalItemData = itemData.filter(item => item.name !== "Other");
    } else if (selectedItemType === "products") {
      // For now, only show "Other" which typically represents products
      finalItemData = itemData.filter(item => item.name === "Other");
    }

    return {
      revenueData: filteredRevenueData,
      itemData: finalItemData,
    };
  }, [selectedPeriod, selectedItemType, allRevenueData, bookingsData]);

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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RevenueOverTimeChart
          data={revenueData}
          currency={currency}
          title={t("revenueOverTime")}
        />
        <RevenueByItemChart
          data={itemData}
          currency={currency}
          title={t("topServices")}
          itemTypeFilter={selectedItemType}
          onItemTypeChange={setSelectedItemType}
        />
      </div>
    </div>
  );
}

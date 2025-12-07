"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface RevenueChartData {
  date: string;
  revenue: number;
}

interface RevenueByItemData {
  name: string;
  revenue: number;
}

export function RevenueOverTimeChart({
  data,
  currency,
  title,
}: {
  data: RevenueChartData[];
  currency: string;
  title: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value, currency)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const date = new Date(data.date);
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-base font-semibold text-purple-600">
                      {formatCurrency(data.revenue, currency)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueByItemChart({
  data,
  currency,
  title,
  itemTypeFilter,
  onItemTypeChange,
}: {
  data: RevenueByItemData[];
  currency: string;
  title: string;
  itemTypeFilter?: "all" | "services" | "products";
  onItemTypeChange?: (type: "all" | "services" | "products") => void;
}) {
  const t = useTranslations("dashboard");
  // Ensure we only show top 10
  const topData = data.slice(0, 10);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Header with title and dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {itemTypeFilter && onItemTypeChange && (
          <select
            value={itemTypeFilter}
            onChange={(e) => onItemTypeChange(e.target.value as "all" | "services" | "products")}
            className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">{t("itemTypeAll")}</option>
            <option value="services">{t("itemTypeServices")}</option>
            <option value="products">{t("itemTypeProducts")}</option>
          </select>
        )}
      </div>
      {topData.length > 0 ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={topData} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value, currency)}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {data.name}
                      </p>
                      <p className="text-base font-semibold text-blue-600">
                        {formatCurrency(data.revenue, currency)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No revenue data available</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { MapPin, Tag, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFiltersProps {
  cities: string[];
  tags: string[];
  selectedCity?: string;
  selectedTag?: string;
  selectedSort?: string;
}

export function SearchFilters({
  cities,
  tags,
  selectedCity = "",
  selectedTag = "",
  selectedSort = "name",
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <MapPin className="h-4 w-4" />
          Thành phố
        </div>
        <div className="space-y-2">
          <button
            onClick={() => updateFilter("city", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCity
                ? "bg-purple-50 text-purple-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </button>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => updateFilter("city", city)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCity === city
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <Tag className="h-4 w-4" />
          Dịch vụ
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateFilter("tag", selectedTag === tag ? "" : tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <ArrowUpDown className="h-4 w-4" />
          Sắp xếp
        </div>
        <select
          value={selectedSort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="relevance">Phù hợp nhất</option>
          <option value="name">Tên A-Z</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(selectedCity || selectedTag || selectedSort !== "relevance") && (
        <button
          onClick={() => router.push("/search")}
          className="w-full px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}

"use client";

import { X, Filter } from "lucide-react";
import { useState } from "react";
import { SearchFilters } from "./SearchFilters";

interface MobileFiltersProps {
  cities: string[];
  tags: string[];
  selectedCity?: string;
  selectedTag?: string;
  selectedSort?: string;
}

export function MobileFilters({
  cities,
  tags,
  selectedCity,
  selectedTag,
  selectedSort,
}: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition"
      >
        <Filter className="h-4 w-4" />
        Bộ lọc
        {(selectedCity || selectedTag || selectedSort !== "relevance") && (
          <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {[selectedCity, selectedTag, selectedSort !== "relevance" ? "1" : ""].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto p-4">
              <SearchFilters
                cities={cities}
                tags={tags}
                selectedCity={selectedCity}
                selectedTag={selectedTag}
                selectedSort={selectedSort}
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

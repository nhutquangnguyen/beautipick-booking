"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SearchSuggestion {
  id: string;
  business_name: string;
  city: string;
  slug: string;
}

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load popular searches on mount
  useEffect(() => {
    fetch("/api/search/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.searches) {
          setPopularSearches(data.searches.map((s: any) => s.query).slice(0, 5));
        }
      })
      .catch(console.error);
  }, []);

  // Debounced autocomplete
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search/autocomplete?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      // Log search analytics (fire and forget)
      fetch("/api/search/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_query: trimmedQuery,
          results_count: 0, // Will be updated on search results page
        }),
      }).catch(console.error);

      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowSuggestions(false);
    } else {
      router.push("/search");
    }
  };

  const handleSuggestionClick = async (slug: string, merchantId: string) => {
    // Log that user selected this merchant from search
    if (query.trim()) {
      fetch("/api/search/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search_query: query.trim(),
          results_count: suggestions.length,
          selected_merchant_id: merchantId,
        }),
      }).catch(console.error);
    }

    router.push(`/${slug}`);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Tìm theo tên salon, dịch vụ..."
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
              autoComplete="off"
            />
            {isLoading && (
              <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
            )}
          </div>

          {/* Autocomplete Suggestions or Popular Searches */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
              {suggestions.length > 0 ? (
                // Show autocomplete suggestions
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.slug, suggestion.id)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.business_name}
                    </div>
                    {suggestion.city && (
                      <div className="text-sm text-gray-500 mt-1">
                        {suggestion.city}
                      </div>
                    )}
                  </button>
                ))
              ) : query.trim().length === 0 && popularSearches.length > 0 ? (
                // Show popular searches when no query
                <>
                  <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                    Tìm kiếm phổ biến
                  </div>
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setQuery(search);
                        setShowSuggestions(false);
                        router.push(`/search?q=${encodeURIComponent(search)}`);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                    </button>
                  ))}
                </>
              ) : null}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition text-center"
        >
          Tìm kiếm
        </button>
      </form>
    </div>
  );
}

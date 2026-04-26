"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X } from "lucide-react";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface AddressSearchProps {
  onAddressSelect: (location: LocationData) => void;
  placeholder?: string;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

export default function AddressSearch({
  onAddressSelect,
  placeholder = "Search address...",
}: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState<NominatimResult | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  const searchAddress = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Prahari/1.0",
          },
        }
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Geocoding error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length >= 3) {
      debounceRef.current = setTimeout(() => {
        searchAddress(query);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchAddress]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: NominatimResult) => {
    setSelectedResult(result);
    setQuery(result.display_name);
    setShowResults(false);
    setResults([]);

    onAddressSelect({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    });
  };

  const handleClear = () => {
    setQuery("");
    setSelectedResult(null);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedResult(null);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full p-4 md:p-6 border-4 border-swiss-fg bg-swiss-muted focus:outline-none focus:bg-white focus:border-swiss-red font-bold text-sm tracking-tight transition-all placeholder:text-swiss-fg/20"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <div className="w-5 h-5 border-2 border-swiss-fg/30 border-t-swiss-fg rounded-full animate-spin" />
          )}
          {query && !selectedResult && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-swiss-fg/10 rounded transition-colors"
            >
              <X className="w-5 h-5 text-swiss-fg" />
            </button>
          )}
          {!query && (
            <Search className="w-5 h-5 text-swiss-fg/40" />
          )}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-[1000] w-full mt-1 bg-white border-4 border-swiss-fg max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={`${result.lat}-${result.lon}-${index}`}
              onClick={() => handleSelect(result)}
              className="w-full p-3 text-left hover:bg-swiss-red hover:text-white transition-colors border-b border-swiss-fg/10 last:border-b-0 flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-tight line-clamp-2">
                  {result.display_name}
                </p>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-60 mt-1">
                  {result.type}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 3 && results.length === 0 && !isLoading && (
        <div className="absolute z-[1000] w-full mt-1 bg-white border-4 border-swiss-fg p-4">
          <p className="text-xs font-bold text-swiss-fg/40 text-center">
            No addresses found
          </p>
        </div>
      )}
    </div>
  );
}
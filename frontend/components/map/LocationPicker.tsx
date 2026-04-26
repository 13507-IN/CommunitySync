"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, X, Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationChange: (location: LocationData) => void;
  initialLocation?: LocationData;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 md:h-80 bg-swiss-muted animate-pulse border-4 border-swiss-fg flex items-center justify-center">
      <p className="text-xs font-black tracking-widest uppercase text-swiss-fg/40">
        Loading map...
      </p>
    </div>
  ),
});

export default function LocationPicker({
  onLocationChange,
  initialLocation,
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.209]);
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setMapCenter([initialLocation.lat, initialLocation.lng]);
    }
  }, [initialLocation]);

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

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    onLocationChange(location);
  };

  const handleSelect = (result: NominatimResult) => {
    const location: LocationData = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setQuery("");
    setShowResults(false);
    setResults([]);
    onLocationChange(location);
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setQuery("");
    setResults([]);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: "Current Location",
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <InteractiveMap
          onLocationSelect={handleLocationSelect}
          initialLocation={selectedLocation || undefined}
          center={mapCenter}
          zoom={selectedLocation ? 15 : 12}
        />
        
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div ref={containerRef} className="relative">
            <div className="relative flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Search address..."
                className="flex-1 p-3 md:p-4 border-4 border-swiss-fg bg-white focus:outline-none focus:border-swiss-red font-bold text-sm tracking-tight shadow-lg"
              />
              <button
                onClick={handleUseCurrentLocation}
                className="p-3 md:p-4 bg-swiss-fg text-swiss-bg border-4 border-swiss-fg hover:bg-swiss-red transition-colors shadow-lg"
                title="Use current location"
              >
                <Navigation className="w-5 h-5" />
              </button>
              {selectedLocation && (
                <button
                  onClick={handleClear}
                  className="p-3 md:p-4 border-4 border-swiss-fg hover:bg-swiss-muted transition-colors shadow-lg"
                  title="Clear location"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {showResults && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border-4 border-swiss-fg max-h-64 overflow-y-auto shadow-lg"
                >
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
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {showResults && query.length >= 3 && results.length === 0 && !isLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-4 border-swiss-fg p-4 shadow-lg">
                <p className="text-xs font-bold text-swiss-fg/40 text-center">
                  No addresses found
                </p>
              </div>
            )}
          </div>
        </div>

        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000]">
            <div className="bg-white border-4 border-swiss-fg p-3 shadow-lg">
              <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/60 mb-1">
                SELECTED LOCATION
              </p>
              <p className="text-xs font-bold tracking-tight text-swiss-fg line-clamp-2">
                {selectedLocation.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, Navigation } from "lucide-react";

// Fix leaflet marker icons for webpack/next
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

export interface AddressDetails {
  road: string;
  neighbourhood?: string;
  city: string;
  state?: string;
  postcode?: string;
  formattedAddress: string;
}

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, addressDetails?: AddressDetails) => void;
  initialLocation?: { lat: number; lng: number };
}

function LocationMarker({ 
  position, 
  setPosition,
  onPick
}: { 
  position: L.LatLng | null; 
  setPosition: (p: L.LatLng) => void;
  onPick: (p: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPick(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

// Sub-component to handle map flying
function MapFlyer({ position }: { position: L.LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);
  return null;
}

export default function MapPicker({ onLocationSelect, initialLocation }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLocation ? new L.LatLng(initialLocation.lat, initialLocation.lng) : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [detectedAddress, setDetectedAddress] = useState<AddressDetails | null>(null);

  const defaultCenter: L.LatLngTuple = [20.5937, 78.9629]; // India

  const resolveAddress = async (lat: number, lng: number) => {
    setIsResolving(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = await response.json();
      const addr = data.address || {};
      const road = addr.road || addr.pedestrian || addr.street || addr.residential || addr.path || addr.suburb || "Local Roadway";
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || "";
      const neighbourhood = addr.neighbourhood || addr.suburb || "";
      const state = addr.state || "";
      const postcode = addr.postcode || "";

      const parts = [road, neighbourhood, city, state, postcode].filter(Boolean);
      const formattedAddress = parts.join(", ") || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      const details: AddressDetails = {
        road,
        neighbourhood,
        city,
        state,
        postcode,
        formattedAddress,
      };

      setDetectedAddress(details);
      onLocationSelect(lat, lng, details);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      onLocationSelect(lat, lng);
    } finally {
      setIsResolving(false);
    }
  };

  const handlePositionSelect = (pos: L.LatLng) => {
    setPosition(pos);
    resolveAddress(pos.lat, pos.lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
        setPosition(newPos);
        resolveAddress(newPos.lat, newPos.lng);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Error searching for location.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = new L.LatLng(latitude, longitude);
        setPosition(newPos);
        resolveAddress(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="h-full w-full relative z-0 group">
      {/* Search Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md mx-auto space-y-2">
        <form onSubmit={handleSearch} className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search address or street name..."
              className="w-full px-4 py-3 pl-11 bg-white/95 backdrop-blur-md border-2 border-swiss-fg shadow-lg focus:outline-none focus:border-swiss-red transition-all text-swiss-fg text-xs font-bold tracking-tight"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-swiss-fg/40" />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-3 bg-swiss-fg text-swiss-bg shadow-lg hover:bg-swiss-red active:scale-95 disabled:opacity-50 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center min-w-[80px]"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "SEARCH"}
          </button>
          
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="p-3 bg-white text-swiss-fg border-2 border-swiss-fg shadow-lg hover:bg-swiss-muted active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
            title="Use my current location"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-swiss-red" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
          </button>
        </form>

        {/* Live Detected Road Banner */}
        {isResolving && (
          <div className="p-3 bg-swiss-bg/95 border-2 border-swiss-fg shadow-lg flex items-center gap-3 animate-in fade-in">
            <Loader2 className="w-4 h-4 animate-spin text-swiss-red" />
            <span className="text-[10px] font-black uppercase tracking-widest text-swiss-fg/70">
              RESOLVING GPS ROAD & WARD DATA...
            </span>
          </div>
        )}

        {detectedAddress && !isResolving && (
          <div className="p-3.5 bg-swiss-bg/95 border-2 border-swiss-fg shadow-lg flex items-center justify-between gap-3 animate-in fade-in">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black tracking-widest uppercase text-swiss-red">
                  IDENTIFIED ROAD / LOCALITY
                </span>
              </div>
              <p className="text-xs font-black uppercase truncate text-swiss-fg tracking-tight">
                {detectedAddress.road}
              </p>
              <p className="text-[9px] font-bold text-swiss-fg/60 uppercase truncate">
                {[detectedAddress.neighbourhood, detectedAddress.city, detectedAddress.postcode].filter(Boolean).join(" • ")}
              </p>
            </div>
            <span className="px-2 py-1 bg-swiss-fg text-swiss-bg text-[8px] font-black uppercase tracking-widest shrink-0">
              GEO-LOCKED
            </span>
          </div>
        )}
      </div>

      <MapContainer 
        center={initialLocation ? [initialLocation.lat, initialLocation.lng] : defaultCenter} 
        zoom={initialLocation ? 15 : 5} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="overflow-hidden"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onPick={handlePositionSelect} />
        <MapFlyer position={position} />
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-[1000] bg-swiss-bg/90 backdrop-blur-sm px-3 py-1.5 border-2 border-swiss-fg text-[9px] font-black tracking-widest uppercase text-swiss-fg shadow-sm pointer-events-none">
        CLICK MAP OR DROP PIN TO IDENTIFY STREET
      </div>
    </div>
  );
}

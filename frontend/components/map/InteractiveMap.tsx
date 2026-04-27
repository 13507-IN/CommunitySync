"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createCustomIcon = (isSelected: boolean) =>
  L.divIcon({
    className: "custom-marker",
    html: isSelected
      ? `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: #FF3000;
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 20px rgba(255,48,0,0.5), 0 0 0 4px rgba(255,48,0,0.2);
            animation: pulse 2s infinite;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 12px;
            height: 12px;
            background: #ffffff;
            border-radius: 50%;
          "></div>
        </div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 4px 20px rgba(255,48,0,0.5), 0 0 0 4px rgba(255,48,0,0.2); }
            50% { box-shadow: 0 4px 20px rgba(255,48,0,0.5), 0 0 0 12px rgba(255,48,0,0.1); }
            100% { box-shadow: 0 4px 20px rgba(255,48,0,0.5), 0 0 0 4px rgba(255,48,0,0.2); }
          }
        </style>
      `
      : `
        <div style="
          width: 16px;
          height: 16px;
          background: #000000;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
    iconSize: isSelected ? [40, 40] : [16, 16],
    iconAnchor: isSelected ? [20, 20] : [8, 8],
  });

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface InteractiveMapProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  center?: [number, number];
  zoom?: number;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (loc: LocationData) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

function MapFlyToHandler({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const prevCenter = useRef<[number, number]>(center);
  const prevZoom = useRef<number>(zoom);

  useEffect(() => {
    const shouldFly = 
      Math.abs(prevCenter.current[0] - center[0] > 0.001) || 
      Math.abs(prevCenter.current[1] - center[1] > 0.001) ||
      prevZoom.current !== zoom;
    
    if (shouldFly) {
      map.flyTo(center, zoom, { duration: 1 });
    }
    
    prevCenter.current = center;
    prevZoom.current = zoom;
  }, [center, zoom, map]);

  return null;
}

export default function InteractiveMap({
  onLocationSelect,
  initialLocation,
  center = [28.6139, 77.209],
  zoom = 12,
}: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );

  useEffect(() => {
    if (initialLocation?.lat && initialLocation?.lng) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation?.lat, initialLocation?.lng]);

  const handleLocationSelect = useCallback(
    async (location: LocationData) => {
      setSelectedLocation(location);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
        );
        const data = await response.json();
        const address = data.display_name
          ? data.display_name.split(",").slice(0, 3).join(",")
          : `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;

        onLocationSelect({ ...location, address });
      } catch {
        onLocationSelect({
          ...location,
          address: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
        });
      }
    },
    [onLocationSelect]
  );

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.lat, selectedLocation.lng]
    : center;

  const mapZoom = selectedLocation ? 15 : zoom;

  return (
    <div className="relative w-full h-64 md:h-80 border-4 border-swiss-fg">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onLocationSelect={handleLocationSelect} />
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createCustomIcon(true)}
          />
        )}
        <MapFlyToHandler center={mapCenter} zoom={mapZoom} />
      </MapContainer>

      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 bg-white border-4 border-swiss-fg p-3 z-[1000]">
          <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/60 mb-1">
            SELECTED LOCATION
          </p>
          <p className="text-xs font-bold tracking-tight text-swiss-fg line-clamp-2">
            {selectedLocation.address || "Loading address..."}
          </p>
        </div>
      )}
    </div>
  );
}
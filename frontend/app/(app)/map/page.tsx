"use client";

import React, { useState } from "react";
import { Filter, Layers, Maximize2, MapPin, X, ChevronUp, ChevronDown } from "lucide-react";

export default function MapViewPage() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  return (
    <div className="md:h-[calc(100vh-160px)] flex flex-col gap-6 md:gap-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
              03. SPATIAL DATA
            </span>
            <div className="h-px w-16 md:w-32 bg-swiss-fg/10" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.8] uppercase">
            GEOSPATIAL<br />INTELLIGENCE
          </h1>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 border-4 border-swiss-fg font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-swiss-red hover:text-swiss-bg transition-all flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" />
            FILTER
          </button>
          <button className="flex-1 md:flex-none px-6 md:px-8 py-3 md:py-4 bg-swiss-fg text-swiss-bg font-black text-[10px] md:text-xs tracking-widest uppercase hover:bg-swiss-red transition-all flex items-center justify-center gap-2">
            <Layers className="w-4 h-4" />
            LAYERS
          </button>
        </div>
      </div>

      {/* Main Map Interface */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-8 min-h-[500px] md:min-h-0 relative">
        {/* Sidebar Controls - Drawer on mobile, Sidebar on desktop */}
        <div 
          className={`fixed inset-x-0 bottom-0 z-40 bg-swiss-bg border-t-4 border-swiss-fg md:relative md:inset-auto md:z-0 md:border-t-0 md:w-80 lg:w-96 flex flex-col gap-6 md:gap-8 transition-transform duration-300 transform ${
            isControlsOpen ? "translate-y-0" : "translate-y-[calc(100%-60px)] md:translate-y-0"
          }`}
        >
          {/* Mobile Header Toggle */}
          <button 
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="md:hidden w-full h-14 border-b-4 border-swiss-fg flex items-center justify-between px-6 bg-swiss-fg text-swiss-bg font-black tracking-widest uppercase text-[10px]"
          >
            <span>MAP INTELLIGENCE PANEL</span>
            {isControlsOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>

          <div className="flex-1 flex flex-col gap-6 p-6 md:p-0 md:pr-4 overflow-y-auto">
            <div className="border-4 border-swiss-fg p-6 md:p-8 bg-swiss-muted swiss-grid-pattern shrink-0">
              <p className="text-[10px] font-black tracking-widest uppercase mb-4">ACTIVE FILTERS</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b-2 border-swiss-fg/10 text-[10px] font-bold uppercase">
                  <span>URGENCY: HIGH</span>
                  <button className="text-swiss-red underline">REMOVE</button>
                </div>
                <div className="flex justify-between items-center py-2 border-b-2 border-swiss-fg/10 text-[10px] font-bold uppercase">
                  <span>TYPE: INFRA</span>
                  <button className="text-swiss-red underline">REMOVE</button>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase hover:bg-swiss-red transition-colors">
                CLEAR ALL
              </button>
            </div>

            <div className="flex-1 border-4 border-swiss-fg bg-swiss-bg overflow-hidden flex flex-col min-h-[300px]">
              <div className="p-4 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
                RECENTLY DETECTED (5)
              </div>
              <div className="flex-1 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 md:p-6 border-b-2 border-swiss-fg/10 hover:bg-swiss-red/5 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black tracking-widest text-swiss-red">HIGH PRIORITY</span>
                      <span className="text-[8px] font-bold text-swiss-fg/40">#IS-293{i}</span>
                    </div>
                    <h4 className="text-xs md:text-sm font-black tracking-tighter uppercase leading-tight mb-2">BROKEN WATER MAIN AT SECTOR 45</h4>
                    <div className="flex items-center gap-2 text-[8px] font-black text-swiss-fg/60">
                      <MapPin className="w-3 h-3" />
                      28.6139° N, 77.2090° E
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="flex-1 border-4 border-swiss-fg bg-swiss-muted relative overflow-hidden group shadow-[12px_12px_0_0_rgba(0,0,0,0.05)] md:shadow-[20px_20px_0_0_rgba(0,0,0,0.05)] mb-14 md:mb-0">
          <div className="absolute inset-0 swiss-grid-pattern opacity-40" />
          <div className="absolute inset-0 swiss-dots opacity-20" />
          
          {/* Mock Markers */}
          <div className="absolute top-[30%] left-[40%] w-6 h-6 md:w-8 md:h-8 bg-swiss-red border-4 border-swiss-fg animate-pulse cursor-pointer group/marker">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-swiss-fg text-swiss-bg text-[8px] font-black px-2 py-1 whitespace-nowrap opacity-0 md:group-hover/marker:opacity-100 transition-opacity">
              MAIN ROAD CRACK
            </div>
          </div>
          <div className="absolute top-[60%] left-[25%] w-5 h-5 md:w-6 md:h-6 bg-swiss-fg border-4 border-swiss-bg cursor-pointer" />
          <div className="absolute top-[45%] left-[70%] w-5 h-5 md:w-6 md:h-6 bg-swiss-fg border-4 border-swiss-bg cursor-pointer" />
          
          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col gap-2">
            <button className="w-10 h-10 md:w-12 md:h-12 bg-swiss-bg border-4 border-swiss-fg flex items-center justify-center hover:bg-swiss-red hover:text-swiss-bg transition-colors">
              <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="flex flex-col border-4 border-swiss-fg overflow-hidden">
              <button className="w-10 h-10 md:w-12 md:h-12 bg-swiss-bg flex items-center justify-center hover:bg-swiss-muted border-b-2 border-swiss-fg font-black text-lg">+</button>
              <button className="w-10 h-10 md:w-12 md:h-12 bg-swiss-bg flex items-center justify-center hover:bg-swiss-muted font-black text-lg">-</button>
            </div>
          </div>

          {/* Map Coordinates Overlay */}
          <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 p-3 md:p-4 bg-swiss-fg text-swiss-bg text-[8px] md:text-[10px] font-black tracking-widest uppercase flex flex-col gap-1">
            <span>LAT: 28.61° N</span>
            <span>LNG: 77.21° E</span>
            <span className="text-swiss-red">ALT: 216M</span>
          </div>
        </div>
      </div>
    </div>
  );
}

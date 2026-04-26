"use client";

import React from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Bell, Search } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-swiss-bg font-swiss selection:bg-swiss-red selection:text-swiss-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 border-b-4 border-swiss-fg flex items-center justify-between px-12 bg-swiss-bg sticky top-0 z-40">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-swiss-fg/40" />
              <input 
                type="text" 
                placeholder="00. SEARCH SYSTEM..." 
                className="w-full pl-12 pr-4 py-3 border-2 border-swiss-fg bg-swiss-muted text-xs font-bold tracking-widest focus:outline-none focus:border-swiss-red transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 border-2 border-swiss-fg hover:bg-swiss-red group transition-colors">
              <Bell className="w-5 h-5 text-swiss-fg group-hover:text-swiss-bg" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-swiss-red text-[8px] font-black text-swiss-bg flex items-center justify-center border border-swiss-fg">
                3
              </span>
            </button>
            <div className="h-8 w-px bg-swiss-fg/20 mx-2" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black tracking-widest uppercase">SY-2024-X</p>
                <p className="text-[8px] font-bold text-swiss-fg/60 uppercase">NODE: CENTRAL-01</p>
              </div>
              <div className="w-10 h-10 border-2 border-swiss-fg bg-swiss-red" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto swiss-noise">
          <div className="p-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

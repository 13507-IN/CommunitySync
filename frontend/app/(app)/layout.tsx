"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-swiss-bg font-swiss selection:bg-swiss-red selection:text-swiss-bg">
      {/* Sidebar - Desktop and Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-50 lg:relative lg:z-0 lg:block transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-swiss-fg/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-20 border-b-4 border-swiss-fg flex items-center justify-between px-4 lg:px-12 bg-swiss-bg sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 border-2 border-swiss-fg hover:bg-swiss-red group transition-colors"
            >
              <Menu className="w-5 h-5 text-swiss-fg group-hover:text-swiss-bg" />
            </button>

            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-swiss-fg/40" />
              <input 
                type="text" 
                placeholder="00. SEARCH SYSTEM..." 
                className="w-full pl-12 pr-4 py-3 border-2 border-swiss-fg bg-swiss-muted text-xs font-bold tracking-widest focus:outline-none focus:border-swiss-red transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <button className="relative p-2 border-2 border-swiss-fg hover:bg-swiss-red group transition-colors hidden sm:block">
              <Bell className="w-5 h-5 text-swiss-fg group-hover:text-swiss-bg" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-swiss-red text-[8px] font-black text-swiss-bg flex items-center justify-center border border-swiss-fg">
                3
              </span>
            </button>
            <div className="h-8 w-px bg-swiss-fg/20 mx-2 hidden sm:block" />
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black tracking-widest uppercase truncate max-w-[120px]">
                  {user?.name || "SY-2024-X"}
                </p>
                <p className="text-[8px] font-bold text-swiss-fg/60 uppercase">
                  {user?.role ? user.role.toUpperCase() : "AUTHENTICATED"}
                </p>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border-2 border-swiss-fg rounded-none h-10 w-10",
                    userButtonTrigger: "focus:ring-0 focus:ring-offset-0",
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto swiss-noise">
          <div className="p-4 md:p-8 lg:p-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

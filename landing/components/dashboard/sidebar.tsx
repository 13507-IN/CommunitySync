"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  PlusCircle, 
  Users, 
  Building2, 
  CheckCircle2, 
  Settings,
  Bell,
  LogOut
} from "lucide-react";

const navItems = [
  { name: "01. DASHBOARD", href: "/dashboard", icon: LayoutDashboard },
  { name: "02. REPORT ISSUE", href: "/report", icon: PlusCircle },
  { name: "03. MAP VIEW", href: "/map", icon: MapIcon },
  { name: "04. VOLUNTEER", href: "/volunteer", icon: Users },
  { name: "05. GOVERNMENT", href: "/government", icon: Building2 },
  { name: "06. VERIFICATION", href: "/verification", icon: CheckCircle2 },
  { name: "07. SETTINGS", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 h-screen sticky top-0 bg-swiss-bg border-r-4 border-swiss-fg flex flex-col font-swiss overflow-hidden swiss-grid-pattern">
      {/* Logo Area */}
      <div className="p-8 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg">
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
          COMMUNITY<br />SYNC
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-12 overflow-y-auto">
        <ul className="space-y-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`group flex items-center gap-4 px-8 py-6 text-sm font-bold tracking-widest transition-all duration-150 relative border-b-2 border-swiss-fg/10 hover:bg-swiss-red hover:text-swiss-bg ${
                    isActive ? "bg-swiss-fg text-swiss-bg" : "text-swiss-fg"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-swiss-red" : "group-hover:text-swiss-fg"}`} />
                  {item.name}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-swiss-red" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-8 border-t-4 border-swiss-fg bg-swiss-muted swiss-dots">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-swiss-red border-2 border-swiss-fg" />
          <div>
            <p className="text-xs font-black tracking-widest uppercase">SAIKAT BERA</p>
            <p className="text-[10px] font-bold text-swiss-fg/60 uppercase">ADMINISTRATOR</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-swiss-fg text-swiss-bg font-bold text-xs tracking-widest hover:bg-swiss-red transition-colors duration-150 uppercase">
          Logout
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}

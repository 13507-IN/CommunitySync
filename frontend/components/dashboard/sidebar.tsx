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
  X,
  User,
  ClipboardList,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import type { AppUserRole } from "@/lib/api";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: AppUserRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { name: "01. DASHBOARD", href: "/dashboard", icon: LayoutDashboard, roles: ["volunteer", "ngo", "govt", "admin"] },
  { name: "02. MY REPORTS", href: "/my-reports", icon: ClipboardList, roles: ["volunteer", "ngo", "govt", "admin"] },
  { name: "03. REPORT ISSUE", href: "/report", icon: PlusCircle, roles: ["volunteer", "ngo", "govt", "admin"] },
  { name: "04. MAP VIEW", href: "/map", icon: MapIcon, roles: ["volunteer", "ngo", "govt", "admin"] },
  { name: "05. VOLUNTEER", href: "/volunteer", icon: Users, roles: ["volunteer", "ngo", "admin"], badge: "XP" },
  { name: "06. GOVERNMENT", href: "/government", icon: Building2, roles: ["govt", "admin"], badge: "OFFICIAL" },
  { name: "07. VERIFICATION", href: "/verification", icon: CheckCircle2, roles: ["volunteer", "ngo", "admin"], badge: "QA" },
  { name: "08. SETTINGS", href: "/settings", icon: Settings, roles: ["volunteer", "ngo", "govt", "admin"] },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-80 h-full bg-swiss-bg border-r-4 border-swiss-fg flex flex-col font-swiss overflow-hidden swiss-grid-pattern relative">
      {/* Logo Area */}
      <div className="p-8 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
          COMMUNITY<br />SYNC
        </h1>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 border-2 border-swiss-bg hover:bg-swiss-red transition-colors"
          >
            <X className="w-5 h-5 text-swiss-bg" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 overflow-y-auto">
        <ul className="space-y-0">
          {navItems
            .filter((item) => !user?.role || item.roles.includes(user.role as AppUserRole))
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-8 py-5 text-xs font-black tracking-widest transition-all duration-150 relative border-b-2 border-swiss-fg/10 hover:bg-swiss-red hover:text-swiss-bg ${
                      isActive ? "bg-swiss-fg text-swiss-bg" : "text-swiss-fg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`w-4 h-4 ${isActive ? "text-swiss-red" : "group-hover:text-swiss-fg"}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[7px] font-black tracking-widest border uppercase ${
                        isActive 
                          ? "border-swiss-bg text-swiss-bg bg-swiss-red" 
                          : "border-swiss-fg/30 text-swiss-fg/60 group-hover:border-white group-hover:text-white"
                      }`}>
                        {item.badge}
                      </span>
                    )}

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
          <div className="w-12 h-12 bg-swiss-red border-2 border-swiss-fg overflow-hidden flex items-center justify-center">
            <User className="w-6 h-6 text-swiss-bg" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black tracking-widest uppercase truncate">
              {user?.name || "ANONYMOUS"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-black text-swiss-red uppercase tracking-widest truncate">
                {user?.role ? `${user.role.toUpperCase()} LEVEL` : "VOLUNTEER LEVEL"}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full flex items-center justify-between px-4 py-3 bg-swiss-fg text-swiss-bg font-bold text-xs tracking-widest hover:bg-swiss-red transition-colors duration-150 uppercase group"
        >
          Terminate Session
          <X className="w-4 h-4 transition-transform group-hover:rotate-90" />
        </button>
      </div>
    </aside>
  );
}

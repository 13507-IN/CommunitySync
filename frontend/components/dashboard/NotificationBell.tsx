"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  X,
  ExternalLink
} from "lucide-react";
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  markNotificationRead, 
  markAllNotificationsRead, 
  type Notification 
} from "@/lib/api";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      if (res.data) {
        setUnreadCount(res.data.count || 0);
      }
    } catch (err) {
      // Quietly ignore if not authenticated yet
    }
  };

  const fetchAllNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications({ limit: 15 });
      if (res.data) {
        setNotifications(res.data);
      }
      await fetchUnreadCount();
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchAllNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markNotificationRead(id);
      setNotifications((prev) => 
        prev.map((n) => n.id === id ? { ...n, readStatus: true } : n)
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger */}
      <button 
        onClick={handleToggle}
        className="relative p-2.5 border-2 border-swiss-fg hover:bg-swiss-red group transition-colors flex items-center justify-center cursor-pointer"
        title="View Notifications"
      >
        <Bell className="w-5 h-5 text-swiss-fg group-hover:text-swiss-bg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-swiss-red text-[8px] font-black text-white flex items-center justify-center border-2 border-swiss-fg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-swiss-bg border-4 border-swiss-fg shadow-[10px_10px_0_0_rgba(0,0,0,1)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden font-swiss">
          {/* Header */}
          <div className="p-4 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase">
                CIVIC NOTIFICATIONS
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-swiss-red text-white text-[8px] font-black uppercase">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[9px] font-bold text-swiss-bg/80 hover:text-white uppercase flex items-center gap-1 hover:underline cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                MARK ALL READ
              </button>
            )}
          </div>

          {/* Notifications Scroll Area */}
          <div className="max-h-80 overflow-y-auto divide-y-2 divide-swiss-fg/10 bg-swiss-bg">
            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-swiss-red" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Bell className="w-8 h-8 text-swiss-fg/20 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-swiss-fg/50">
                  NO NOTIFICATIONS YET
                </p>
                <p className="text-[9px] font-bold uppercase text-swiss-fg/40">
                  ZONAL UPDATES & DEPARTMENT ACTIONS WILL APPEAR HERE
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={(e) => handleMarkAsRead(n.id, e)}
                  className={`p-4 transition-colors flex items-start gap-3 cursor-pointer group ${
                    !n.readStatus 
                      ? "bg-swiss-red/5 hover:bg-swiss-red/10 border-l-4 border-swiss-red" 
                      : "hover:bg-swiss-muted"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {!n.readStatus ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-swiss-red block animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-swiss-fg/30 block" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className={`text-xs uppercase leading-snug tracking-tight ${
                      !n.readStatus ? "font-black text-swiss-fg" : "font-bold text-swiss-fg/70"
                    }`}>
                      {n.message}
                    </p>
                    <div className="flex items-center justify-between text-[8px] font-black text-swiss-fg/50 uppercase pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {timeAgo(n.createdAt)}
                      </span>
                      <span className="px-1.5 py-0.5 border border-swiss-fg/20 text-[7px]">
                        {n.type.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t-2 border-swiss-fg/20 bg-swiss-muted flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-swiss-fg/60">
            <span>REAL-TIME DISPATCH WEBSOCKET</span>
            <span className="text-green-600">● LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
}

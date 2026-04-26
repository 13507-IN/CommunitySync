"use client";

import React from "react";
import { User, Bell, Shield, Save } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function SettingsPage() {
  const { user } = useUser();

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            07. SYSTEM CONFIG
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        <h1 className="text-5xl md:text-[6rem] font-black tracking-tighter leading-[0.8] uppercase">
          SETT<br />INGS
        </h1>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8 lg:space-y-12">
        {/* Profile Section */}
        <section className="border-4 border-swiss-fg bg-swiss-bg overflow-hidden">
          <div className="p-6 md:p-8 border-b-4 border-swiss-fg bg-swiss-muted flex items-center gap-4 swiss-dots">
            <User className="w-6 h-6" />
            <h2 className="text-lg md:text-xl font-black tracking-widest uppercase">01. USER PROFILE</h2>
          </div>
          <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase">DISPLAY NAME</label>
                <input 
                  type="text" 
                  defaultValue={user?.fullName || ""}
                  disabled
                  className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted font-bold text-xs tracking-widest opacity-60"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase">IDENTIFIER EMAIL</label>
                <input 
                  type="email" 
                  defaultValue={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted font-bold text-xs tracking-widest opacity-60"
                />
              </div>
              <p className="text-[8px] font-bold text-swiss-red uppercase italic">Profile management handled via Clerk Identity Provider.</p>
            </div>
            <div className="flex flex-col items-center justify-center border-4 border-dashed border-swiss-fg/20 p-8 hover:border-swiss-red transition-colors group">
              <div className="w-24 h-24 bg-swiss-red border-4 border-swiss-fg flex items-center justify-center mb-4 overflow-hidden">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-swiss-bg" />
                )}
              </div>
              <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40">SYSTEM AVATAR</p>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <section className="border-4 border-swiss-fg bg-swiss-bg">
            <div className="p-6 border-b-4 border-swiss-fg bg-swiss-muted flex items-center gap-4 swiss-diagonal">
              <Bell className="w-5 h-5" />
              <h2 className="text-lg font-black tracking-widest uppercase">02. NOTIFICATIONS</h2>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {[
                "EMAIL ALERTS ON RESOLUTION",
                "SMS FOR CRITICAL UPDATES",
                "WEEKLY IMPACT SUMMARY",
                "BROWSER PUSH MESSAGES"
              ].map((setting, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="text-[10px] font-black tracking-widest uppercase group-hover:text-swiss-red transition-colors">{setting}</span>
                  <div className="w-12 h-6 border-2 border-swiss-fg bg-swiss-muted relative cursor-pointer">
                    <div className={`absolute top-0 bottom-0 w-6 border-2 border-swiss-fg transition-all ${i % 2 === 0 ? 'right-0 bg-swiss-red' : 'left-0 bg-white'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-4 border-swiss-fg bg-swiss-bg">
            <div className="p-6 border-b-4 border-swiss-fg bg-swiss-muted flex items-center gap-4 swiss-grid-pattern">
              <Shield className="w-5 h-5" />
              <h2 className="text-lg font-black tracking-widest uppercase">03. PRIVACY & SECURITY</h2>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              {[
                "ANONYMOUS REPORTING",
                "TWO-FACTOR AUTHENTICATION",
                "LOCATION SHARING PREFERENCE",
                "DATA LOGGING RETENTION"
              ].map((setting, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <span className="text-[10px] font-black tracking-widest uppercase group-hover:text-swiss-red transition-colors">{setting}</span>
                  <div className="w-12 h-6 border-2 border-swiss-fg bg-swiss-muted relative cursor-pointer">
                    <div className={`absolute top-0 bottom-0 w-6 border-2 border-swiss-fg transition-all ${i === 1 ? 'right-0 bg-swiss-red' : 'left-0 bg-white'}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Danger Zone */}
        <section className="border-4 border-swiss-red bg-swiss-red/5 p-8 lg:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tighter uppercase text-swiss-red mb-2">DANGER ZONE</h3>
            <p className="text-[10px] font-black tracking-widest uppercase text-swiss-red/60">PERMANENT DELETION OF ACCOUNT DATA</p>
          </div>
          <button className="w-full md:w-auto px-12 py-4 border-4 border-swiss-red text-swiss-red font-black tracking-widest uppercase hover:bg-swiss-red hover:text-swiss-bg transition-all">
            DELETE ACCOUNT
          </button>
        </section>
      </div>

      {/* Save Button */}
      <div className="pt-8 md:pt-12 border-t-4 border-swiss-fg flex justify-center md:justify-end">
        <button className="w-full md:w-auto px-16 py-8 bg-swiss-fg text-swiss-bg font-black tracking-widest uppercase hover:bg-swiss-red transition-colors flex items-center justify-center gap-4 shadow-[12px_12px_0_0_rgba(255,48,0,1)]">
          SAVE ALL CHANGES
          <Save className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserPlus, Shield, Info } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-swiss-bg font-swiss flex selection:bg-swiss-red selection:text-swiss-bg overflow-hidden relative">
      {/* Background Texture */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 swiss-dots opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[50vw] h-full bg-swiss-fg swiss-diagonal opacity-[0.02] pointer-events-none" />

      {/* Right Panel: Branding (Swapped for Signup) */}
      <div className="hidden lg:flex flex-col justify-between p-24 w-1/2 border-l-8 border-swiss-fg relative z-10 order-2">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase leading-none hover:text-swiss-red transition-colors text-right">
          COMMUNITY<br />SYNC
        </Link>
        
        <div className="space-y-12 text-right">
          <h1 className="text-[10rem] font-black tracking-tighter leading-[0.8] uppercase">
            SIGN<br />UP
          </h1>
          <div className="flex items-center justify-end gap-6">
            <p className="text-xl font-black tracking-tighter uppercase text-swiss-fg/60 max-w-sm">
              JOIN THE NETWORK. EMPOWER YOUR CITY.
            </p>
            <div className="w-16 h-px bg-swiss-fg" />
          </div>
        </div>

        <div className="flex gap-12 justify-end">
          <div className="space-y-2 text-right">
            <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red">01. VERIFY</p>
            <p className="text-[10px] font-black tracking-widest uppercase">ROLE-BASED VERIFICATION</p>
          </div>
          <div className="space-y-2 text-right">
            <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red">02. SYNC</p>
            <p className="text-[10px] font-black tracking-widest uppercase">REAL-TIME DATA UPDATES</p>
          </div>
        </div>
      </div>

      {/* Left Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10 order-1">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <h2 className="text-6xl font-black tracking-tighter uppercase leading-none mb-4">SIGN UP</h2>
            <div className="h-2 w-24 bg-swiss-red" />
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase group-focus-within:text-swiss-red transition-colors">First Name</label>
                <input 
                  type="text" 
                  placeholder="SAIKAT"
                  className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-xs tracking-widest transition-all"
                />
              </div>
              <div className="group space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase group-focus-within:text-swiss-red transition-colors">Last Name</label>
                <input 
                  type="text" 
                  placeholder="BERA"
                  className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-xs tracking-widest transition-all"
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black tracking-widest uppercase group-focus-within:text-swiss-red transition-colors">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {["CITIZEN", "VOLUNTEER", "NGO", "GOVT"].map((role) => (
                  <button 
                    key={role}
                    type="button"
                    className="py-4 border-2 border-swiss-fg text-[10px] font-black tracking-widest uppercase hover:bg-swiss-red hover:text-swiss-bg transition-all"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black tracking-widest uppercase group-focus-within:text-swiss-red transition-colors">Identifier Email</label>
              <input 
                type="email" 
                placeholder="USER@DOMAIN.COM"
                className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-xs tracking-widest transition-all"
              />
            </div>

            <div className="group space-y-2">
              <label className="text-[10px] font-black tracking-widest uppercase group-focus-within:text-swiss-red transition-colors">Access Password</label>
              <input 
                type="password" 
                placeholder="••••••••••••"
                className="w-full p-4 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-xs tracking-widest transition-all"
              />
            </div>

            <div className="p-4 border-2 border-swiss-fg bg-swiss-muted flex gap-4 items-start">
              <Info className="w-5 h-5 text-swiss-red shrink-0" />
              <p className="text-[8px] font-bold uppercase leading-tight text-swiss-fg/60">
                BY CREATING AN ACCOUNT, YOU AGREE TO THE COMMUNITYSYNC SYSTEM PROTOCOLS AND DATA PRIVACY STANDARDS.
              </p>
            </div>

            <button className="w-full py-6 bg-swiss-fg text-swiss-bg font-black tracking-widest uppercase hover:bg-swiss-red transition-all flex items-center justify-center gap-4 group">
              CREATE IDENTITY
              <UserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </button>
          </form>

          <div className="pt-8 border-t-4 border-swiss-fg flex flex-col items-center gap-4">
            <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40 text-center">
              ALREADY REGISTERED IN THE SYSTEM?
            </p>
            <Link 
              href="/auth/login"
              className="text-[10px] font-black tracking-widest uppercase hover:text-swiss-red underline transition-colors"
            >
              INITIATE LOGIN SESSION
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

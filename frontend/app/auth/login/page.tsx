"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-swiss-bg font-swiss flex selection:bg-swiss-red selection:text-swiss-bg overflow-hidden relative">
      {/* Background Texture */}
      <div className="absolute inset-0 swiss-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 swiss-dots opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[50vw] h-full bg-swiss-fg swiss-diagonal opacity-[0.02] pointer-events-none" />

      {/* Left Panel: Branding */}
      <div className="hidden lg:flex flex-col justify-between p-24 w-1/2 border-r-8 border-swiss-fg relative z-10">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase leading-none hover:text-swiss-red transition-colors">
          COMMUNITY<br />SYNC
        </Link>
        
        <div className="space-y-12">
          <h1 className="text-[10rem] font-black tracking-tighter leading-[0.8] uppercase">
            LOG<br />IN
          </h1>
          <div className="flex items-center gap-6">
            <div className="w-16 h-px bg-swiss-fg" />
            <p className="text-xl font-black tracking-tighter uppercase text-swiss-fg/60 max-w-sm">
              ACCESS THE SYSTEM. MANAGE YOUR IMPACT.
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          <div className="space-y-2">
            <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red">SECURE</p>
            <p className="text-[10px] font-black tracking-widest uppercase">END-TO-END DATA ENCRYPTION</p>
          </div>
          <div className="space-y-2">
            <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red">RELIABLE</p>
            <p className="text-[10px] font-black tracking-widest uppercase">99.9% UPTIME GUARANTEE</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24 relative z-10">
        <div className="w-full max-w-md space-y-12">
          <div className="lg:hidden">
            <h2 className="text-6xl font-black tracking-tighter uppercase leading-none mb-4">LOG IN</h2>
            <div className="h-2 w-24 bg-swiss-red" />
          </div>

          <form className="space-y-8">
            <div className="space-y-4">
              <div className="group space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2 group-focus-within:text-swiss-red transition-colors">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="USER@ORG.SYSTEM"
                  className="w-full p-6 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-sm tracking-tight transition-all"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase flex items-center gap-2 group-focus-within:text-swiss-red transition-colors">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  className="w-full p-6 border-4 border-swiss-fg bg-swiss-muted focus:bg-white focus:border-swiss-red outline-none font-bold text-sm tracking-tight transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="w-6 h-6 border-4 border-swiss-fg group-hover:border-swiss-red transition-colors flex items-center justify-center">
                  <div className="w-2 h-2 bg-swiss-red opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase">REMEMBER NODE</span>
              </label>
              <a href="#" className="text-[10px] font-black tracking-widest uppercase hover:text-swiss-red underline transition-colors">FORGOT KEY?</a>
            </div>

            <button className="w-full py-8 bg-swiss-fg text-swiss-bg font-black tracking-widest uppercase hover:bg-swiss-red transition-all flex items-center justify-center gap-4 group">
              INITIATE SESSION
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="pt-12 border-t-4 border-swiss-fg flex flex-col items-center gap-6">
            <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40 text-center">
              FIRST TIME ACCESSING THE GRID?
            </p>
            <Link 
              href="/auth/signup"
              className="px-12 py-4 border-4 border-swiss-fg font-black tracking-widest uppercase hover:bg-swiss-fg hover:text-swiss-bg transition-all"
            >
              CREATE NEW ACCOUNT
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer Branding for Mobile */}
      <div className="lg:hidden absolute bottom-8 left-8 right-8 text-center">
        <p className="text-[8px] font-black tracking-widest uppercase">COMMUNITYSYNC SYSTEM v2.4.0</p>
      </div>
    </div>
  );
}

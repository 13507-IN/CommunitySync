"use client";

import React from "react";
import { CheckCircle2, XCircle, Eye, ArrowRight, Image as ImageIcon } from "lucide-react";

const pendingVerifications = [
  { id: "VER-801", title: "ROAD REPAIR SECTOR 12", reportedBy: "Citizen-04", resolvedBy: "Govt-PWD", time: "1h ago" },
  { id: "VER-802", title: "STREET LIGHT REPLACEMENT", reportedBy: "NGO-Alpha", resolvedBy: "Govt-ELECT", time: "3h ago" },
  { id: "VER-803", title: "WATER PIPE FIX", reportedBy: "Citizen-12", resolvedBy: "Volunteer-08", time: "5h ago" },
];

export default function VerificationPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-red text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            06. QUALITY ASSURANCE
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        <h1 className="text-[7rem] font-black tracking-tighter leading-[0.8] uppercase">
          VERIFY<br />RESULTS
        </h1>
      </div>

      {/* Main Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Pending List */}
        <div className="lg:col-span-4 border-4 border-swiss-fg flex flex-col bg-swiss-bg">
          <div className="p-6 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            WAITING QUEUE (03)
          </div>
          <div className="flex-1 overflow-y-auto">
            {pendingVerifications.map((item, i) => (
              <div key={i} className={`p-8 border-b-4 border-swiss-fg last:border-b-0 cursor-pointer transition-all hover:bg-swiss-red group ${i === 0 ? 'bg-swiss-muted' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black tracking-widest uppercase group-hover:text-swiss-bg ${i === 0 ? 'text-swiss-red' : 'text-swiss-fg/40'}`}>
                    {i === 0 ? 'SELECTED' : item.id}
                  </span>
                  <span className="text-[8px] font-bold text-swiss-fg/40 group-hover:text-swiss-bg/40">{item.time}</span>
                </div>
                <h4 className="text-xl font-black tracking-tighter uppercase leading-tight group-hover:text-swiss-bg mb-4">
                  {item.title}
                </h4>
                <div className="space-y-1">
                  <p className="text-[8px] font-black tracking-widest uppercase text-swiss-fg/60 group-hover:text-swiss-bg/60">BY: {item.reportedBy}</p>
                  <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red group-hover:text-swiss-bg">FIXED BY: {item.resolvedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-8 space-y-12">
          {/* Comparison Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-4 border-swiss-fg relative group cursor-crosshair">
              <div className="p-4 border-b-4 border-swiss-fg bg-swiss-muted text-[10px] font-black tracking-widest uppercase">
                BEFORE (ORIGINAL REPORT)
              </div>
              <div className="h-80 bg-swiss-muted flex items-center justify-center swiss-diagonal">
                <ImageIcon className="w-12 h-12 text-swiss-fg/20" />
              </div>
              <div className="absolute inset-0 border-4 border-transparent hover:border-swiss-red transition-all" />
            </div>
            <div className="border-4 border-swiss-fg relative group cursor-crosshair">
              <div className="p-4 border-b-4 border-swiss-fg bg-swiss-muted text-[10px] font-black tracking-widest uppercase">
                AFTER (RESOLUTION PROOF)
              </div>
              <div className="h-80 bg-swiss-muted flex items-center justify-center swiss-grid-pattern">
                <ImageIcon className="w-12 h-12 text-swiss-fg/20" />
              </div>
              <div className="absolute inset-0 border-4 border-transparent hover:border-swiss-red transition-all" />
            </div>
          </div>

          {/* Verification Actions */}
          <div className="border-4 border-swiss-fg p-12 bg-swiss-bg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 swiss-dots opacity-20 pointer-events-none" />
            
            <div className="max-w-2xl space-y-8 relative z-10">
              <h3 className="text-4xl font-black tracking-tighter uppercase">VERDICT</h3>
              <div className="space-y-4">
                <label className="text-[10px] font-black tracking-widest uppercase">REMARKS (OPTIONAL)</label>
                <textarea 
                  className="w-full h-32 p-6 border-4 border-swiss-fg bg-swiss-muted focus:outline-none focus:bg-white focus:border-swiss-red font-bold text-sm tracking-tight transition-all"
                  placeholder="ADD ANY ADDITIONAL OBSERVATIONS..."
                />
              </div>
              
              <div className="flex gap-4">
                <button className="flex-1 py-6 bg-swiss-fg text-swiss-bg font-black tracking-widest uppercase hover:bg-swiss-red transition-colors flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  APPROVE RESOLUTION
                </button>
                <button className="flex-1 py-6 border-4 border-swiss-fg font-black tracking-widest uppercase hover:bg-swiss-red hover:text-swiss-bg hover:border-swiss-red transition-all flex items-center justify-center gap-3">
                  <XCircle className="w-5 h-5" />
                  REJECT & REOPEN
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-4 border-swiss-fg p-8 bg-swiss-muted swiss-grid-pattern">
            <p className="text-[10px] font-black tracking-widest uppercase mb-8">EVENT TIMELINE</p>
            <div className="space-y-8">
              {[
                { time: "2024.04.26 10:20", msg: "ISSUE REPORTED BY CITIZEN-04" },
                { time: "2024.04.26 12:45", msg: "ASSIGNED TO GOVT-PWD" },
                { time: "2024.04.26 16:30", msg: "RESOLUTION PROOF UPLOADED" },
              ].map((log, i) => (
                <div key={i} className="flex gap-8 items-start">
                  <span className="text-[8px] font-black tracking-widest text-swiss-fg/40 pt-1">{log.time}</span>
                  <div className="flex-1 pb-4 border-b-2 border-swiss-fg/10">
                    <p className="text-[10px] font-black tracking-widest uppercase">{log.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

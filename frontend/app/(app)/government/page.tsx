"use client";

import React from "react";
import { Search, Filter, CheckSquare, ExternalLink } from "lucide-react";

const issues = [
  { id: "ISS-492", title: "PRIMARY SEWAGE OVERFLOW", priority: "CRITICAL", status: "PENDING", assigned: "DEPT-WATER", location: "DOWNTOWN" },
  { id: "ISS-491", title: "STREET LIGHTING FAILURE", priority: "MEDIUM", status: "IN PROGRESS", assigned: "DEPT-ELECT", location: "NORTH QUAD" },
  { id: "ISS-490", title: "ILLEGAL DUMPING SITE", priority: "HIGH", status: "ASSIGNED", assigned: "DEPT-ENV", location: "WEST PARK" },
  { id: "ISS-489", title: "ROAD SURFACE DEGRADATION", priority: "LOW", status: "SCHEDULED", assigned: "DEPT-PWD", location: "HIGHWAY 4" },
  { id: "ISS-488", title: "PUBLIC PARK BENCH REPAIR", priority: "LOW", status: "PENDING", assigned: "DEPT-PARKS", location: "CIVIC SQ" },
];

export default function GovernmentPanel() {
  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            05. AUTHORITY CONTROL
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter leading-[0.8] uppercase">
            GOVERN<br className="hidden md:block" />MENT
          </h1>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-24 p-4 border-4 border-swiss-fg bg-swiss-muted text-center">
              <p className="text-[8px] font-black tracking-widest uppercase">ACTIVE NODES</p>
              <p className="text-xl md:text-2xl font-black">12</p>
            </div>
            <div className="flex-1 md:w-32 p-4 border-4 border-swiss-fg bg-swiss-red text-swiss-bg text-center">
              <p className="text-[8px] font-black tracking-widest uppercase truncate">PENDING APPROVAL</p>
              <p className="text-xl md:text-2xl font-black">08</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-swiss-fg/40" />
          <input 
            type="text" 
            placeholder="FILTER SYSTEM..."
            className="w-full pl-16 pr-6 py-5 md:py-6 border-4 border-swiss-fg bg-swiss-bg text-sm font-bold tracking-tight focus:outline-none focus:border-swiss-red transition-all"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 lg:flex-none lg:px-12 py-5 md:py-6 border-4 border-swiss-fg font-black tracking-widest uppercase hover:bg-swiss-fg hover:text-swiss-bg transition-all flex items-center justify-center gap-3 text-xs md:text-sm">
            <Filter className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">FILTERS</span>
          </button>
          <button className="flex-[2] lg:flex-none lg:px-12 py-5 md:py-6 bg-swiss-red text-swiss-bg font-black tracking-widest uppercase hover:scale-105 transition-transform flex items-center justify-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-xs md:text-sm">
            <CheckSquare className="w-4 h-4 md:w-5 md:h-5" />
            BULK ACTION
          </button>
        </div>
      </div>

      {/* Management Table */}
      <div className="border-4 border-swiss-fg bg-swiss-bg overflow-hidden shadow-[8px_8px_0_0_rgba(255,48,0,0.1)] md:shadow-[16px_16px_0_0_rgba(255,48,0,0.1)]">
        <div className="p-6 md:p-8 border-b-4 border-swiss-fg bg-swiss-muted flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 swiss-diagonal">
          <p className="text-[10px] font-black tracking-widest uppercase">DEPARTMENTAL TASKS</p>
          <div className="flex gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-swiss-red" />
              <span className="text-[10px] font-black uppercase tracking-widest">URGENT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-swiss-fg" />
              <span className="text-[10px] font-black uppercase tracking-widest">STANDARD</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-swiss-fg text-[10px] font-black tracking-widest uppercase">
                <th className="px-8 py-6">ISSUE</th>
                <th className="px-8 py-6">PRIORITY</th>
                <th className="px-8 py-6">DEPARTMENT</th>
                <th className="px-8 py-6">STATUS</th>
                <th className="px-8 py-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-swiss-fg">
              {issues.map((issue, i) => (
                <tr key={i} className="group hover:bg-swiss-red/5 transition-colors text-xs">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black tracking-widest text-swiss-fg/40 uppercase">{issue.id}</p>
                      <h4 className="font-black uppercase truncate max-w-[200px]">{issue.title}</h4>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase border-2 border-swiss-fg ${issue.priority === 'CRITICAL' ? 'bg-swiss-red text-swiss-bg' : ''}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6 uppercase font-bold tracking-tight">{issue.assigned}</td>
                  <td className="px-8 py-6">
                    <div className="inline-block border-2 border-swiss-fg px-3 py-1 font-black text-[10px] tracking-widest uppercase">{issue.status}</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 border-2 border-swiss-fg hover:bg-swiss-fg hover:text-swiss-bg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y-4 border-swiss-fg">
          {issues.map((issue, i) => (
            <div key={i} className="p-6 space-y-4 bg-swiss-bg hover:bg-swiss-muted transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[8px] font-black text-swiss-fg/40 uppercase mb-1">{issue.id}</p>
                  <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">{issue.title}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[8px] font-black tracking-widest uppercase border-2 border-swiss-fg ${issue.priority === 'CRITICAL' ? 'bg-swiss-red text-swiss-bg' : ''}`}>
                  {issue.priority}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[8px] font-black tracking-widest uppercase text-swiss-red mb-1">ASSIGNED TO</p>
                  <p className="text-[10px] font-bold uppercase">{issue.assigned}</p>
                </div>
                <div className="border-2 border-swiss-fg px-2 py-1 font-black text-[8px] tracking-widest uppercase">
                  {issue.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 pb-12">
        <div className="border-4 border-swiss-fg p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 swiss-grid-pattern opacity-40 group-hover:bg-swiss-red/5 transition-colors" />
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-6">COMPLIANCE METRICS</h3>
          <div className="space-y-4">
            {[
              { label: "AVG RESOLUTION TIME", val: "4.2 DAYS" },
              { label: "BUDGET UTILIZATION", val: "68.4%" },
              { label: "CITIZEN TRUST SCORE", val: "8.2/10" },
            ].map((m, i) => (
              <div key={i} className="flex justify-between items-end border-b-2 border-swiss-fg/10 pb-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40">{m.label}</span>
                <span className="text-lg md:text-xl font-black tracking-tighter uppercase">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-4 border-swiss-fg p-8 md:p-12 bg-swiss-muted swiss-dots">
          <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-6">SYSTEM UPDATES</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-swiss-red bg-white">
              <p className="text-[8px] font-black tracking-widest text-swiss-red uppercase mb-1">MAJOR ALERT</p>
              <p className="text-[10px] font-bold uppercase leading-tight">CENTRAL HUB SYNCHRONIZATION ERROR DETECTED</p>
            </div>
            <div className="p-4 border-l-4 border-swiss-fg bg-white">
              <p className="text-[8px] font-black tracking-widest text-swiss-fg/40 uppercase mb-1">LOG ENTRY</p>
              <p className="text-[10px] font-bold uppercase leading-tight">NEW DEPARTMENT 'DEPT-ENV-PROTECTION' INITIALIZED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Building2, Search, Filter, CheckSquare, MoreVertical, ExternalLink } from "lucide-react";

const issues = [
  { id: "ISS-492", title: "PRIMARY SEWAGE OVERFLOW", priority: "CRITICAL", status: "PENDING", assigned: "DEPT-WATER", location: "DOWNTOWN" },
  { id: "ISS-491", title: "STREET LIGHTING FAILURE", priority: "MEDIUM", status: "IN PROGRESS", assigned: "DEPT-ELECT", location: "NORTH QUAD" },
  { id: "ISS-490", title: "ILLEGAL DUMPING SITE", priority: "HIGH", status: "ASSIGNED", assigned: "DEPT-ENV", location: "WEST PARK" },
  { id: "ISS-489", title: "ROAD SURFACE DEGRADATION", priority: "LOW", status: "SCHEDULED", assigned: "DEPT-PWD", location: "HIGHWAY 4" },
  { id: "ISS-488", title: "PUBLIC PARK BENCH REPAIR", priority: "LOW", status: "PENDING", assigned: "DEPT-PARKS", location: "CIVIC SQ" },
];

export default function GovernmentPanel() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-fg text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            05. AUTHORITY CONTROL
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        <div className="flex justify-between items-end">
          <h1 className="text-[7rem] font-black tracking-tighter leading-[0.8] uppercase">
            GOVERNMENT<br />PANEL
          </h1>
          <div className="flex gap-4">
            <div className="p-4 border-4 border-swiss-fg bg-swiss-muted text-center">
              <p className="text-[8px] font-black tracking-widest uppercase">ACTIVE NODES</p>
              <p className="text-2xl font-black">12</p>
            </div>
            <div className="p-4 border-4 border-swiss-fg bg-swiss-red text-swiss-bg text-center">
              <p className="text-[8px] font-black tracking-widest uppercase">PENDING APPROVAL</p>
              <p className="text-2xl font-black">08</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-swiss-fg/40" />
          <input 
            type="text" 
            placeholder="FILTER BY ISSUE ID OR DEPARTMENT..."
            className="w-full pl-16 pr-6 py-6 border-4 border-swiss-fg bg-swiss-bg text-sm font-bold tracking-tight focus:outline-none focus:border-swiss-red transition-all"
          />
        </div>
        <button className="px-12 py-6 border-4 border-swiss-fg font-black tracking-widest uppercase hover:bg-swiss-fg hover:text-swiss-bg transition-all flex items-center gap-3">
          <Filter className="w-5 h-5" />
          ADVANCED FILTERS
        </button>
        <button className="px-12 py-6 bg-swiss-red text-swiss-bg font-black tracking-widest uppercase hover:scale-105 transition-transform flex items-center gap-3 shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <CheckSquare className="w-5 h-5" />
          BULK ACTIONS
        </button>
      </div>

      {/* Management Table */}
      <div className="border-4 border-swiss-fg bg-swiss-bg overflow-hidden shadow-[16px_16px_0_0_rgba(255,48,0,0.1)]">
        <div className="p-8 border-b-4 border-swiss-fg bg-swiss-muted flex justify-between items-center swiss-diagonal">
          <p className="text-[10px] font-black tracking-widest uppercase">ACTIVE DEPARTMENTAL TASKS</p>
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-swiss-red" />
              <span className="text-[10px] font-black uppercase">URGENT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-swiss-fg" />
              <span className="text-[10px] font-black uppercase">STANDARD</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-swiss-fg text-[10px] font-black tracking-widest uppercase">
                <th className="px-8 py-6">ISSUE</th>
                <th className="px-8 py-6">PRIORITY</th>
                <th className="px-8 py-6">DEPARTMENT</th>
                <th className="px-8 py-6">LOCATION</th>
                <th className="px-8 py-6">STATUS</th>
                <th className="px-8 py-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-swiss-fg">
              {issues.map((issue, i) => (
                <tr key={i} className="group hover:bg-swiss-red/5 transition-colors">
                  <td className="px-8 py-8">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black tracking-widest text-swiss-fg/40 uppercase">{issue.id}</p>
                      <h4 className="text-sm font-black tracking-tighter uppercase leading-tight">{issue.title}</h4>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase border-2 border-swiss-fg ${issue.priority === 'CRITICAL' ? 'bg-swiss-red text-swiss-bg' : ''}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <span className="text-[10px] font-black tracking-widest uppercase">{issue.assigned}</span>
                  </td>
                  <td className="px-8 py-8 text-[10px] font-bold uppercase">{issue.location}</td>
                  <td className="px-8 py-8">
                    <select className="bg-transparent border-2 border-swiss-fg px-4 py-2 text-[10px] font-black tracking-widest uppercase outline-none focus:border-swiss-red">
                      <option>{issue.status}</option>
                      <option>IN PROGRESS</option>
                      <option>RESOLVED</option>
                      <option>REJECTED</option>
                    </select>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <button className="p-2 hover:bg-swiss-fg hover:text-swiss-bg transition-colors border-2 border-transparent hover:border-swiss-fg">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="border-4 border-swiss-fg p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 swiss-grid-pattern opacity-40 group-hover:bg-swiss-red/5 transition-colors" />
          <h3 className="text-3xl font-black tracking-tighter uppercase mb-6">COMPLIANCE METRICS</h3>
          <div className="space-y-4">
            {[
              { label: "AVG RESOLUTION TIME", val: "4.2 DAYS" },
              { label: "BUDGET UTILIZATION", val: "68.4%" },
              { label: "CITIZEN TRUST SCORE", val: "8.2/10" },
            ].map((m, i) => (
              <div key={i} className="flex justify-between items-end border-b-2 border-swiss-fg/10 pb-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40">{m.label}</span>
                <span className="text-xl font-black tracking-tighter uppercase">{m.val}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="border-4 border-swiss-fg p-12 bg-swiss-muted swiss-dots">
          <h3 className="text-3xl font-black tracking-tighter uppercase mb-6">SYSTEM UPDATES</h3>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-swiss-red bg-white">
              <p className="text-[8px] font-black tracking-widest text-swiss-red uppercase mb-1">MAJOR ALERT</p>
              <p className="text-[10px] font-bold uppercase leading-tight">CENTRAL HUB SYNCHRONIZATION ERROR DETECTED IN NODE-04</p>
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

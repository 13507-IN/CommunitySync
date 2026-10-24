"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Filter
} from "lucide-react";
import { getMyReports, type Report } from "@/lib/api";
import { AccountabilityModal } from "@/components/transparency/AccountabilityModal";

export default function MyReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchMyReports();
  }, []);

  async function fetchMyReports() {
    setIsLoading(true);
    try {
      const res = await getMyReports();
      if (res.data) {
        setReports(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch user reports:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredReports = reports.filter((r) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "pending") return r.status === "pending";
    if (statusFilter === "in_progress") return r.status === "assigned" || r.status === "in_progress";
    if (statusFilter === "resolved") return r.status === "completed" || r.status === "verified" || r.status === "closed";
    return true;
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const activeCount = reports.filter((r) => r.status === "assigned" || r.status === "in_progress").length;
  const resolvedCount = reports.filter((r) => r.status === "completed" || r.status === "verified" || r.status === "closed").length;

  function getStepIndex(status: string): number {
    switch (status) {
      case "pending": return 1;
      case "assigned": return 2;
      case "in_progress": return 3;
      case "completed": return 4;
      case "verified": 
      case "closed": return 5;
      default: return 1;
    }
  }

  function getSLAInfo(report: Report) {
    const createdAt = new Date(report.createdAt);
    const now = new Date();
    const hoursElapsed = Math.max(0, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
    const targetHours = report.urgency === "high" ? 24 : report.urgency === "medium" ? 48 : 72;
    const isOverdue = hoursElapsed > targetHours && report.status !== "completed" && report.status !== "verified" && report.status !== "closed";
    const remaining = Math.max(0, Math.round(targetHours - hoursElapsed));

    return {
      isOverdue,
      remaining,
      targetHours,
      elapsed: Math.round(hoursElapsed),
    };
  }

  const steps = [
    { label: "01. SUBMITTED", desc: "GPS Verified" },
    { label: "02. ASSIGNED", desc: "Dept Claimed" },
    { label: "03. IN PROGRESS", desc: "Field Team Dispatched" },
    { label: "04. RESOLVED", desc: "Awaiting Citizen Audit" },
    { label: "05. VERIFIED", desc: "Closed with QA" },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-red text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            08. CITIZEN TRACKING DOSSIER
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-[6.5rem] font-black tracking-tighter leading-[0.8] uppercase">
              MY<br />REPORTS
            </h1>
            <p className="text-xs md:text-sm font-bold uppercase tracking-tight text-swiss-fg/60 mt-3">
              TRACK REAL-TIME STATUS & DEPARTMENT ACCOUNTABILITY FOR ISSUES YOU REPORTED
            </p>
          </div>

          <Link
            href="/report"
            className="px-8 py-5 bg-swiss-fg text-swiss-bg font-black text-xs uppercase tracking-widest hover:bg-swiss-red transition-all flex items-center gap-3 shrink-0 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)]"
          >
            <PlusCircle className="w-4 h-4" />
            FILE NEW REPORT
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-swiss-fg bg-swiss-bg">
        <div className="p-6 border-b-4 md:border-b-0 border-r-4 border-swiss-fg">
          <p className="text-[9px] font-black tracking-widest uppercase text-swiss-fg/60 mb-2">TOTAL FILED</p>
          <p className="text-4xl md:text-5xl font-black">{isLoading ? "…" : reports.length}</p>
        </div>
        <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-swiss-fg bg-swiss-muted">
          <p className="text-[9px] font-black tracking-widest uppercase text-swiss-fg/60 mb-2">AWAITING CLAIM</p>
          <p className="text-4xl md:text-5xl font-black text-swiss-red">{isLoading ? "…" : pendingCount}</p>
        </div>
        <div className="p-6 border-r-4 border-swiss-fg">
          <p className="text-[9px] font-black tracking-widest uppercase text-swiss-fg/60 mb-2">UNDER ACTIVE WORK</p>
          <p className="text-4xl md:text-5xl font-black">{isLoading ? "…" : activeCount}</p>
        </div>
        <div className="p-6 bg-green-500/10">
          <p className="text-[9px] font-black tracking-widest uppercase text-green-700 mb-2">RESOLVED & VERIFIED</p>
          <p className="text-4xl md:text-5xl font-black text-green-700">{isLoading ? "…" : resolvedCount}</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b-4 border-swiss-fg pb-4">
        {[
          { id: "all", label: `ALL REPORTS (${reports.length})` },
          { id: "pending", label: `AWAITING DEPT (${pendingCount})` },
          { id: "in_progress", label: `ACTIVE WORK (${activeCount})` },
          { id: "resolved", label: `RESOLVED (${resolvedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest border-2 border-swiss-fg transition-all ${
              statusFilter === tab.id
                ? "bg-swiss-fg text-swiss-bg"
                : "bg-swiss-bg hover:bg-swiss-muted text-swiss-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-20 border-4 border-swiss-fg bg-swiss-bg">
          <Loader2 className="w-8 h-8 animate-spin text-swiss-red" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="border-4 border-swiss-fg p-12 md:p-16 text-center bg-swiss-muted swiss-grid-pattern space-y-6">
          <ClipboardList className="w-12 h-12 text-swiss-fg/30 mx-auto" />
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-swiss-fg">
              NO REPORTS FOUND IN THIS CATEGORY
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-swiss-fg/60 mt-1 max-w-md mx-auto">
              Every civic issue reported by you directly triggers zonal departmental alerts and automated SLA countdowns.
            </p>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-8 py-4 bg-swiss-red text-swiss-bg font-black text-xs uppercase tracking-widest hover:bg-swiss-fg transition-colors"
          >
            SUBMIT A REPORT NOW →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredReports.map((report) => {
            const stepIndex = getStepIndex(report.status);
            const sla = getSLAInfo(report);

            return (
              <div
                key={report.id}
                className="border-4 border-swiss-fg bg-swiss-bg shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-1"
              >
                {/* Report Card Header */}
                <div className="p-6 md:p-8 border-b-4 border-swiss-fg bg-swiss-muted/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black text-swiss-red uppercase">
                        #{report.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border border-swiss-fg ${
                        report.urgency === 'high' ? 'bg-swiss-red text-white' : 'bg-white'
                      }`}>
                        {report.urgency.toUpperCase()} URGENCY
                      </span>
                      <span className="px-2 py-0.5 bg-swiss-fg text-swiss-bg text-[8px] font-black uppercase tracking-widest">
                        {report.category.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-swiss-fg pt-1">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-bold text-swiss-fg/70 uppercase pt-1">
                      <MapPin className="w-3.5 h-3.5 text-swiss-red shrink-0" />
                      <span>{report.address || report.location}</span>
                    </div>
                  </div>

                  {/* SLA & Time Badge */}
                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 border-swiss-fg flex items-center gap-1.5 ${
                      sla.isOverdue 
                        ? 'bg-swiss-red text-white animate-pulse' 
                        : report.status === 'completed' || report.status === 'verified'
                        ? 'bg-green-600 text-white'
                        : 'bg-swiss-fg text-swiss-bg'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {sla.isOverdue 
                        ? "⚠️ SLA OVERDUE" 
                        : report.status === 'completed' || report.status === 'verified'
                        ? "RESOLVED ON TIME"
                        : `${sla.remaining}H SLA REMAINING`}
                    </span>
                    <span className="text-[9px] font-bold text-swiss-fg/50 uppercase">
                      FILED ON: {new Date(report.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 5-Step Visual Status Progress Bar */}
                <div className="p-6 md:p-8 bg-swiss-bg">
                  <p className="text-[9px] font-black uppercase tracking-widest text-swiss-fg/50 mb-4">
                    LIFECYCLE PROGRESS PIPELINE
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                    {steps.map((st, idx) => {
                      const isComplete = idx + 1 <= stepIndex;
                      const isCurrent = idx + 1 === stepIndex;

                      return (
                        <div
                          key={st.label}
                          className={`p-3 border-2 border-swiss-fg transition-all ${
                            isCurrent
                              ? "bg-swiss-fg text-swiss-bg shadow-[4px_4px_0_0_rgba(255,48,0,1)]"
                              : isComplete
                              ? "bg-swiss-muted border-swiss-fg/60 text-swiss-fg"
                              : "bg-swiss-bg/40 opacity-40 text-swiss-fg/50 border-dashed"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-black tracking-widest uppercase">
                              {st.label}
                            </span>
                            {isComplete && !isCurrent && (
                              <CheckCircle2 className="w-3 h-3 text-green-600" />
                            )}
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-swiss-red animate-ping" />
                            )}
                          </div>
                          <p className="text-[8px] font-bold uppercase truncate opacity-80">
                            {st.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-6 border-t-2 border-swiss-fg/10 bg-swiss-muted flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] font-bold text-swiss-fg/60 uppercase">
                    CIVIC TRANSPARENCY PROTOCOL • DIRECT DEPARTMENTAL AUDIT
                  </p>

                  <button
                    onClick={() => setSelectedReport(report)}
                    className="w-full sm:w-auto px-6 py-3 bg-swiss-fg text-swiss-bg font-black text-xs uppercase tracking-widest hover:bg-swiss-red transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-swiss-red group-hover:text-white" />
                    INSPECT RESPONSIBILITY & SLA
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accountability Modal Popup */}
      {selectedReport && (
        <AccountabilityModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

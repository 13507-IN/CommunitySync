"use client";

import React, { useEffect, useState } from "react";
import { 
  X, 
  Building2, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Loader2,
  Calendar,
  ArrowRight
} from "lucide-react";
import { type Report, type GovernmentAction, getReportActions } from "@/lib/api";

interface AccountabilityModalProps {
  report: Report | null;
  onClose: () => void;
}

export function AccountabilityModal({ report, onClose }: AccountabilityModalProps) {
  const [actions, setActions] = useState<GovernmentAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!report) return;

    let isMounted = true;
    setIsLoading(true);

    getReportActions(report.id)
      .then((res) => {
        if (isMounted && res.data) {
          setActions(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load responsibility chain:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [report]);

  if (!report) return null;

  // SLA Calculation
  const createdAt = new Date(report.createdAt);
  const now = new Date();
  const hoursElapsed = Math.max(0, (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
  
  // Target SLA based on urgency
  const slaTargetHours = report.urgency === "high" ? 24 : report.urgency === "medium" ? 48 : 72;
  const isOverdue = hoursElapsed > slaTargetHours && report.status !== "completed" && report.status !== "verified";
  const hoursRemaining = Math.max(0, Math.round(slaTargetHours - hoursElapsed));

  // Find assigned department or official
  const acceptAction = actions.find(a => a.actionType === "accept");
  const inProgressAction = actions.find(a => a.actionType === "in_progress");
  const completedAction = actions.find(a => a.actionType === "completed");

  const responsibleDept = acceptAction?.department || inProgressAction?.department || (report.status === "pending" ? "Awaiting Department Claim" : "Municipal Authority");
  const responsibleOfficer = acceptAction?.performedByName || inProgressAction?.performedByName || acceptAction?.performedByEmail || "Official Assignment Pending";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 font-swiss animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-swiss-fg/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-swiss-bg border-4 border-swiss-fg shadow-[16px_16px_0_0_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-6 border-b-4 border-swiss-fg bg-swiss-fg text-swiss-bg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-swiss-red" />
            <div>
              <span className="text-[9px] font-black tracking-widest uppercase text-swiss-red">
                PUBLIC ACCOUNTABILITY DOSSIER
              </span>
              <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
                WHO IS RESPONSIBLE FOR THIS ISSUE?
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border-2 border-swiss-bg hover:bg-swiss-red hover:border-swiss-red transition-colors"
          >
            <X className="w-5 h-5 text-swiss-bg" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 swiss-noise">
          {/* Issue Overview Card */}
          <div className="border-4 border-swiss-fg p-6 bg-swiss-muted swiss-grid-pattern space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-widest border-2 border-swiss-fg ${report.urgency === 'high' ? 'bg-swiss-red text-white' : 'bg-swiss-bg'}`}>
                  {report.urgency.toUpperCase()} URGENCY
                </span>
                <span className="px-2 py-1 bg-swiss-fg text-swiss-bg text-[8px] font-black uppercase tracking-widest">
                  {report.category.toUpperCase()}
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-swiss-fg/60">
                CASE ID: #{report.id.substring(0, 8).toUpperCase()}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-swiss-fg leading-none mb-2">
                {report.title}
              </h3>
              <p className="text-xs font-bold text-swiss-fg/70 leading-relaxed">
                {report.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t-2 border-swiss-fg/10 text-[10px] font-bold text-swiss-fg/60 uppercase">
              <div className="flex items-center gap-1.5 text-swiss-fg">
                <MapPin className="w-4 h-4 text-swiss-red shrink-0" />
                <span className="truncate max-w-[320px]">{report.address || report.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>REPORTED: {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Citizen SLA & Escalation Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Responsible Authority Banner */}
            <div className="border-4 border-swiss-fg p-5 bg-swiss-bg">
              <div className="flex items-center gap-2 text-swiss-fg/60 text-[9px] font-black uppercase tracking-widest mb-1">
                <Building2 className="w-4 h-4 text-swiss-red" />
                PRIMARY CUSTODIAN DEPT
              </div>
              <p className="text-lg font-black uppercase tracking-tight text-swiss-fg truncate">
                {responsibleDept}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase text-swiss-fg/60">
                <User className="w-3 h-3 text-swiss-fg" />
                <span>OFFICER: {responsibleOfficer}</span>
              </div>
            </div>

            {/* SLA Clock & Overdue Flag */}
            <div className={`border-4 border-swiss-fg p-5 ${isOverdue ? 'bg-swiss-red text-swiss-bg' : 'bg-swiss-bg'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isOverdue ? 'text-swiss-bg/80' : 'text-swiss-fg/60'}`}>
                  MUNICIPAL SLA TARGET ({slaTargetHours}H)
                </span>
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-lg font-black uppercase tracking-tight">
                {isOverdue 
                  ? "⚠️ RESOLUTION OVERDUE" 
                  : report.status === "completed" || report.status === "verified"
                  ? "✅ RESOLVED ON TIME"
                  : `⏱️ ${hoursRemaining}H REMAINING`}
              </p>
              <p className={`text-[9px] font-bold uppercase mt-2 ${isOverdue ? 'text-swiss-bg/80' : 'text-swiss-fg/60'}`}>
                {isOverdue 
                  ? `Overdue by ${Math.round(hoursElapsed - slaTargetHours)}h — Auto-escalated to Chief Ward Officer`
                  : `Logged ${Math.round(hoursElapsed)} hours ago — Operating within standard response limits`}
              </p>
            </div>
          </div>

          {/* Full Public Responsibility Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-swiss-fg pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-swiss-fg">
                02. PUBLIC RESPONSIBILITY CHAIN (VERIFIED AUDIT)
              </span>
              <span className="text-[8px] font-bold uppercase text-swiss-fg/50">
                IMMUTABLE CIVIC LOG
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-6 h-6 animate-spin text-swiss-red" />
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-swiss-fg/20 pl-8">
                {/* Stage 1: Citizen Submission */}
                <div className="relative">
                  <span className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-swiss-fg text-swiss-bg flex items-center justify-center text-[10px] font-black border-2 border-swiss-fg">
                    1
                  </span>
                  <div className="border-2 border-swiss-fg p-4 bg-swiss-bg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">CITIZEN REPORT FILED</span>
                      <span className="text-[8px] font-bold text-swiss-fg/50">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-swiss-fg/70">
                      Geotagged at {report.address || report.location}. Submitted with GPS validation.
                    </p>
                  </div>
                </div>

                {/* Stage 2: Department Claim & Assignment */}
                <div className="relative">
                  <span className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-swiss-fg ${
                    acceptAction ? 'bg-swiss-red text-swiss-bg' : 'bg-swiss-muted text-swiss-fg/40'
                  }`}>
                    2
                  </span>
                  <div className={`border-2 border-swiss-fg p-4 ${acceptAction ? 'bg-swiss-bg' : 'bg-swiss-muted/60'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">
                        {acceptAction ? "DEPARTMENT CLAIMED & ASSIGNED" : "PENDING DEPARTMENT CLAIM"}
                      </span>
                      {acceptAction && (
                        <span className="text-[8px] font-bold text-swiss-fg/50">
                          {new Date(acceptAction.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {acceptAction ? (
                      <div className="space-y-1.5 text-[10px]">
                        <p className="font-bold text-swiss-fg">
                          Responsible Dept: <span className="text-swiss-red uppercase">{acceptAction.department}</span>
                        </p>
                        <p className="text-swiss-fg/70">
                          Officer Assigned: <span className="font-bold">{acceptAction.performedByName || acceptAction.performedByEmail || "Government Officer"}</span>
                        </p>
                        {acceptAction.remarks && (
                          <p className="p-2 bg-swiss-muted border border-swiss-fg/20 text-swiss-fg italic">
                            "{acceptAction.remarks}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-swiss-fg/60">
                        Dispatched to relevant municipal zonal departments. Any registered government officer can claim responsibility.
                      </p>
                    )}
                  </div>
                </div>

                {/* Stage 3: Field Operations / In Progress */}
                <div className="relative">
                  <span className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-swiss-fg ${
                    inProgressAction || completedAction ? 'bg-swiss-red text-swiss-bg' : 'bg-swiss-muted text-swiss-fg/40'
                  }`}>
                    3
                  </span>
                  <div className={`border-2 border-swiss-fg p-4 ${inProgressAction || completedAction ? 'bg-swiss-bg' : 'bg-swiss-muted/60'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">
                        {inProgressAction || completedAction ? "FIELD WORK & WORK ORDERS" : "FIELD ACTION SCHEDULED"}
                      </span>
                      {inProgressAction && (
                        <span className="text-[8px] font-bold text-swiss-fg/50">
                          {new Date(inProgressAction.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {inProgressAction ? (
                      <div className="space-y-1 text-[10px]">
                        <p className="font-bold text-swiss-fg">
                          Field Status: <span className="text-swiss-red uppercase">ACTIVE IN PROGRESS</span>
                        </p>
                        {inProgressAction.remarks && (
                          <p className="p-2 bg-swiss-muted border border-swiss-fg/20 text-swiss-fg italic">
                            "{inProgressAction.remarks}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-swiss-fg/60">
                        {report.status === "in_progress" 
                          ? "On-site dispatch initiated." 
                          : "Scheduled upon department acceptance."}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stage 4: Resolution & Verification */}
                <div className="relative">
                  <span className={`absolute -left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-swiss-fg ${
                    report.status === "completed" || report.status === "verified" ? 'bg-green-600 text-white' : 'bg-swiss-muted text-swiss-fg/40'
                  }`}>
                    4
                  </span>
                  <div className={`border-2 border-swiss-fg p-4 ${report.status === "completed" || report.status === "verified" ? 'bg-green-50/50' : 'bg-swiss-muted/60'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase">
                        {report.status === "verified" 
                          ? "COMMUNITY VERIFIED & CLOSED" 
                          : report.status === "completed"
                          ? "RESOLUTION AWAITING CITIZEN AUDIT"
                          : "FINAL QUALITY ASSURANCE"}
                      </span>
                      {completedAction && (
                        <span className="text-[8px] font-bold text-swiss-fg/50">
                          {new Date(completedAction.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {report.status === "completed" || report.status === "verified" ? (
                      <div className="space-y-2 text-[10px]">
                        <p className="text-green-700 font-bold">
                          Official declared work resolved. Open for community peer audit in the Verification Queue.
                        </p>
                        {completedAction?.remarks && (
                          <p className="p-2 bg-white border border-swiss-fg/20 text-swiss-fg italic">
                            "{completedAction.remarks}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-swiss-fg/60">
                        Citizen peer reviewers will inspect evidence photos once marked resolved by the authorities.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 border-t-4 border-swiss-fg bg-swiss-muted flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-swiss-fg/60">
            PRAHARI TRANSPARENCY PROTOCOL • OPEN CIVIC GOVERNANCE
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-swiss-fg text-swiss-bg font-black text-xs uppercase tracking-widest hover:bg-swiss-red transition-colors"
          >
            DISMISS DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
}

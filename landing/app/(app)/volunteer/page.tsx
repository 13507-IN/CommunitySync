"use client";

import React from "react";
import { Users, Target, Zap, Clock, MapPin, ArrowRight } from "lucide-react";

const tasks = [
  { id: "V-102", title: "CLEANUP DRIVE SECTOR 12", location: "CENTRAL PARK", urgency: "HIGH", points: "+50 XP", skills: "PHYSICAL" },
  { id: "V-103", title: "UTILITY DATA COLLECTION", location: "OLD TOWN", urgency: "MEDIUM", points: "+30 XP", skills: "DIGITAL" },
  { id: "V-104", title: "TREE PLANTATION INITIATIVE", location: "GREEN BELT", urgency: "LOW", points: "+20 XP", skills: "ENVIRONMENT" },
  { id: "V-105", title: "TRAFFIC MONITORING ASSIST", location: "BYPASS RD", urgency: "HIGH", points: "+45 XP", skills: "SAFETY" },
  { id: "V-106", title: "LOCAL INFRA SURVEY", location: "HOUSING BLOCK", urgency: "MEDIUM", points: "+35 XP", skills: "SURVEY" },
  { id: "V-107", title: "EMERGENCY AID SUPPORT", location: "CIVIC CENTER", urgency: "HIGH", points: "+100 XP", skills: "FIRST AID" },
];

export default function VolunteerPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-swiss-red text-swiss-bg text-[10px] font-black tracking-widest uppercase">
            04. COMMUNITY ACTION
          </span>
          <div className="h-px flex-1 bg-swiss-fg/10" />
        </div>
        <div className="flex justify-between items-end">
          <h1 className="text-[7rem] font-black tracking-tighter leading-[0.8] uppercase">
            VOLUNTEER<br />NETWORK
          </h1>
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-black tracking-widest uppercase">YOUR IMPACT SCORE</p>
            <div className="flex items-center gap-4">
              <span className="text-6xl font-black tracking-tighter">840</span>
              <div className="w-12 h-12 bg-swiss-fg text-swiss-bg flex items-center justify-center border-2 border-swiss-red">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Badges Marquee */}
      <div className="border-y-4 border-swiss-fg py-6 overflow-hidden bg-swiss-muted swiss-diagonal">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[1, 2].map((m) => (
            <div key={m} className="flex gap-16 items-center">
              {["TOP CONTRIBUTOR", "24H RESPONSE GOLD", "COMMUNITY HERO", "EXPERT SURVEYOR"].map((badge) => (
                <div key={badge} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-swiss-red rotate-45" />
                  <span className="text-[10px] font-black tracking-widest uppercase">{badge}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task, i) => (
          <div key={i} className="border-4 border-swiss-fg p-8 flex flex-col justify-between hover:bg-swiss-fg group transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase border-2 border-swiss-fg group-hover:border-swiss-bg group-hover:text-swiss-bg ${task.urgency === 'HIGH' ? 'bg-swiss-red group-hover:bg-swiss-red' : ''}`}>
                {task.urgency}
              </span>
            </div>
            
            <div className="space-y-6">
              <p className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/40 group-hover:text-swiss-bg/40">{task.id}</p>
              <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight group-hover:text-swiss-bg">
                {task.title}
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase group-hover:text-swiss-muted">
                  <MapPin className="w-4 h-4" />
                  {task.location}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase group-hover:text-swiss-muted">
                  <Zap className="w-4 h-4 text-swiss-red" />
                  {task.points}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t-2 border-swiss-fg/10 group-hover:border-swiss-bg/20 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-widest uppercase text-swiss-fg/60 group-hover:text-swiss-muted">{task.skills}</span>
              <button className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase group-hover:text-swiss-red transition-colors">
                ACCEPT <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div className="border-4 border-swiss-fg p-12 bg-swiss-fg text-swiss-bg flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 swiss-dots opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-4">
            WANT TO DO<br />MORE?
          </h2>
          <p className="text-xs font-bold text-swiss-bg/60 tracking-widest uppercase">CONNECT WITH LOCAL NGOs TO LEAD YOUR OWN PROJECT</p>
        </div>
        <button className="relative z-10 px-12 py-6 bg-swiss-red text-swiss-bg font-black tracking-widest uppercase hover:scale-105 transition-transform flex items-center gap-4">
          CONTACT PARTNERS <Users className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

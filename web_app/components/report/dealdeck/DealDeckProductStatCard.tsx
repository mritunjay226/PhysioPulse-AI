'use client';

import React from 'react';
import { ChevronDown, Activity, Sparkles, ShieldCheck } from 'lucide-react';

export function DealDeckProductStatCard() {
  const items = [
    {
      id: '1',
      name: 'Frozen Shoulder Abduction (P1)',
      value: '110° ROM',
      change: '+18.4%',
      isPositive: true,
      icon: Activity,
    },
    {
      id: '2',
      name: 'Bilateral Wall-Slide Sync (P5)',
      value: '141° ROM',
      change: '+24.1%',
      isPositive: true,
      icon: Sparkles,
    },
    {
      id: '3',
      name: 'Cervical Posture Guard (P3)',
      value: '100° ROM',
      change: '+12.0%',
      isPositive: true,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base font-sans tracking-tight">
            Restored Joint Mobility
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Active joint angles vs clinical targets
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span>Today</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Concentric Multi-Ring Arcs & Center Score */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-52 h-52 -rotate-90 transform" viewBox="0 0 200 200">
          {/* Inner Grey Ring */}
          <circle
            cx="100"
            cy="100"
            r="55"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="11"
            strokeDasharray="345"
            strokeDashoffset="100"
            strokeLinecap="round"
          />
          {/* Middle Red Ring */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="#EF4444"
            strokeWidth="11"
            strokeDasharray="440"
            strokeDashoffset="130"
            strokeLinecap="round"
          />
          {/* Outer Blue Ring */}
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="#3B66F5"
            strokeWidth="11"
            strokeDasharray="534"
            strokeDashoffset="90"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            141°
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">
            Peak ROM Restored
          </span>
          <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#D4F7DC] text-[#15803D] text-[10px] font-bold">
            +33° Restored
          </div>
        </div>
      </div>

      {/* List items below */}
      <div className="flex flex-col divide-y divide-slate-100 mt-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-extrabold text-slate-900 font-sans">
                  {item.value}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4F7DC] text-[#15803D]">
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

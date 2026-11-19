'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export function DealDeckCustomerGrowthCard() {
  const regions = [
    { name: 'Shoulder & Glenohumeral', icon: '🦾', pct: 96 },
    { name: 'Cervical & Upper Trapezius', icon: '🧘🏽', pct: 94 },
    { name: 'Bilateral Scapular Rhythm', icon: '👐🏽', pct: 98 },
    { name: 'Thoracic Axial Alignment', icon: '🩻', pct: 92 },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base font-sans tracking-tight">
            Kinetic Recovery Zones
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted alignment by body area
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Overlapping Blue Bubble Cluster Graphic */}
        <div className="relative w-40 h-40 mx-auto">
          {/* Top Left Bubble (Neck: 100°) */}
          <div className="absolute top-4 left-2 w-14 h-14 rounded-full bg-[#9BB7FF] text-white flex flex-col items-center justify-center text-xs font-extrabold shadow-sm">
            <span>100°</span>
            <span className="text-[8px] font-normal opacity-90">Neck</span>
          </div>

          {/* Top Right Dark Blue Bubble (Wall-Slide: 141°) */}
          <div className="absolute top-1 right-2 w-20 h-20 rounded-full bg-[#1E3EB4] text-white flex flex-col items-center justify-center text-sm font-extrabold shadow-md z-10">
            <span>141°</span>
            <span className="text-[9px] font-normal opacity-90">Arms</span>
          </div>

          {/* Bottom Left Medium Blue Bubble (Shoulder: 110°) */}
          <div className="absolute bottom-2 left-0 w-22 h-22 rounded-full bg-[#3B66F5] text-white flex flex-col items-center justify-center text-sm font-extrabold shadow-lg z-20">
            <span>110°</span>
            <span className="text-[9px] font-normal opacity-90">Shoulder</span>
          </div>

          {/* Bottom Right Blue Bubble (Symmetry: 96%) */}
          <div className="absolute bottom-4 right-1 w-16 h-16 rounded-full bg-[#4E75FA] text-white flex flex-col items-center justify-center text-xs font-extrabold shadow-sm z-10">
            <span>96%</span>
            <span className="text-[8px] font-normal opacity-90">Sym</span>
          </div>
        </div>

        {/* Region Progress Bars on Right */}
        <div className="flex flex-col gap-3">
          {regions.map((reg) => (
            <div key={reg.name} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs">{reg.icon}</span>
                  <span className="font-bold text-slate-800 truncate">
                    {reg.name}
                  </span>
                </div>
                <span className="font-extrabold text-[#3B66F5] font-mono shrink-0">
                  {reg.pct}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B66F5] rounded-full transition-all duration-500"
                  style={{ width: `${reg.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

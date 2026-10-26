'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Stethoscope } from 'lucide-react';

export function SessionBrowserChrome() {
  return (
    <div className="h-10 bg-slate-100/90 border-b border-slate-200/80 px-4 flex items-center justify-between text-xs text-slate-500 select-none no-print font-sans">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80 border border-rose-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/30" />
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-semibold transition-all shadow-xs"
          title="Return to Patient 3D Overview"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>Overview</span>
        </Link>
      </div>

      {/* Clinical Telemetry Address Pill */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-0.5 text-[11px] text-slate-600 shadow-xs max-w-sm w-full justify-center font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping-subtle" />
        <span className="text-blue-600 font-bold">healix.com/session</span>
        <span className="text-zinc-500 text-[10px] ml-1">· Closed-Loop Studio</span>
      </div>

      {/* Attending Physician Pill */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] text-slate-600 font-sans">
          <Stethoscope className="w-3 h-3 text-blue-600" />
          <span className="font-medium">Dr. S. Smith, MD (Attending)</span>
        </div>
      </div>
    </div>
  );
}

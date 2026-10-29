'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Stethoscope } from 'lucide-react';

export function SessionBrowserChrome() {
  return (
    <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-500 select-none no-print font-sans">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold transition-colors shadow-xs"
          title="Return to Home"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-emerald-600" />
          <span>Home</span>
        </Link>
      </div>

      {/* Clinical Telemetry Address Pill */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-0.5 text-[11px] text-slate-600 shadow-xs max-w-sm w-full justify-center font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        <span className="text-emerald-700 font-bold">physiopulse.ai/session</span>
        <span className="text-slate-400 text-[10px] ml-1">· Clinical Motion Studio</span>
      </div>

      {/* Attending Physician Pill */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px] text-slate-700 font-sans shadow-xs">
          <Stethoscope className="w-3 h-3 text-emerald-600" />
          <span className="font-medium">Dr. S. Smith, MD (Attending)</span>
        </div>
      </div>
    </div>
  );
}

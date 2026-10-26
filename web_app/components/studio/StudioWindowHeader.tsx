'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Sun } from 'lucide-react';

export function StudioWindowHeader() {
  return (
    <div className="h-12 bg-slate-100/90 border-b border-slate-200/80 px-4 flex items-center justify-between text-xs text-slate-500 select-none">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-rose-400/80 border border-rose-500/30" />
          <span className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/30" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/80 border border-emerald-500/30" />
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <ChevronLeft className="w-3.5 h-3.5" />
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* URL / Search Pill */}
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1 text-[11px] text-slate-600 shadow-xs max-w-sm w-full justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="font-medium tracking-tight font-sans">healix.com</span>
          <span className="text-slate-400 text-[10px]">· Curtis Valk (34)</span>
        </div>
        <Search className="w-3 h-3 text-slate-400" />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 bg-white px-2.5 py-1 rounded-full border border-slate-200/80 text-[11px]">
          <Image
            src="/doctor_smith.png"
            alt="Dr. Smith"
            width={18}
            height={18}
            className="w-4.5 h-4.5 rounded-full object-cover"
          />
          <span className="text-slate-700 font-medium font-sans">Dr. S. Smith, MD</span>
        </div>
        <button
          className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
          title="Studio Settings"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
        <button
          className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-600 transition-colors"
          title="Light Theme Active"
        >
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        </button>
      </div>
    </div>
  );
}

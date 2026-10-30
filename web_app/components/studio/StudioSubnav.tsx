'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Share2,
  Bookmark,
  Printer,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export function StudioSubnav() {
  return (
    <div className="h-14 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-emerald-500/30 group-hover:bg-emerald-50/50 transition-colors">
            <Image
              src="/logo.svg"
              alt="PhysioPulse AI Logo"
              width={24}
              height={20}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-slate-900 font-extrabold tracking-tight text-base font-sans">
            PhysioPulse <span className="text-emerald-600 font-mono text-xs font-bold">AI</span>
          </span>
        </Link>
        <span className="text-slate-300 font-light hidden sm:inline">/</span>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium font-sans">
          <span className="hover:text-slate-800 cursor-pointer">Patients</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold flex items-center gap-1 cursor-pointer">
            Curtis Valk
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-sans">
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Curtis Valk — PhysioPulse AI Bio-Kinematics Dossier',
                url: window.location.href
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Dossier URL copied to clipboard');
            }
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Share Patient Dossier"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Bookmark Record"
        >
          <Bookmark className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.print()}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Print Dossier"
        >
          <Printer className="w-4 h-4" />
        </button>
        <Link
          href="/session"
          className="ml-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <span>Live Session</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

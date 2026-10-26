'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowRight, Eye } from 'lucide-react';
import { HotspotJoint } from './StudioAnatomicalHero';

export interface DiagnosticScan {
  id: string;
  name: string;
  type: string;
  date: string;
  image: string;
  aspect: string;
}

export interface StudioDiagnosticDrawerProps {
  selectedJoint: HotspotJoint;
  scans: DiagnosticScan[];
  onSelectScan: (scan: DiagnosticScan) => void;
}

export function StudioDiagnosticDrawer({
  selectedJoint,
  scans,
  onSelectScan
}: StudioDiagnosticDrawerProps) {
  return (
    <div className="w-full lg:w-[320px] shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm relative z-10 flex flex-col justify-between theme-card">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">
                Active Telemetry Pin
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-base font-sans">
              {selectedJoint.name}
            </h3>
          </div>

          <span
            className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
              selectedJoint.status === 'optimal'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : selectedJoint.status === 'recovering'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {selectedJoint.status}
          </span>
        </div>

        {/* Selected Joint Telemetry Metrics */}
        <div className="grid grid-cols-2 gap-2 mt-3 font-mono">
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Active ROM</span>
            <span className="text-sm font-bold text-blue-600 mt-0.5 block">
              {selectedJoint.romCurrent}
            </span>
            <span className="text-[10px] text-slate-400">Target: {selectedJoint.romTarget}</span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Symmetry</span>
            <span className="text-sm font-bold text-slate-800 mt-0.5 block">
              {selectedJoint.symmetryPct}%
            </span>
            <span className="text-[10px] text-emerald-600">Bilateral Ratio</span>
          </div>
        </div>

        {/* ROM Target Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1 font-mono">
            <span>Range of Motion Goal</span>
            <span className="font-bold text-slate-800">{selectedJoint.romProgressPct}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${selectedJoint.romProgressPct}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Imaging Scans Carousel */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              Diagnostic Scans (4)
            </span>
            <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="group relative rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all bg-slate-100"
              >
                <div className="relative h-20 w-full bg-slate-900">
                  <Image
                    src={scan.image}
                    alt={scan.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 150px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-white font-medium truncate block max-w-[110px]">
                    {scan.name}
                  </span>
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-black/50 backdrop-blur-xs flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 14-Day Recovery Trajectory Miniature */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
              Recovery Trajectory
            </span>
            <span className="text-[10px] text-emerald-600 font-bold font-mono">+18% vs Baseline</span>
          </div>
          <div className="h-16 w-full bg-slate-50/70 rounded-xl p-2 border border-slate-100 relative overflow-hidden flex items-end">
            {/* SVG Sparkline */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
              <path
                d="M 0 35 Q 25 32, 40 24 T 70 14 T 100 6"
                fill="none"
                stroke="#1865F2"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="6" r="3" fill="#1865F2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Primary Action Button: + Add Record / Start Session */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          href="/session"
          className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all group"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add record (Live Session)</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </Link>
      </div>
    </div>
  );
}

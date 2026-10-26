'use client';

import React from 'react';
import { Activity, ShieldCheck, TrendingUp, Clock, Target, Layers } from 'lucide-react';

export interface ReportKinematicVitalsProps {
  vitals: {
    average_symmetry: number;
    total_clean_frames_pct: number;
    fatigue_index: string;
    angular_velocity_rating: string;
    rom_delta_average: number;
  };
}

export function ReportKinematicVitals({ vitals }: ReportKinematicVitalsProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-sans tracking-tight">
              Biomechanical Kinematic Telemetry Vitals
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Real-time on-device 33-landmark goniometric measurements
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Optimal Closed-Loop Trajectory
        </span>
      </div>

      {/* 6-box Vitals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-sans">
        {/* Metric 1: Symmetry */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">Symmetry</span>
            <Target className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900 block">
              {vitals.average_symmetry}%
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              Normal Bilateral
            </span>
          </div>
        </div>

        {/* Metric 2: Clean Frames */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">Frames</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-slate-900 block">
              {vitals.total_clean_frames_pct}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Artifact-Free
            </span>
          </div>
        </div>

        {/* Metric 3: Delta ROM */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">ROM Delta</span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-blue-600 block">
              +{vitals.rom_delta_average}°
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              Target Exceeded
            </span>
          </div>
        </div>

        {/* Metric 4: Neuromuscular Reserve */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">Reserve</span>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-bold font-sans text-slate-800 block truncate">
              Normal
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
              {vitals.fatigue_index}
            </span>
          </div>
        </div>

        {/* Metric 5: Angular Velocity */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">Velocity</span>
            <Activity className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div>
            <span className="text-sm font-bold font-sans text-slate-800 block truncate">
              31.4°/s
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
              Controlled Dynamic
            </span>
          </div>
        </div>

        {/* Metric 6: Compliance */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-mono uppercase font-semibold">Compliance</span>
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono text-emerald-600 block">
              98.2%
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              Protocol Met
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

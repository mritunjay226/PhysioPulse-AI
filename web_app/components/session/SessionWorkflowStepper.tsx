'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, ChevronRight, Activity } from 'lucide-react';

export interface SessionWorkflowStepperProps {
  activeStage: 1 | 2 | 3;
  setActiveStage: (stage: 1 | 2 | 3) => void;
  canAccessStage2: boolean;
  canAccessStage3: boolean;
}

export function SessionWorkflowStepper({
  activeStage,
  setActiveStage,
  canAccessStage2,
  canAccessStage3
}: SessionWorkflowStepperProps) {
  return (
    <header className="px-6 py-4 border-b border-slate-200/80 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 no-print select-none">
      <div className="flex items-center gap-3.5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-100 text-lg tracking-tight font-sans">
                Healix <span className="text-blue-600">Kinematics</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                Clinical v2.4
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-sans">
              Autonomous Markerless Computer Vision Closed-Loop Rehabilitation
            </p>
          </div>
        </Link>
      </div>

      {/* Engine Status Badges */}
      <div className="hidden xl:flex items-center gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="font-medium">MediaPipe 33-Keypoints</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-blue-700">
          <Activity className="w-3.5 h-3.5" />
          <span className="font-medium">EMA Filter 60Hz</span>
        </div>
      </div>

      {/* Daylight Clinical 3-Stage Stepper */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 overflow-x-auto text-xs font-sans">
        {/* Step 1 */}
        <button
          onClick={() => setActiveStage(1)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 1
              ? 'bg-white text-blue-700 border border-slate-200/90 shadow-xs'
              : 'text-slate-600 hover:text-zinc-100 hover:bg-white/60 border border-transparent'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 1 ? 'bg-blue-600 text-white font-extrabold' : 'bg-slate-200 text-slate-600'
            }`}
          >
            1
          </div>
          <span>Intake & Triage</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />

        {/* Step 2 */}
        <button
          onClick={() => canAccessStage2 && setActiveStage(2)}
          disabled={!canAccessStage2}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 2
              ? 'bg-white text-blue-700 border border-slate-200/90 shadow-xs'
              : canAccessStage2
              ? 'text-slate-600 hover:text-zinc-100 hover:bg-white/60 border border-transparent'
              : 'text-slate-400 cursor-not-allowed opacity-40 border border-transparent'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 2
                ? 'bg-blue-600 text-white font-extrabold'
                : canAccessStage2
                ? 'bg-slate-200 text-slate-600'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            2
          </div>
          <span>Vision Queue</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />

        {/* Step 3 */}
        <button
          onClick={() => canAccessStage3 && setActiveStage(3)}
          disabled={!canAccessStage3}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 3
              ? 'bg-white text-blue-700 border border-slate-200/90 shadow-xs'
              : canAccessStage3
              ? 'text-slate-600 hover:text-zinc-100 hover:bg-white/60 border border-transparent'
              : 'text-slate-400 cursor-not-allowed opacity-40 border border-transparent'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 3
                ? 'bg-blue-600 text-white font-extrabold'
                : canAccessStage3
                ? 'bg-slate-200 text-slate-600'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            3
          </div>
          <span>Clinical Report</span>
        </button>
      </div>
    </header>
  );
}

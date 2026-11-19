'use client';

import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

interface DealDeckKpiCardsProps {
  score?: string;
  scoreChange?: string;
  totalExercises?: string;
  exercisesChange?: string;
  symmetry?: string;
  symmetryChange?: string;
  duration?: string;
  durationChange?: string;
}

export function DealDeckKpiCards({
  score = '100%',
  scoreChange = '+18.4%',
  totalExercises = '10 / 10 Reps',
  exercisesChange = '100%',
  symmetry = '95%',
  symmetryChange = '+4.2%',
  duration = '39s Active',
  durationChange = '+12.1%',
}: DealDeckKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* 1. Featured Royal Blue Card: Overall Recovery Score */}
      <div className="relative overflow-hidden rounded-3xl bg-[#3B66F5] text-white p-5.5 shadow-md flex flex-col justify-between min-h-[160px] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#3B66F5] flex items-center justify-center shadow-xs">
            <Award className="w-5 h-5 text-[#3B66F5]" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B4F481] text-[#1E5624] text-[11px] font-bold">
            <span>{scoreChange}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-medium text-blue-100">
            Overall Compliance Score
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight font-sans">
              {score}
            </span>
            <span className="text-[11px] text-blue-100/80 font-medium">
              Target goal achieved
            </span>
          </div>
        </div>
      </div>

      {/* 2. Total Exercises Completed */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5.5 shadow-2xs flex flex-col justify-between min-h-[160px] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4F7DC] text-[#15803D] text-[11px] font-bold">
            <span>{exercisesChange}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-600">
            Completed Protocol Reps
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {totalExercises}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              3 protocols finished
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bilateral Symmetry */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5.5 shadow-2xs flex flex-col justify-between min-h-[160px] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4F7DC] text-[#15803D] text-[11px] font-bold">
            <span>{symmetryChange}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-600">
            Bilateral Symmetry
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {symmetry}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Clean kinetic balance
            </span>
          </div>
        </div>
      </div>

      {/* 4. Active Movement Duration */}
      <div className="rounded-3xl bg-white border border-slate-200/80 p-5.5 shadow-2xs flex flex-col justify-between min-h-[160px] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Clock className="w-5 h-5 text-slate-600" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4F7DC] text-[#15803D] text-[11px] font-bold">
            <span>{durationChange}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold text-slate-600">
            Active Motion Time
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
              {duration}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              33-point markerless tracking
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { DealDeckReportHeader } from './DealDeckReportHeader';
import { DealDeckKpiCards } from './DealDeckKpiCards';
import { DealDeckHabitsCard } from './DealDeckHabitsCard';
import { DealDeckProductStatCard } from './DealDeckProductStatCard';
import { DealDeckCustomerGrowthCard } from './DealDeckCustomerGrowthCard';
import { SessionReport } from '@/lib/clinical-engine';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface DealDeckReportViewProps {
  sessionReport?: SessionReport | null;
  patientName?: string;
}

export function DealDeckReportView({
  sessionReport,
  patientName,
}: DealDeckReportViewProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Compute dynamic stats if sessionReport exists
  const hasReport = !!sessionReport;
  const compliance = sessionReport?.overall_compliance_percent ?? 100;
  const exercises = sessionReport?.exercises_performed ?? [];
  const totalRepsDone = exercises.reduce((acc, ex) => acc + ex.completed_reps, 0);
  const totalRepsTarget = exercises.reduce((acc, ex) => acc + ex.prescribed_reps, 0);
  const meanSymmetry = exercises.length > 0
    ? Math.round(exercises.reduce((acc, ex) => acc + ex.mean_symmetry_percent, 0) / exercises.length)
    : 95;

  const totalDurationSecs = exercises.reduce((acc, ex) => acc + (ex.duration_seconds || 15), 0);
  const durationMinutes = Math.floor(totalDurationSecs / 60);
  const durationRemainder = Math.round(totalDurationSecs % 60);
  const durationStr = durationMinutes > 0 ? `${durationMinutes}m ${durationRemainder}s` : `${durationRemainder}s`;

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto pb-12 font-sans selection:bg-[#3B66F5] selection:text-white">
      {/* 1. Header (Title, Date, Search, Notifications & User Badge) */}
      <DealDeckReportHeader
        title="Recovery Report"
      />

      {/* 2. Main Two-Column Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left & Center Column (7 cols): KPI Cards + Customer Habits */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Top 4 KPI Metrics */}
          <DealDeckKpiCards
            score={hasReport ? `${compliance}%` : '$612.917'}
            scoreChange="+2,08%"
            totalExercises={hasReport ? `${totalRepsDone}/${totalRepsTarget}` : '34.760'}
            exercisesChange="+12,4%"
            symmetry={hasReport ? `${meanSymmetry}%` : '14.987'}
            symmetryChange="-2,08%"
            duration={hasReport ? durationStr : '12.987'}
            durationChange="+12,1%"
          />

          {/* Customer Habits / Daily Movement Chart */}
          <DealDeckHabitsCard />
        </div>

        {/* Right Column (5 cols): Product Statistic & Customer Growth */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Product Statistic Multi-Ring Radial */}
          <DealDeckProductStatCard />

          {/* Customer Growth Bubble Diagram */}
          <DealDeckCustomerGrowthCard />
        </div>
      </div>

      {/* 3. Clean Optional Clinical Protocol Breakdown Accordion */}
      {hasReport && exercises.length > 0 && (
        <div className="mt-2 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Detailed Exercise Protocols Completed ({exercises.length})
                </h4>
                <p className="text-xs text-slate-400">
                  Tap to view individual range of motion angles and clean form metrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {showDetails && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Protocol #{ex.protocol_id}
                      </span>
                      <h5 className="font-bold text-xs text-slate-900 mt-1.5 line-clamp-1">
                        {ex.protocol_name}
                      </h5>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">Peak ROM</span>
                        <p className="font-extrabold text-[#3B66F5] font-mono">
                          {ex.achieved_peak_rom_degrees}°
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium">Symmetry</span>
                        <p className="font-extrabold text-slate-800 font-mono">
                          {ex.mean_symmetry_percent}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

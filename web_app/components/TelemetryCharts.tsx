'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ExerciseReportItem, SessionReport } from '@/lib/clinical-engine';

export interface TelemetryChartsProps {
  exercises?: ExerciseReportItem[];
  sessionReport?: SessionReport | null;
  report?: SessionReport;
}

export function TelemetryCharts({ exercises, sessionReport, report }: TelemetryChartsProps) {
  const exList = exercises || sessionReport?.exercises_performed || report?.exercises_performed || [];
  const [selectedTrajectoryDay, setSelectedTrajectoryDay] = useState<number | null>(13); // Default Day 14

  // Simulated 14-day longitudinal recovery dataset based on clinical biomechanics progression
  const trajectory = [
    { day: 'Day 1', date: 'Sep 10', rom: 68, symmetry: 72, compensations: 24, milestone: 'Baseline' },
    { day: 'Day 2', date: 'Sep 11', rom: 72, symmetry: 74, compensations: 22 },
    { day: 'Day 3', date: 'Sep 12', rom: 75, symmetry: 76, compensations: 18 },
    { day: 'Day 4', date: 'Sep 13', rom: 79, symmetry: 78, compensations: 16 },
    { day: 'Day 5', date: 'Sep 14', rom: 84, symmetry: 81, compensations: 14, milestone: 'Phase 1 Clear' },
    { day: 'Day 6', date: 'Sep 15', rom: 88, symmetry: 83, compensations: 12 },
    { day: 'Day 7', date: 'Sep 16', rom: 92, symmetry: 85, compensations: 10 },
    { day: 'Day 8', date: 'Sep 17', rom: 96, symmetry: 87, compensations: 9 },
    { day: 'Day 9', date: 'Sep 18', rom: 101, symmetry: 89, compensations: 7 },
    { day: 'Day 10', date: 'Sep 19', rom: 105, symmetry: 90, compensations: 6, milestone: 'ROM Target Met' },
    { day: 'Day 11', date: 'Sep 20', rom: 108, symmetry: 91, compensations: 4 },
    { day: 'Day 12', date: 'Sep 21', rom: 112, symmetry: 93, compensations: 3 },
    { day: 'Day 13', date: 'Sep 22', rom: 115, symmetry: 93, compensations: 2 },
    { day: 'Day 14', date: 'Sep 23', rom: 118, symmetry: 94, compensations: 1, milestone: 'Discharge Target' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Goniometric Joint Telemetry Comparative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exList.map((ex, idx) => {
          const targetRom = ex.target_rom_degrees || 90;
          const peakRom = ex.achieved_peak_rom_degrees || 0;
          const romDiff = peakRom - targetRom;
          const symmetry = ex.mean_symmetry_percent || 90;
          const compFrames = ex.compensation_frames_detected || 0;
          const compIssue = ex.primary_compensation_issue || 'None (Smooth Kinematics)';

          // Stability percentage calculation
          const cleanPct = Math.max(10, Math.min(100, Math.round(100 - (compFrames / 150) * 100)));
          const isSymmetryOptimal = symmetry >= 80;

          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col justify-between print-card theme-card"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      EXERCISE #{idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 font-sans">
                      {ex.protocol_name}
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans">
                    {ex.completed_reps} / {ex.prescribed_reps} reps ({ex.duration_seconds}s)
                  </span>
                </div>

                {/* Sub-Card 1: Target vs Achieved Peak ROM Comparative Bars */}
                <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 mb-3 font-sans">
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono font-bold">
                      Goniometric ROM Target vs. Achieved
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${
                        romDiff >= 0
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {romDiff >= 0 ? `+${romDiff}° Exceeded` : `${romDiff}° Deficit`}
                    </span>
                  </div>

                  {/* Side-by-side Comparative Bars */}
                  <div className="space-y-2.5">
                    {/* Target ROM Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-0.5 font-sans">
                        <span>Prescribed Threshold</span>
                        <span className="text-slate-700 font-bold font-mono">{targetRom}°</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.round((targetRom / 180) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Achieved Peak ROM Bar */}
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-700 mb-0.5 font-sans">
                        <span className="text-blue-600 font-semibold">Peak Range Achieved</span>
                        <span className="font-extrabold text-blue-600 font-mono">{peakRom}°</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.min(100, Math.round((peakRom / 180) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Card 2: Bilateral Symmetry Dial & Biomechanical Stability Ratio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 font-sans">
                  {/* Bilateral Symmetry Gauge */}
                  <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className={isSymmetryOptimal ? 'text-blue-600' : 'text-rose-600'}
                          strokeDasharray={`${symmetry}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-bold font-mono text-slate-800">
                        {symmetry}%
                      </span>
                    </div>

                    <div className="font-sans text-xs">
                      <span className="text-[10px] text-slate-400 uppercase block font-mono">Symmetry</span>
                      <span className={`text-xs font-bold ${isSymmetryOptimal ? 'text-blue-600' : 'text-rose-600'}`}>
                        {isSymmetryOptimal ? 'Optimal Balance' : 'Asymmetry Detected'}
                      </span>
                    </div>
                  </div>

                  {/* Clean Form Ratio */}
                  <div className="bg-slate-50/70 p-3 rounded-2xl border border-slate-100 flex flex-col justify-between font-sans">
                    <div className="flex justify-between text-[10px] text-slate-500 font-sans">
                      <span>Kinematic Stability</span>
                      <span className="text-slate-800 font-bold font-mono">{cleanPct}% Clean</span>
                    </div>
                    {/* Visual Segmented Stability Ratio Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex my-1.5">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700"
                        style={{ width: `${cleanPct}%` }}
                        title={`Clean Frames: ${cleanPct}%`}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all duration-700"
                        style={{ width: `${100 - cleanPct}%` }}
                        title={`Compensations: ${100 - cleanPct}%`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 truncate font-sans">
                      {compFrames === 0 ? 'Zero compensations' : `${compFrames} compensation frame(s)`}
                    </span>
                  </div>
                </div>

                {/* Compensation Tag */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                  <span className="text-slate-500 text-[11px]">Primary Habit:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 border ${
                      compIssue.includes('None')
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-amber-700 bg-amber-50 border-amber-200'
                    }`}
                  >
                    {compIssue.includes('None') ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{compIssue.replace('COMPENSATION: ', '')}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. 14-Day Progressive Kinematic Recovery Trajectory */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm print-card theme-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 font-sans">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
                14-Day Kinetic Progression & Recovery Curve
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Chronological range-of-motion gains and compensation decay over 14 treatment sessions
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <span className="flex items-center gap-1.5 text-slate-800 font-semibold font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
              Peak ROM (°)
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Symmetry (%)
            </span>
          </div>
        </div>

        {/* Responsive Interactive SVG Line Chart */}
        <div className="h-64 w-full relative bg-slate-50/70 rounded-2xl p-4 border border-slate-200">
          <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible select-none">
            {/* Horizontal Grid Lines */}
            {[40, 80, 120, 160].map((yVal, i) => (
              <g key={i}>
                <line
                  x1="40"
                  y1={200 - yVal}
                  x2="680"
                  y2={200 - yVal}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x="30"
                  y={204 - yVal}
                  fill="#94A3B8"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {Math.round((yVal / 200) * 180)}°
                </text>
              </g>
            ))}

            {/* Symmetry Curve (Emerald) */}
            <path
              d={`M ${trajectory.map((d, i) => `${50 + i * 48},${200 - (d.symmetry / 100) * 160}`).join(' L ')}`}
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="4 2"
            />

            {/* ROM Curve (Royal Blue) */}
            <path
              d={`M ${trajectory.map((d, i) => `${50 + i * 48},${200 - (d.rom / 180) * 180}`).join(' L ')}`}
              fill="none"
              stroke="#1865F2"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interactive Data Points */}
            {trajectory.map((d, i) => {
              const cx = 50 + i * 48;
              const cyRom = 200 - (d.rom / 180) * 180;
              const isSelected = selectedTrajectoryDay === i;

              return (
                <g
                  key={i}
                  className="cursor-pointer group"
                  onClick={() => setSelectedTrajectoryDay(isSelected ? null : i)}
                >
                  <circle
                    cx={cx}
                    cy={cyRom}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#1865F2' : '#FFFFFF'}
                    stroke="#1865F2"
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all"
                  />
                  {d.milestone && (
                    <circle
                      cx={cx}
                      cy={cyRom - 12}
                      r="3"
                      fill="#10B981"
                      className="animate-pulse"
                    />
                  )}
                  {/* X-Axis Date Labels */}
                  <text
                    x={cx}
                    y="195"
                    fill={isSelected ? '#1865F2' : '#94A3B8'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {d.date}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Inspection Card when clicking any day */}
          {selectedTrajectoryDay !== null && (
            <div className="absolute top-4 right-4 bg-white/95 border border-slate-200 rounded-2xl p-3.5 backdrop-blur-md shadow-lg text-xs font-sans z-10 animate-in fade-in">
              <div className="flex items-center justify-between gap-4 font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-1.5 font-sans">
                <span>{trajectory[selectedTrajectoryDay].day} ({trajectory[selectedTrajectoryDay].date})</span>
                <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 text-[10px] font-mono">
                  {trajectory[selectedTrajectoryDay].milestone || 'Regular Session'}
                </span>
              </div>
              <div className="space-y-1 text-slate-600 font-mono">
                <p>Peak ROM: <strong className="text-blue-600 font-bold">{trajectory[selectedTrajectoryDay].rom}°</strong></p>
                <p>Symmetry: <strong className="text-emerald-600 font-bold">{trajectory[selectedTrajectoryDay].symmetry}%</strong></p>
                <p>Compensations: <strong className="text-slate-800 font-bold">{trajectory[selectedTrajectoryDay].compensations} frames</strong></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

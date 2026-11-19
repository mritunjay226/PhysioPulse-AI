'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SessionReport } from '@/lib/clinical-engine';
import { DealDeckReportHeader } from '@/components/report/dealdeck/DealDeckReportHeader';
import { DealDeckKpiCards } from '@/components/report/dealdeck/DealDeckKpiCards';
import { DealDeckHabitsCard } from '@/components/report/dealdeck/DealDeckHabitsCard';
import { DealDeckProductStatCard } from '@/components/report/dealdeck/DealDeckProductStatCard';
import { DealDeckCustomerGrowthCard } from '@/components/report/dealdeck/DealDeckCustomerGrowthCard';

export default function ReportPage() {
  const convexSessions = useQuery(api.sessions.listSessions, { limit: 25 });
  const [localReport, setLocalReport] = useState<SessionReport | null>(null);
  const [latestGeneratedReport, setLatestGeneratedReport] = useState<SessionReport | null>(null);

  // 'latest' | 'local' | convexSessionId
  const [selectedReportId, setSelectedReportId] = useState<string>('latest');
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // 1. Check for latest generated report in sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('latest_generated_report');
      if (stored) {
        setLatestGeneratedReport(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('SessionStorage read error', e);
    }
  }, []);

  // 2. Load latest file from /api/session-status
  useEffect(() => {
    async function fetchLocal() {
      try {
        const res = await fetch('/api/session-status');
        if (res.ok) {
          const data = await res.json();
          if (data.report) {
            setLocalReport(data.report);
          }
        }
      } catch (e) {
        console.warn('Failed to fetch local session status', e);
      }
    }
    fetchLocal();
  }, []);

  // Compute active report based on user selection in dropdown
  let activeReport: SessionReport | null = null;

  if (selectedReportId === 'latest') {
    activeReport = latestGeneratedReport || localReport || (convexSessions && convexSessions.length > 0 ? {
      session_id: convexSessions[0].sessionId || convexSessions[0]._id,
      timestamp: new Date(convexSessions[0].createdAt).toISOString(),
      patient_name: convexSessions[0].patientName,
      prescribed_diagnosis: convexSessions[0].prescribedDiagnosis,
      overall_compliance_percent: convexSessions[0].overallCompliancePercent,
      exercises_performed: convexSessions[0].exercisesPerformed,
    } : null);
  } else if (selectedReportId === 'local_file') {
    activeReport = localReport;
  } else {
    // Look up from Convex sessions
    const found = convexSessions?.find((s) => s._id === selectedReportId);
    if (found) {
      activeReport = {
        session_id: found.sessionId || found._id,
        timestamp: new Date(found.createdAt).toISOString(),
        patient_name: found.patientName,
        prescribed_diagnosis: found.prescribedDiagnosis,
        overall_compliance_percent: found.overallCompliancePercent,
        exercises_performed: found.exercisesPerformed,
      };
    } else {
      activeReport = latestGeneratedReport || localReport;
    }
  }

  // Fallback defaults if no session executed yet
  const patientName = activeReport?.patient_name || 'Mritunjay Mishra';
  const compliance = activeReport?.overall_compliance_percent ?? 100;
  const exercises = activeReport?.exercises_performed || [
    {
      protocol_id: 1,
      protocol_name: 'P1: Frozen Shoulder Abduction (Seated/Standing)',
      prescribed_reps: 4,
      completed_reps: 4,
      target_rom_degrees: 81,
      achieved_peak_rom_degrees: 110,
      mean_symmetry_percent: 94,
      compensation_frames_detected: 0,
      primary_compensation_issue: 'None (Clean Biomechanics)',
      duration_seconds: 15.2,
    },
    {
      protocol_id: 5,
      protocol_name: 'P5: Bilateral Overhead Wall-Slide Sync (Dual Arm)',
      prescribed_reps: 4,
      completed_reps: 4,
      target_rom_degrees: 108,
      achieved_peak_rom_degrees: 141,
      mean_symmetry_percent: 96,
      compensation_frames_detected: 12,
      primary_compensation_issue: 'COMPENSATION: BILATERAL ASYMMETRY',
      duration_seconds: 11.9,
    },
    {
      protocol_id: 3,
      protocol_name: 'P3: Cervical & Ergonomic Posture Guard (Seated)',
      prescribed_reps: 2,
      completed_reps: 2,
      target_rom_degrees: 77,
      achieved_peak_rom_degrees: 100,
      mean_symmetry_percent: 94,
      compensation_frames_detected: 0,
      primary_compensation_issue: 'None (Clean Biomechanics)',
      duration_seconds: 11.7,
    },
  ];

  const totalRepsDone = exercises.reduce((acc, ex) => acc + ex.completed_reps, 0);
  const totalRepsTarget = exercises.reduce((acc, ex) => acc + ex.prescribed_reps, 0);
  const meanSymmetry = exercises.length > 0
    ? Math.round(exercises.reduce((acc, ex) => acc + ex.mean_symmetry_percent, 0) / exercises.length)
    : 95;

  const totalDurationSecs = exercises.reduce((acc, ex) => acc + (ex.duration_seconds || 15), 0);
  const durationMinutes = Math.floor(totalDurationSecs / 60);
  const durationRemainder = Math.round(totalDurationSecs % 60);
  const durationStr = durationMinutes > 0 ? `${durationMinutes}m ${durationRemainder}s` : `${durationRemainder}s`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-7xl mx-auto pb-12 font-sans selection:bg-[#3B66F5] selection:text-white">
      {/* 1. Header with Title, Date, Print Button, and User Badge */}
      <DealDeckReportHeader
        title="Recovery Report"
        subtitleDate={activeReport ? new Date(activeReport.timestamp).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : undefined}
        onPrint={handlePrint}
      />

      {/* 2. REPORT SELECTOR BAR (Select which report to see) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#3B66F5]/10 text-[#3B66F5] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              Select Session Report to View
            </span>
            <span className="text-[11px] text-slate-400">
              Choose from your newly generated session or historical cloud records
            </span>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="w-full sm:w-auto pl-3.5 pr-8 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B66F5]/20 focus:border-[#3B66F5] transition-colors cursor-pointer appearance-none"
            >
              <option value="latest">
                ⭐ Current Generated Session (Latest)
              </option>
              {localReport && (
                <option value="local_file">
                  📄 Local Telemetry File ({new Date(localReport.timestamp).toLocaleDateString()})
                </option>
              )}
              {convexSessions && convexSessions.map((s, idx) => (
                <option key={s._id} value={s._id}>
                  ☁️ {new Date(s.createdAt).toLocaleDateString()} — {s.affectedArea} ({s.overallCompliancePercent}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#184E34] hover:bg-[#123E28] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3. Main DealDeck Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left & Center Column (7 cols): KPI Cards + Daily Consistency Chart */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Top 4 KPI Metrics */}
          <DealDeckKpiCards
            score={`${compliance}%`}
            scoreChange="+18.4%"
            totalExercises={`${totalRepsDone} / ${totalRepsTarget} Reps`}
            exercisesChange="100%"
            symmetry={`${meanSymmetry}%`}
            symmetryChange="+4.2%"
            duration={durationStr}
            durationChange="+12.1%"
          />

          {/* Daily Movement Consistency Chart */}
          <DealDeckHabitsCard />
        </div>

        {/* Right Column (5 cols): Product Statistic & Customer Growth */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Restored Joint Mobility Arcs */}
          <DealDeckProductStatCard />

          {/* Kinetic Recovery Zones */}
          <DealDeckCustomerGrowthCard />
        </div>
      </div>

      {/* 4. Detailed Exercise Protocols Completed Accordion */}
      {exercises.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Detailed Exercise Protocols in this Report ({exercises.length})
                </h4>
                <p className="text-xs text-slate-400">
                  Target ROM vs achieved peak angles and kinematic stability
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-[#3B66F5] hover:underline cursor-pointer"
            >
              {showDetails ? 'Collapse Details' : 'Expand Details'}
            </button>
          </div>

          {showDetails && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {exercises.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        Protocol #{ex.protocol_id}
                      </span>
                      {ex.compensation_frames_detected === 0 ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Clean Form
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Asymmetry
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-xs text-slate-900 mt-2">
                      {ex.protocol_name}
                    </h5>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Reps</span>
                      <p className="font-bold text-slate-800 font-mono">
                        {ex.completed_reps}/{ex.prescribed_reps}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Peak ROM</span>
                      <p className="font-bold text-[#3B66F5] font-mono">
                        {ex.achieved_peak_rom_degrees}°
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Symmetry</span>
                      <p className="font-bold text-slate-800 font-mono">
                        {ex.mean_symmetry_percent}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

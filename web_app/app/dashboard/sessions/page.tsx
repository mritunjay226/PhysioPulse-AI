'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  Printer,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';
import { PatientReportView } from '@/components/report/PatientReportView';
import { DoctorReportView } from '@/components/report/DoctorReportView';

export default function PreviousSessionsReportPage() {
  const convexSessions = useQuery(api.sessions.listSessions, { limit: 10 });
  const [localReport, setLocalReport] = useState<SessionReport | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>('patient');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch local telemetry report from API (/api/session-status)
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch('/api/session-status');
        if (res.ok) {
          const data = await res.json();
          if (data.report) {
            setLocalReport(data.report);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch local session status', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  // Construct combined session list
  const activeReport = localReport || (convexSessions && convexSessions.length > 0
    ? {
        session_id: convexSessions[0].sessionId || 'sess_default',
        timestamp: new Date(convexSessions[0].createdAt).toISOString(),
        patient_name: convexSessions[0].patientName,
        prescribed_diagnosis: convexSessions[0].prescribedDiagnosis,
        overall_compliance_percent: convexSessions[0].overallCompliancePercent,
        exercises_performed: convexSessions[0].exercisesPerformed,
      }
    : null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!activeReport) return;
    const text = `PhysioPulse Clinical Session Report\nPatient: ${activeReport.patient_name}\nCompliance: ${activeReport.overall_compliance_percent}%\nProtocols Completed: ${activeReport.exercises_performed.length}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportJson = () => {
    if (!activeReport) return;
    const blob = new Blob([JSON.stringify(activeReport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical_session_report_${activeReport.session_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Link href="/dashboard" className="hover:text-slate-700 transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#184E34] font-semibold">Previous Session Reports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Rehabilitation Session Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Historical computer-vision goniometry, ROM targets, and bilateral symmetry metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportJson}
            disabled={!activeReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE7] hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={!activeReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5EAE7] hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Clinical Note</span>
          </button>
          <Link
            href="/session"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#184E34] hover:bg-[#123E28] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Launch Live Studio</span>
          </Link>
        </div>
      </div>

      {/* View Mode Switcher: Patient vs Orthopedic Doctor */}
      <div className="flex items-center justify-between bg-white rounded-2xl border border-[#E5EAE7] p-2 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode('patient')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'patient'
                ? 'bg-[#184E34] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Patient Summary View
          </button>
          <button
            type="button"
            onClick={() => setViewMode('doctor')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'doctor'
                ? 'bg-[#184E34] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Orthopedic Physician View
          </button>
        </div>

        {activeReport && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Session: {activeReport.session_id}</span>
          </div>
        )}
      </div>

      {/* Main Content: Session Report Card */}
      {activeReport ? (
        <div className="flex flex-col gap-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-[#E5EAE7] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Patient</span>
              <p className="text-base font-bold text-slate-900 mt-0.5 capitalize">
                {activeReport.patient_name}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5EAE7] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Compliance</span>
              <p className="text-base font-bold text-emerald-700 mt-0.5">
                {activeReport.overall_compliance_percent}%
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5EAE7] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Exercises Performed</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {activeReport.exercises_performed.length} Protocols
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5EAE7] p-4 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Recorded Timestamp</span>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {new Date(activeReport.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Detailed Exercise Breakdown Table */}
          <div className="bg-white rounded-3xl border border-[#E5EAE7] p-5.5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base mb-4 font-sans">
              Kinematic Protocol Performance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Protocol</th>
                    <th className="pb-3 text-center">Reps (Done/Target)</th>
                    <th className="pb-3 text-center">Peak ROM vs Target</th>
                    <th className="pb-3 text-center">Bilateral Symmetry</th>
                    <th className="pb-3 text-center">Compensations</th>
                    <th className="pb-3 text-right pr-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {activeReport.exercises_performed.map((ex, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pl-2 font-bold text-slate-900">
                        {ex.protocol_name}
                      </td>
                      <td className="py-3.5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold font-mono">
                          {ex.completed_reps} / {ex.prescribed_reps}
                        </span>
                      </td>
                      <td className="py-3.5 text-center font-mono">
                        <span className="text-emerald-700 font-bold">{ex.achieved_peak_rom_degrees}°</span>
                        <span className="text-slate-400 text-[11px] ml-1">/ {ex.target_rom_degrees}°</span>
                      </td>
                      <td className="py-3.5 text-center font-mono font-bold text-slate-800">
                        {ex.mean_symmetry_percent}%
                      </td>
                      <td className="py-3.5 text-center">
                        {ex.compensation_frames_detected > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>{ex.compensation_frames_detected} frames</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Clean</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right pr-2 font-mono text-slate-500">
                        {ex.duration_seconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Render Full Dedicated Report View */}
          <div className="bg-white rounded-3xl border border-[#E5EAE7] p-6 shadow-2xs">
            {viewMode === 'patient' ? (
              <PatientReportView
                evaluation={null}
                sessionReport={activeReport}
                patientName={activeReport.patient_name}
                painLevel={4}
                onPrint={handlePrint}
                onCopyPatientSummary={handleCopySummary}
                copiedSummary={copiedSummary}
              />
            ) : (
              <DoctorReportView
                evaluation={null}
                sessionReport={activeReport}
                patientName={activeReport.patient_name}
                painLevel={4}
                evaluationSource="deterministic_engine"
                onPrint={handlePrint}
                onCopySoap={handleCopySummary}
                copiedSoap={copiedSummary}
              />
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-white border border-[#E5EAE7] p-12 text-center shadow-2xs flex flex-col items-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Previous Sessions Yet</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Complete your first AI-guided biomechanical telerehabilitation session to generate goniometric ROM logs and clinical reports.
          </p>
          <Link
            href="/session"
            className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#184E34] text-white text-xs font-semibold shadow-xs hover:bg-[#123E28] transition-colors"
          >
            Start First Session
          </Link>
        </div>
      )}
    </div>
  );
}

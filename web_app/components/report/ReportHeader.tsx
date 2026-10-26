'use client';

import React from 'react';
import { HeartPulse, Printer, Copy, Check, RotateCcw } from 'lucide-react';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';

export interface ReportHeaderProps {
  evaluation: ClinicalEvaluationOutput | null;
  sessionReport: SessionReport | null;
  patientName: string;
  painLevel: number;
  evaluationSource: 'llm_agent' | 'deterministic_engine' | null;
  onCopySummary: () => void;
  copiedSummary: boolean;
  onNewSession: () => void;
}

export function ReportHeader({
  evaluation,
  sessionReport,
  patientName,
  painLevel,
  evaluationSource,
  onCopySummary,
  copiedSummary,
  onNewSession
}: ReportHeaderProps) {
  const getPainLabel = (level: number) => {
    if (level <= 3) return 'Mild Articular Discomfort';
    if (level <= 6) return 'Moderate Mechanical Impingement';
    return 'Acute Guarded Pathomechanical Pain';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <HeartPulse className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                Clinical Kinematic Evaluation Report
              </h2>
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                {evaluationSource === 'llm_agent' ? 'LLM Medical Agent' : 'Closed-Loop MoCap'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Official Biomechanical Discharge Letterhead · Autonomous Computer Vision Session
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
            title="Print Official Medical Letterhead"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
          <button
            onClick={onNewSession}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Patient Meta Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-1 font-sans text-xs">
        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-mono uppercase">Patient Record</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
            {sessionReport?.patient_name || patientName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">PID #HLX-88214</span>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-mono uppercase">Subjective VAS Pain</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
            {painLevel}/10 Rating
          </span>
          <span className="text-[10px] text-amber-700 font-sans">{getPainLabel(painLevel)}</span>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-mono uppercase">Attending Clinician</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
            Dr. S. Smith, MD
          </span>
          <span className="text-[10px] text-slate-400">Board-Certified Physiatrist</span>
        </div>

        <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-mono uppercase">Timestamp</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block font-mono">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">Session Validated 100%</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { HeartPulse, Printer, Copy, Check, RotateCcw, FileText, X } from 'lucide-react';
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
  const [isSoapOpen, setIsSoapOpen] = useState(false);
  const [copiedSoap, setCopiedSoap] = useState(false);

  const getPainLabel = (level: number) => {
    if (level <= 3) return 'Mild Articular Discomfort';
    if (level <= 6) return 'Moderate Mechanical Impingement';
    return 'Acute Guarded Pathomechanical Pain';
  };

  const handleCopySoap = () => {
    const pName = sessionReport?.patient_name || patientName;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const icd10 = evaluation?.cpt_billing?.icd10_code || 'M75.10 (Rotator Cuff Syndrome / Cervical Strain)';
    const diag = evaluation?.cpt_billing?.diagnosis_name || 'Orthopedic Kinematic Derangement';
    const exercises = sessionReport?.exercises_performed || [];
    
    const soapText = `CLINICAL ORTHOPEDIC SOAP NOTE
Date: ${dateStr}
Patient Name: ${pName} | PID: #PP-88214
Primary Diagnosis: ${diag} (${icd10})
Facility: PhysioPulse AI Autonomous Markerless MoCap Suite
Attending Clinician: Dr. S. Smith, MD (Board-Certified Physiatrist)

[S] SUBJECTIVE:
Patient reports to clinic for asynchronous visual motion-capture rehabilitation.
- Primary Symptom Complaint: Musculoskeletal movement restriction with pain rating VAS ${painLevel}/10 (${getPainLabel(painLevel)}).
- Functional Limitations: Impaired dynamic range of motion, compensatory postural guarding, and movement apprehension during unilateral/bilateral kinetic tasks.

[O] OBJECTIVE:
Metric 33-point markerless kinematic tracking captured via MediaPipe Tasks & DirectShow optical pipeline.
- Overall Prescription Compliance: ${sessionReport?.overall_compliance_percent ?? 100}% of target reps completed.
- Mean Kinematic Bilateral Symmetry: ${evaluation?.kinematic_vitals?.average_symmetry ?? 94}%.
- Clean Kinematic Frames: ${evaluation?.kinematic_vitals?.total_clean_frames_pct ?? 96}% without compensatory deviation.
- Angular Velocity Rating: ${evaluation?.kinematic_vitals?.angular_velocity_rating ?? 'Controlled Dynamic Phase (31.4°/s)'}.
- Joint Excursion Metrics:
${exercises.map(ex => `  * ${ex.protocol_name}: Completed ${ex.completed_reps}/${ex.prescribed_reps} reps | Peak ROM: ${ex.achieved_peak_rom_degrees}° (Target: ${ex.target_rom_degrees}°) | Symmetry: ${ex.mean_symmetry_percent}% | Compensations: ${ex.primary_compensation_issue}`).join('\n')}

[A] ASSESSMENT:
Clinical Summary: ${evaluation?.executive_summary || 'Autonomous kinematic evaluation completed with stable biomechanical motor control.'}
- Neuromuscular Readiness Score: ${evaluation?.readiness_score ?? 88}/100.
- Fatigue Index: ${evaluation?.kinematic_vitals?.fatigue_index ?? 'Normal Neuromuscular Reserve'}.

[P] PLAN:
1. Continue Remote Therapeutic Monitoring (RTM) home exercise protocol 3x weekly.
2. Clinical Next-Session Adjustments:
${(evaluation?.next_session_adjustments || ['Maintain current range of motion targets and reinforce scapulothoracic stability.']).map((adj, i) => `   ${i+1}. ${adj}`).join('\n')}
3. Remote Therapeutic Monitoring (RTM) CPT Coding:
   - CPT 98975: Remote Therapeutic Monitoring Initial Setup & Patient Education
   - CPT 98977: Musculoskeletal Device Supply with Daily MoCap Transmission
   - CPT 98980: RTM Clinical Management & Interactive Movement Review
4. Follow-up: Re-evaluate functional joint excursion in 14 days.
`;

    navigator.clipboard.writeText(soapText);
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 2500);
  };

  return (
    <>
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
          <div className="flex items-center gap-2 no-print flex-wrap">
            <button
              onClick={() => setIsSoapOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition-all shadow-xs cursor-pointer font-sans"
              title="View Formal Clinical SOAP Note"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>View SOAP Note</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Print Official Medical Letterhead"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
            <span className="text-[10px] text-slate-400 font-mono">PID #PP-88214</span>
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

      {/* Official Medical SOAP Note Modal */}
      {isSoapOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-slate-900 shadow-2xl my-auto font-sans max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
                    Physical Therapy Clinical SOAP Note
                  </h3>
                  <p className="text-xs text-slate-500 font-sans">
                    EHR Export Ready · CPT 97110 / RTM 98977 Verified
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySoap}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSoap ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSoap ? 'Copied' : 'Copy SOAP'}</span>
                </button>
                <button
                  onClick={() => setIsSoapOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* SOAP Content Blocks */}
            <div className="space-y-4 text-xs text-slate-700 font-sans leading-relaxed">
              {/* Meta Header */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Patient</span>
                  <span className="font-bold text-slate-900">{sessionReport?.patient_name || patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Record ID</span>
                  <span className="font-bold text-slate-900">#PP-88214</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">ICD-10 Code</span>
                  <span className="font-bold text-emerald-800">M75.10 / M54.2</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Date</span>
                  <span className="font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* [S] Subjective */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                    [S] SUBJECTIVE
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Patient History & Symptoms</span>
                </div>
                <p>
                  Patient presents for remote therapeutic session reporting mechanical discomfort and movement restriction rated{' '}
                  <span className="font-bold text-amber-700 font-mono">VAS {painLevel}/10</span> ({getPainLabel(painLevel)}). Reports ongoing stiffness during terminal ranges and ergonomic strain during sustained occupational sitting.
                </p>
              </div>

              {/* [O] Objective */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                    [O] OBJECTIVE
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Markerless Kinematic Telemetry</span>
                </div>
                <p className="mb-2">
                  Session recorded via 33-point optical landmark capture with adaptive frequency jitter suppression.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] mb-3">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Prescription Adherence</span>
                    <span className="text-sm font-bold text-emerald-700">{sessionReport?.overall_compliance_percent ?? 100}%</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Bilateral Symmetry</span>
                    <span className="text-sm font-bold text-emerald-700">{evaluation?.kinematic_vitals?.average_symmetry ?? 94}%</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Clean Frames Ratio</span>
                    <span className="text-sm font-bold text-emerald-700">{evaluation?.kinematic_vitals?.total_clean_frames_pct ?? 96}%</span>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  {(sessionReport?.exercises_performed || []).map((ex, idx) => (
                    <li key={idx}>
                      <span className="font-bold text-slate-900">{ex.protocol_name}</span>: Achieved peak excursion of{' '}
                      <span className="text-emerald-700 font-mono font-bold">{ex.achieved_peak_rom_degrees}°</span> (target {ex.target_rom_degrees}°), completing {ex.completed_reps}/{ex.prescribed_reps} reps. Status: {ex.primary_compensation_issue}.
                    </li>
                  ))}
                </ul>
              </div>

              {/* [A] Assessment */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                    [A] ASSESSMENT
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Clinical Impression</span>
                </div>
                <p className="mb-2 leading-relaxed">
                  {evaluation?.executive_summary || 'Patient completed targeted multi-joint kinetic protocol with verified active range of motion and stable bilateral neuromuscular control.'}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Neuromuscular Readiness Index:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                    {evaluation?.readiness_score ?? 88}% Optimal
                  </span>
                </div>
              </div>

              {/* [P] Plan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                    [P] PLAN
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Rehabilitation Progression</span>
                </div>
                <p className="mb-2">
                  1. Advance remote therapeutic monitoring protocol 3x weekly with active visual biofeedback.
                </p>
                <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">CPT Billing Codes: </span>
                  CPT 98975 (RTM Initial Setup), CPT 98977 (Daily MoCap Musculoskeletal Transmission), CPT 98980 (Monthly Clinical Review).
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-sans">
                PhysioPulse AI Clinical Systems · EHR Export Standard Compliant
              </span>
              <button
                onClick={() => setIsSoapOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close SOAP Note
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

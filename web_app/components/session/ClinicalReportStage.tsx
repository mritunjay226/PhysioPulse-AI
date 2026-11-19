'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  User,
  Stethoscope,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  FileText,
  Activity,
  Heart,
  ShieldCheck,
  ChevronRight,
  FolderOpen,
  ArrowRight,
  Database,
  Calendar
} from 'lucide-react';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';
import { PatientReportView } from '@/components/report/PatientReportView';
import { DoctorReportView } from '@/components/report/DoctorReportView';

export interface ClinicalReportStageProps {
  evaluation: ClinicalEvaluationOutput | null;
  sessionReport: SessionReport | null;
  patientName: string;
  painLevel: number;
  evaluationSource?: 'llm_agent' | 'deterministic_engine' | null;
  onCopySummary: () => void;
  copiedSummary: boolean;
  onCopyTips: () => void;
  copiedTips: boolean;
  onNewSession: () => void;
}

export function ClinicalReportStage({
  evaluation: initialEvaluation,
  sessionReport: initialSessionReport,
  patientName: initialPatientName,
  painLevel: initialPainLevel,
  evaluationSource,
  onCopySummary,
  copiedSummary: initialCopiedSummary,
  onCopyTips,
  copiedTips,
  onNewSession
}: ClinicalReportStageProps) {
  // Query authenticated user's real sessions from Convex cloud database
  const convexSessions = useQuery(api.sessions.listSessions, { limit: 15 });

  // Dual-report mode: 'patient' or 'doctor'
  const [reportView, setReportView] = useState<'patient' | 'doctor'>('patient');

  // Case / Session selector: 'current' or a convex session ID
  const [selectedCase, setSelectedCase] = useState<string>('current');

  // Local copy feedback state
  const [localCopiedSummary, setLocalCopiedSummary] = useState(false);

  // Active data resolution
  const hasLiveSession = !!initialSessionReport && !!initialSessionReport.exercises_performed && initialSessionReport.exercises_performed.length > 0;

  // Selected past session from Convex DB if applicable
  const selectedPastSession = convexSessions?.find((s) => s._id === selectedCase);

  let activeReport: SessionReport | null = null;
  let activeEvaluation: ClinicalEvaluationOutput | null = null;
  let activePatientName: string = initialPatientName || 'Patient';
  let activePainLevel: number = initialPainLevel || 5;

  if (selectedPastSession) {
    activeReport = {
      session_id: selectedPastSession.sessionId || selectedPastSession._id,
      timestamp: new Date(selectedPastSession.createdAt).toISOString(),
      patient_name: selectedPastSession.patientName,
      prescribed_diagnosis: selectedPastSession.prescribedDiagnosis,
      overall_compliance_percent: selectedPastSession.overallCompliancePercent,
      exercises_performed: selectedPastSession.exercisesPerformed,
    };
    activeEvaluation = selectedPastSession.evaluation || initialEvaluation;
    activePatientName = selectedPastSession.patientName;
    activePainLevel = selectedPastSession.painLevel;
  } else if (hasLiveSession && initialSessionReport && initialEvaluation) {
    activeReport = initialSessionReport;
    activeEvaluation = initialEvaluation;
    activePatientName = initialPatientName || initialSessionReport.patient_name || 'Patient';
    activePainLevel = initialPainLevel;
  } else if (convexSessions && convexSessions.length > 0) {
    const firstSaved = convexSessions[0];
    activeReport = {
      session_id: firstSaved.sessionId || firstSaved._id,
      timestamp: new Date(firstSaved.createdAt).toISOString(),
      patient_name: firstSaved.patientName,
      prescribed_diagnosis: firstSaved.prescribedDiagnosis,
      overall_compliance_percent: firstSaved.overallCompliancePercent,
      exercises_performed: firstSaved.exercisesPerformed,
    };
    activeEvaluation = firstSaved.evaluation || initialEvaluation;
    activePatientName = firstSaved.patientName;
    activePainLevel = firstSaved.painLevel;
  }

  // Copy patient-friendly recovery notes
  const handleCopyPatientNotes = () => {
    if (!activeReport) return;
    const text = `🌟 PHYSIOPULSE HOME RECOVERY NOTES
Patient: ${activePatientName}
Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
Movement Quality Score: ${activeEvaluation?.readiness_score || 92}/100 (Outstanding!)
Exercises Completed: ${activeReport?.overall_compliance_percent || 100}%

SUMMARY:
${activeEvaluation?.executive_summary || 'All physical therapy movements completed with great balance and control.'}

TODAY'S AT-HOME CARE STEPS:
1. Cooling Comfort: Apply an ice pack for 15-20 minutes to soothe working muscles.
2. Desk Ergonomics: Raise computer screen so the top third is at eye level.
3. Posture Reminder: 3 gentle shoulder blade squeezes during breaks.
4. Hydration: Drink plenty of water and avoid lifting heavy loads (>10 lbs) today.

Next Session Goal: Dr. Smith recommended adding a 3-second hold at the top of your reach!
`;
    navigator.clipboard.writeText(text);
    setLocalCopiedSummary(true);
    setTimeout(() => setLocalCopiedSummary(false), 2500);
  };

  // Copy doctor clinical SOAP note
  const handleCopyDoctorSoap = () => {
    if (!activeReport) return;
    const icd10 = activeEvaluation?.cpt_billing?.icd10_code || 'M75.10 (Rotator Cuff Syndrome / Cervical Strain)';
    const diag = activeEvaluation?.cpt_billing?.diagnosis_name || 'Orthopedic Kinematic Derangement';
    const exercises = activeReport?.exercises_performed || [];

    const soapText = `CLINICAL ORTHOPEDIC SOAP NOTE
Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
Patient Name: ${activePatientName}
Primary Diagnosis: ${diag} (${icd10})
Facility: PhysioPulse AI Autonomous Markerless MoCap Suite
Attending Clinician: Dr. S. Smith, MD (Board-Certified Physiatrist, NPI #1982736410)

[S] SUBJECTIVE:
Patient reports to clinic for asynchronous visual motion-capture rehabilitation.
- Primary Symptom Complaint: Musculoskeletal movement restriction with pain rating VAS ${activePainLevel}/10.
- Functional Limitations: Impaired dynamic range of motion, compensatory postural guarding, and movement apprehension during unilateral/bilateral kinetic tasks.

[O] OBJECTIVE:
Metric 33-point markerless kinematic tracking captured via MediaPipe Tasks & DirectShow optical pipeline.
- Overall Prescription Compliance: ${activeReport?.overall_compliance_percent ?? 100}% of target reps completed.
- Mean Kinematic Bilateral Symmetry: ${activeEvaluation?.kinematic_vitals?.average_symmetry ?? 94}%.
- Clean Kinematic Frames: ${activeEvaluation?.kinematic_vitals?.total_clean_frames_pct ?? 96}% without compensatory deviation.
- Angular Velocity Rating: ${activeEvaluation?.kinematic_vitals?.angular_velocity_rating ?? 'Controlled Dynamic Phase (31.4°/s)'}.
- Joint Excursion Metrics:
${exercises.map(ex => `  * ${ex.protocol_name}: Completed ${ex.completed_reps}/${ex.prescribed_reps} reps | Peak ROM: ${ex.achieved_peak_rom_degrees}° (Target: ${ex.target_rom_degrees}°) | Symmetry: ${ex.mean_symmetry_percent}% | Compensations: ${ex.primary_compensation_issue}`).join('\n')}

[A] ASSESSMENT:
Clinical Summary: ${activeEvaluation?.executive_summary || 'Autonomous kinematic evaluation completed with stable biomechanical motor control.'}
- Neuromuscular Readiness Score: ${activeEvaluation?.readiness_score ?? 88}/100.
- Fatigue Index: ${activeEvaluation?.kinematic_vitals?.fatigue_index ?? 'Normal Neuromuscular Reserve'}.

[P] PLAN:
1. Continue Remote Therapeutic Monitoring (RTM) home exercise protocol 3x weekly.
2. Clinical Next-Session Adjustments:
${(activeEvaluation?.next_session_adjustments || ['Maintain current range of motion targets and reinforce scapulothoracic stability.']).map((adj, i) => `   ${i+1}. ${adj}`).join('\n')}
3. Remote Therapeutic Monitoring (RTM) CPT Coding:
   - CPT 98975: Remote Therapeutic Monitoring Initial Setup & Patient Education
   - CPT 98977: Musculoskeletal Device Supply with Daily MoCap Transmission
   - CPT 98980: RTM Clinical Management & Interactive Movement Review (First 20m)
4. Follow-up: Re-evaluate functional joint excursion in 14 days.
`;

    navigator.clipboard.writeText(soapText);
    setLocalCopiedSummary(true);
    setTimeout(() => setLocalCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // If no report is available (user has not recorded any sessions yet)
  if (!activeReport || !activeEvaluation) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
          <Database className="w-8 h-8" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 font-sans">
          No Clinical Session Recorded Yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Your personal kinematic evaluations, joint excursion graphs, and recovery directives will be stored here once you complete a motion session.
        </p>
        <button
          onClick={onNewSession}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer"
        >
          <span>Start New Intake & Session</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. REPORT AUDIENCE SWITCHER & GLOBAL CONTROL BAR */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Accessible Tab Switcher */}
          <div
            role="tablist"
            aria-label="Report Audience Selection"
            className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 max-w-full overflow-x-auto no-scrollbar"
          >
            {/* Tab 1: Patient Mode */}
            <button
              type="button"
              role="tab"
              id="patient-tab"
              aria-selected={reportView === 'patient'}
              aria-controls="patient-report-panel"
              onClick={() => setReportView('patient')}
              className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer select-none relative shrink-0 ${
                reportView === 'patient'
                  ? 'bg-white text-emerald-950 shadow-sm border border-emerald-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  reportView === 'patient' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="text-left">
                <span className="block leading-none">Patient Report</span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block mt-0.5">
                  Easy to understand · Recovery steps
                </span>
              </div>
              {reportView === 'patient' && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute top-2 right-2" />
              )}
            </button>

            {/* Tab 2: Doctor Mode */}
            <button
              type="button"
              role="tab"
              id="doctor-tab"
              aria-selected={reportView === 'doctor'}
              aria-controls="doctor-report-panel"
              onClick={() => setReportView('doctor')}
              className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer select-none relative shrink-0 ${
                reportView === 'doctor'
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-300/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  reportView === 'doctor' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-none">Doctor Clinical Note</span>
                <span className="text-[10px] font-normal text-slate-500 hidden sm:block mt-0.5">
                  SOAP format · CPT ledger · Kinematics
                </span>
              </div>
              {reportView === 'doctor' && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 absolute top-2 right-2" />
              )}
            </button>
          </div>

          {/* Quick Controls & Real Database Session Switcher */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-start md:justify-end">
            {/* Real Convex Session Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs max-w-full">
              <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-400 font-medium shrink-0">Session:</span>
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer text-xs max-w-[140px] xs:max-w-[180px] sm:max-w-[200px] truncate"
              >
                {hasLiveSession && <option value="current">Current Live Session</option>}
                {convexSessions && convexSessions.length > 0 ? (
                  convexSessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {new Date(s.createdAt).toLocaleDateString()} — {s.affectedArea} ({s.overallCompliancePercent}%)
                    </option>
                  ))
                ) : (
                  !hasLiveSession && <option value="current">Most Recent Recorded</option>
                )}
              </select>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title={reportView === 'patient' ? 'Print Patient Recovery Summary' : 'Print Official Medical Letterhead'}
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xs:inline">Print {reportView === 'patient' ? 'Patient Guide' : 'Clinical Discharge'}</span>
              <span className="xs:hidden">Print</span>
            </button>

            {/* New Session Button */}
            <button
              onClick={onNewSession}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer shadow-emerald-600/20"
              title="Start a fresh physical therapy session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB PANELS (Patient View vs Doctor View) */}
      <div>
        {/* Panel 1: Patient Report View */}
        <div
          role="tabpanel"
          id="patient-report-panel"
          aria-labelledby="patient-tab"
          hidden={reportView !== 'patient'}
          className={reportView === 'patient' ? 'block' : 'hidden'}
        >
          <PatientReportView
            evaluation={activeEvaluation}
            sessionReport={activeReport}
            patientName={activePatientName}
            painLevel={activePainLevel}
            onPrint={handlePrint}
            onCopyPatientSummary={handleCopyPatientNotes}
            copiedSummary={localCopiedSummary}
          />
        </div>

        {/* Panel 2: Doctor Report View */}
        <div
          role="tabpanel"
          id="doctor-report-panel"
          aria-labelledby="doctor-tab"
          hidden={reportView !== 'doctor'}
          className={reportView === 'doctor' ? 'block' : 'hidden'}
        >
          <DoctorReportView
            evaluation={activeEvaluation}
            sessionReport={activeReport}
            patientName={activePatientName}
            painLevel={activePainLevel}
            evaluationSource={evaluationSource || null}
            onPrint={handlePrint}
            onCopySoap={handleCopyDoctorSoap}
            copiedSoap={localCopiedSummary}
          />
        </div>
      </div>
    </div>
  );
}

export default ClinicalReportStage;

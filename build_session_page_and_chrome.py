import os

web_app_dir = os.path.abspath('web_app')

chrome_content = '''\'use client\';

import React from \'react\';
import Link from \'next/link\';
import { ChevronLeft, Stethoscope } from \'lucide-react\';

export function SessionBrowserChrome() {
  return (
    <div className="h-10 bg-[#0d0d10] border-b border-zinc-800/80 px-4 flex items-center justify-between text-xs text-zinc-400 select-none no-print font-mono">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 border border-rose-600/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 border border-amber-600/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
        </div>
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-[11px] font-semibold transition-all shadow-sm"
          title="Return to Patient 3D Overview"
        >
          <ChevronLeft className="w-3.5 h-3.5 text-teal-400" />
          <span>Overview</span>
        </Link>
      </div>

      {/* Clinical Telemetry Address Pill */}
      <div className="flex items-center gap-2 bg-[#09090b] border border-zinc-800 rounded-full px-3.5 py-0.5 text-[11px] text-zinc-400 shadow-sm max-w-sm w-full justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
        <span className="text-teal-300 font-bold">physiopulse.ai/session</span>
        <span className="text-zinc-600 text-[10px] ml-1">· Closed-Loop Studio</span>
      </div>

      {/* Attending Physician Pill */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-900 px-2.5 py-0.5 rounded-full border border-zinc-800 text-[11px] text-zinc-300">
          <Stethoscope className="w-3 h-3 text-teal-400" />
          <span className="font-medium">Dr. S. Smith, MD (Attending)</span>
        </div>
      </div>
    </div>
  );
}
'''

stepper_content = '''\'use client\';

import React from \'react\';
import Link from \'next/link\';
import { HeartPulse, ChevronRight, Activity } from \'lucide-react\';

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
    <header className="px-6 py-4 border-b border-zinc-800/80 bg-[#121215] flex flex-col md:flex-row md:items-center justify-between gap-4 no-print select-none">
      <div className="flex items-center gap-3.5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-[#0d0d10] rounded-[10px] flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-100 text-lg tracking-tight font-mono">
                PHYSIOPULSE <span className="text-teal-400">AI</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
                Kinematics v2.4
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block font-sans">
              Autonomous Markerless Computer Vision Closed-Loop Rehabilitation
            </p>
          </div>
        </Link>
      </div>

      {/* Engine Status Badges */}
      <div className="hidden xl:flex items-center gap-2.5 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09090b] border border-zinc-800 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="font-medium">MediaPipe 33-Keypoints</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#09090b] border border-zinc-800 text-teal-400">
          <Activity className="w-3.5 h-3.5" />
          <span className="font-medium">EMA Filter 60Hz</span>
        </div>
      </div>

      {/* Dark Clinical 3-Stage Stepper */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#09090b] p-1.5 rounded-xl border border-zinc-800/80 overflow-x-auto text-xs font-mono">
        {/* Step 1 */}
        <button
          onClick={() => setActiveStage(1)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 1
              ? \'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm\'
              : \'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent\'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 1 ? \'bg-teal-400 text-black font-extrabold\' : \'bg-zinc-800 text-zinc-400\'
            }`}
          >
            1
          </div>
          <span>Intake & Triage</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />

        {/* Step 2 */}
        <button
          onClick={() => canAccessStage2 && setActiveStage(2)}
          disabled={!canAccessStage2}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 2
              ? \'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm\'
              : canAccessStage2
              ? \'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent\'
              : \'text-zinc-600 cursor-not-allowed opacity-40 border border-transparent\'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 2
                ? \'bg-teal-400 text-black font-extrabold\'
                : canAccessStage2
                ? \'bg-zinc-800 text-zinc-400\'
                : \'bg-zinc-900 text-zinc-600\'
            }`}
          >
            2
          </div>
          <span>Vision Queue</span>
        </button>

        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:block" />

        {/* Step 3 */}
        <button
          onClick={() => canAccessStage3 && setActiveStage(3)}
          disabled={!canAccessStage3}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            activeStage === 3
              ? \'bg-teal-500/15 text-teal-300 border border-teal-500/40 shadow-sm\'
              : canAccessStage3
              ? \'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent\'
              : \'text-zinc-600 cursor-not-allowed opacity-40 border border-transparent\'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              activeStage === 3
                ? \'bg-teal-400 text-black font-extrabold\'
                : canAccessStage3
                ? \'bg-zinc-800 text-zinc-400\'
                : \'bg-zinc-900 text-zinc-600\'
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
'''

page_content = '''\'use client\';

import React, { useState, useEffect } from \'react\';
import { AlertTriangle } from \'lucide-react\';
import {
  PrescriptionOutput,
  SessionReport,
  ClinicalEvaluationOutput
} from \'@/lib/clinical-engine\';

import { SessionBrowserChrome } from \'@/components/session/SessionBrowserChrome\';
import { SessionWorkflowStepper } from \'@/components/session/SessionWorkflowStepper\';
import { IntakeFormStage, IntakePreset } from \'@/components/session/IntakeFormStage\';
import { PrescriptionQueueStage } from \'@/components/session/PrescriptionQueueStage\';
import { ClinicalReportStage } from \'@/components/session/ClinicalReportStage\';

export default function PhysioPulseApp() {
  // 1 = Intake & Triage, 2 = Prescription & Session, 3 = Post-Session Report
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  // Stage 1 Intake State
  const [patientName, setPatientName] = useState(\'Sarah Jenkins\');
  const [age, setAge] = useState<number>(34);
  const [affectedArea, setAffectedArea] = useState(\'Shoulder & Neck\');
  const [painLevel, setPainLevel] = useState<number>(6);
  const [circuitMode, setCircuitMode] = useState<\'targeted\' | \'standard\' | \'comprehensive\'>(\'standard\');
  const [symptoms, setSymptoms] = useState(
    \'I had rotator cuff surgery 4 weeks ago and my neck also hurts from sitting at my laptop all day.\'
  );
  const [activeProtocols, setActiveProtocols] = useState<number[]>([1, 5, 3, 4]);

  // Stage 2 Prescription & CV Session State
  const [isGeneratingPrescription, setIsGeneratingPrescription] = useState(false);
  const [prescription, setPrescription] = useState<PrescriptionOutput | null>(null);
  const [isRunningSession, setIsRunningSession] = useState(false);
  const [sessionReport, setSessionReport] = useState<SessionReport | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Stage 3 Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<ClinicalEvaluationOutput | null>(null);
  const [evaluationSource, setEvaluationSource] = useState<\'llm_agent\' | \'deterministic_engine\' | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTips, setCopiedTips] = useState(false);

  // Check initial existing status on mount
  useEffect(() => {
    async function checkExistingStatus() {
      try {
        const res = await fetch(\'/api/session-status\');
        const data = await res.json();
        if (data.prescription) {
          setPrescription(data.prescription);
          setPatientName(data.prescription.patient_name || \'Sarah Jenkins\');
          if (data.prescription.exercises) {
            setActiveProtocols(data.prescription.exercises.map((e: any) => e.protocol_id));
          }
        }
        if (data.report) {
          setSessionReport(data.report);
        }
      } catch (err) {
        console.warn(\'Status check warning:\', err);
      }
    }
    checkExistingStatus();
  }, []);

  // Update active protocols based on affected area
  useEffect(() => {
    const area = affectedArea.toLowerCase();
    const newProtocols: number[] = [];
    if (/shoulder/.test(area)) newProtocols.push(1, 5, 3);
    if (/knee/.test(area)) newProtocols.push(2, 6, 7);
    if (/neck|cervical/.test(area)) newProtocols.push(3, 5, 1);
    if (/elbow/.test(area)) newProtocols.push(4, 8, 3);
    if (/bilateral|wall/.test(area)) newProtocols.push(5, 1, 3);
    if (/hip/.test(area)) newProtocols.push(6, 2, 7);
    if (/lumbar|back/.test(area)) newProtocols.push(7, 6, 3);
    if (/wrist|carpal/.test(area)) newProtocols.push(8, 4, 3);
    if (newProtocols.length > 0) {
      setActiveProtocols(Array.from(new Set(newProtocols)));
    }
  }, [affectedArea]);

  const PRESETS: IntakePreset[] = [
    {
      title: \'Rotator Cuff + Desk Strain\',
      area: \'Shoulder & Neck\',
      pain: 6,
      protocols: [1, 5, 3, 4],
      desc: \'I had rotator cuff surgery 4 weeks ago and my neck also hurts from sitting at my laptop all day.\'
    },
    {
      title: \'Post-ACL Knee Reconstruction\',
      area: \'Knee & Hip\',
      pain: 5,
      protocols: [2, 6, 7, 3],
      desc: \'Recovering from an ACL tear reconstruction. Quad feels weak and knee stability feels hesitant when squatting.\'
    },
    {
      title: \'Carpal Tunnel & Wrist Fatigue\',
      area: \'Wrist & Forearm\',
      pain: 4,
      protocols: [8, 4, 3, 5],
      desc: \'Intense tingling and numbness in wrists and fingers from 10 hours daily software development and mouse usage.\'
    },
    {
      title: \'Total Hip Replacement Rehab\',
      area: \'Hip & Pelvis\',
      pain: 7,
      protocols: [6, 2, 7, 3],
      desc: \'Underwent total hip arthroplasty 6 weeks ago. Struggling with lateral pelvic stability and gluteus medius weakness.\'
    },
    {
      title: \'Lumbar Spine & Ergonomic Guard\',
      area: \'Lower Back & Cervical Spine\',
      pain: 6,
      protocols: [7, 6, 3, 2],
      desc: \'L4-L5 disc bulge history with stiffness bending forward and chronic forward-head posture at computer terminal.\'
    }
  ];

  const handleApplyPreset = (preset: IntakePreset) => {
    setAffectedArea(preset.area);
    setPainLevel(preset.pain);
    setSymptoms(preset.desc);
    setActiveProtocols(preset.protocols);
  };

  const handleSelectProtocolFromMap = (protocolId: number) => {
    if (activeProtocols.includes(protocolId)) {
      if (activeProtocols.length > 1) {
        setActiveProtocols(activeProtocols.filter((id) => id !== protocolId));
      }
    } else {
      setActiveProtocols([...activeProtocols, protocolId]);
    }
  };

  const handleGeneratePrescription = async () => {
    setIsGeneratingPrescription(true);
    setSessionError(null);
    try {
      const res = await fetch(\'/api/prescribe-session\', {
        method: \'POST\',
        headers: { \'Content-Type\': \'application/json\' },
        body: JSON.stringify({
          name: patientName,
          age,
          affectedArea,
          painLevel,
          symptoms,
          selectedProtocols: activeProtocols,
          circuitMode
        })
      });
      const data = await res.json();
      if (data.success && data.prescription) {
        setPrescription(data.prescription);
        if (data.prescription.exercises) {
          setActiveProtocols(data.prescription.exercises.map((e: any) => e.protocol_id));
        }
        setActiveStage(2);
      } else {
        setSessionError(data.error || \'Failed to synthesize prescription.\');
      }
    } catch (err: any) {
      setSessionError(err.message || \'Network error generating prescription.\');
    } finally {
      setIsGeneratingPrescription(false);
    }
  };

  const handleLaunchVisionSession = async () => {
    setIsRunningSession(true);
    setSessionError(null);
    try {
      const res = await fetch(\'/api/run-session\', { method: \'POST\' });
      const data = await res.json();
      if (data.success && data.report) {
        setSessionReport(data.report);
        await handleTriggerEvaluation(prescription, data.report);
        setActiveStage(3);
      } else {
        setSessionError(data.error || \'Vision session completed without report output.\');
      }
    } catch (err: any) {
      setSessionError(err.message || \'Error communicating with vision session engine.\');
    } finally {
      setIsRunningSession(false);
    }
  };

  const handleTriggerEvaluation = async (
    presc: PrescriptionOutput | null,
    rep: SessionReport
  ) => {
    setIsEvaluating(true);
    try {
      const res = await fetch(\'/api/evaluate-session\', {
        method: \'POST\',
        headers: { \'Content-Type\': \'application/json\' },
        body: JSON.stringify({
          prescription: presc,
          report: rep
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
        setEvaluationSource(data.source);
      }
    } catch (err) {
      console.error(\'Error evaluating session:\', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Auto-trigger evaluation if entering stage 3 with report but not yet evaluated
  useEffect(() => {
    if (activeStage === 3 && sessionReport && !evaluation && !isEvaluating) {
      handleTriggerEvaluation(prescription, sessionReport);
    }
  }, [activeStage, sessionReport, evaluation, isEvaluating, prescription]);

  const handleCopySummary = () => {
    if (!evaluation && !sessionReport) return;
    const text = `PHYSIOPULSE CLINICAL ORTHOPEDIC REPORT
Patient: ${sessionReport?.patient_name || patientName}
Diagnosis: ${evaluation?.cpt_billing?.diagnosis_name || \'Musculoskeletal Derangement\'} (${evaluation?.cpt_billing?.icd10_code || \'M75.10\'})
Readiness Score: ${evaluation?.readiness_score || 85}%
Compliance: ${sessionReport?.overall_compliance_percent || 100}%

Executive Medical Summary:
${evaluation?.executive_summary || \'Rehabilitation completed with active MediaPipe markerless tracking.\'}

Clinical Next-Session Directives:
${evaluation?.next_session_adjustments?.map((a, i) => `${i + 1}. ${a}`).join(\'\\n\')}

AI Prescriptive Home Care Tips:
${(evaluation?.clinical_tips || []).map((t, i) => `[${t.category}] ${t.title}\\nInstruction: ${t.instruction}\\nRationale: ${t.rationale}`).join(\'\\n\\n\')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleCopyTips = () => {
    const tips = evaluation?.clinical_tips || [];
    const text = `PHYSIOPULSE AT-HOME REHABILITATION DIRECTIVES
Patient: ${sessionReport?.patient_name || patientName}
Timestamp: ${new Date().toLocaleString()}

${tips.map((t, i) => `${i + 1}. [${t.category.toUpperCase()}] ${t.title}\\nInstruction: ${t.instruction}\\nClinical Rationale: ${t.rationale}\\n`).join(\'\\n\')}
`;
    navigator.clipboard.writeText(text);
    setCopiedTips(true);
    setTimeout(() => setCopiedTips(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-teal-500 selection:text-black">
      {/* Outer Desktop Window Shell */}
      <div className="relative w-full max-w-[1580px] bg-[#121215] rounded-3xl shadow-2xl border border-zinc-800/90 overflow-hidden flex flex-col">
        {/* 1. Desktop Browser Chrome Header */}
        <SessionBrowserChrome />

        {/* 2. Top Header Stepper */}
        <SessionWorkflowStepper
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          canAccessStage2={!!prescription}
          canAccessStage3={!!evaluation || !!sessionReport}
        />

        {/* 3. Main Workbench Canvas */}
        <main className="bg-[#09090b] min-h-[calc(100vh-140px)] p-4 sm:p-6 lg:p-8">
          {sessionError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 flex items-center gap-3 shadow-md">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              <span className="text-sm font-medium">{sessionError}</span>
            </div>
          )}

          {/* Stage 1: Intake & Triage */}
          {activeStage === 1 && (
            <IntakeFormStage
              patientName={patientName}
              setPatientName={setPatientName}
              age={age}
              setAge={setAge}
              affectedArea={affectedArea}
              setAffectedArea={setAffectedArea}
              painLevel={painLevel}
              setPainLevel={setPainLevel}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              activeProtocols={activeProtocols}
              onSelectProtocol={handleSelectProtocolFromMap}
              onGeneratePrescription={handleGeneratePrescription}
              isGenerating={isGeneratingPrescription}
              presets={PRESETS}
              onApplyPreset={handleApplyPreset}
              circuitMode={circuitMode}
              setCircuitMode={setCircuitMode}
            />
          )}

          {/* Stage 2: Prescription Queue & CV Session */}
          {activeStage === 2 && prescription && (
            <PrescriptionQueueStage
              prescription={prescription}
              patientName={patientName}
              onEditIntake={() => setActiveStage(1)}
              isRunningSession={isRunningSession}
              onLaunchVisionSession={handleLaunchVisionSession}
              onConcludeSession={() => setIsRunningSession(false)}
            />
          )}

          {/* Stage 3: Clinical Report */}
          {activeStage === 3 && (evaluation || sessionReport) && (
            <ClinicalReportStage
              evaluation={evaluation}
              sessionReport={sessionReport}
              patientName={patientName}
              painLevel={painLevel}
              evaluationSource={evaluationSource}
              onCopySummary={handleCopySummary}
              copiedSummary={copiedSummary}
              onCopyTips={handleCopyTips}
              copiedTips={copiedTips}
              onNewSession={() => {
                setSessionReport(null);
                setEvaluation(null);
                setActiveStage(1);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
'''

files = {
    os.path.join(web_app_dir, 'components', 'session', 'SessionBrowserChrome.tsx'): chrome_content,
    os.path.join(web_app_dir, 'components', 'session', 'SessionWorkflowStepper.tsx'): stepper_content,
    os.path.join(web_app_dir, 'app', 'session', 'page.tsx'): page_content,
}

for path, content in files.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\\n')
    print(f"Successfully wrote {path} (size: {len(content)})")

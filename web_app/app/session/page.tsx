'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  PrescriptionOutput,
  SessionReport,
  ClinicalEvaluationOutput
} from '@/lib/clinical-engine';

import { SessionBrowserChrome } from '@/components/session/SessionBrowserChrome';
import { SessionWorkflowStepper } from '@/components/session/SessionWorkflowStepper';
import { IntakeFormStage, IntakePreset } from '@/components/session/IntakeFormStage';
import { PrescriptionQueueStage } from '@/components/session/PrescriptionQueueStage';
import { ClinicalReportStage } from '@/components/session/ClinicalReportStage';

export default function PhysioPulseApp() {
  // 1 = Intake & Triage, 2 = Prescription & Session, 3 = Post-Session Report
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  // Stage 1 Intake State
  const [patientName, setPatientName] = useState('Sarah Jenkins');
  const [age, setAge] = useState<number>(34);
  const [affectedArea, setAffectedArea] = useState('Shoulder & Neck');
  const [painLevel, setPainLevel] = useState<number>(6);
  const [circuitMode, setCircuitMode] = useState<'targeted' | 'standard' | 'comprehensive'>('standard');
  const [symptoms, setSymptoms] = useState(
    'I had rotator cuff surgery 4 weeks ago and my neck also hurts from sitting at my laptop all day.'
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
  const [evaluationSource, setEvaluationSource] = useState<'llm_agent' | 'deterministic_engine' | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedTips, setCopiedTips] = useState(false);

  // Check initial existing status on mount
  useEffect(() => {
    async function checkExistingStatus() {
      try {
        const res = await fetch('/api/session-status');
        const data = await res.json();
        if (data.prescription) {
          setPrescription(data.prescription);
          setPatientName(data.prescription.patient_name || 'Sarah Jenkins');
          if (data.prescription.exercises) {
            setActiveProtocols(data.prescription.exercises.map((e: any) => e.protocol_id));
          }
        }
        if (data.report) {
          setSessionReport(data.report);
        }
      } catch (err) {
        console.warn('Status check warning:', err);
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
      title: 'Rotator Cuff + Desk Strain',
      area: 'Shoulder & Neck',
      pain: 6,
      protocols: [1, 5, 3, 4],
      desc: 'I had rotator cuff surgery 4 weeks ago and my neck also hurts from sitting at my laptop all day.'
    },
    {
      title: 'Post-ACL Knee Reconstruction',
      area: 'Knee & Hip',
      pain: 5,
      protocols: [2, 6, 7, 3],
      desc: 'Recovering from an ACL tear reconstruction. Quad feels weak and knee stability feels hesitant when squatting.'
    },
    {
      title: 'Carpal Tunnel & Wrist Fatigue',
      area: 'Wrist & Forearm',
      pain: 4,
      protocols: [8, 4, 3, 5],
      desc: 'Intense tingling and numbness in wrists and fingers from 10 hours daily software development and mouse usage.'
    },
    {
      title: 'Total Hip Replacement Rehab',
      area: 'Hip & Pelvis',
      pain: 7,
      protocols: [6, 2, 7, 3],
      desc: 'Underwent total hip arthroplasty 6 weeks ago. Struggling with lateral pelvic stability and gluteus medius weakness.'
    },
    {
      title: 'Lumbar Spine & Ergonomic Guard',
      area: 'Lower Back & Cervical Spine',
      pain: 6,
      protocols: [7, 6, 3, 2],
      desc: 'L4-L5 disc bulge history with stiffness bending forward and chronic forward-head posture at computer terminal.'
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
      const res = await fetch('/api/prescribe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setSessionError(data.error || 'Failed to synthesize prescription.');
      }
    } catch (err: any) {
      setSessionError(err.message || 'Network error generating prescription.');
    } finally {
      setIsGeneratingPrescription(false);
    }
  };

  const handleLaunchVisionSession = async () => {
    setIsRunningSession(true);
    setSessionError(null);
    try {
      const res = await fetch('/api/run-session', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.report) {
        setSessionReport(data.report);
        await handleTriggerEvaluation(prescription, data.report);
        setActiveStage(3);
      } else {
        setSessionError(data.error || 'Vision session completed without report output.');
      }
    } catch (err: any) {
      setSessionError(err.message || 'Error communicating with vision session engine.');
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
      const res = await fetch('/api/evaluate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      console.error('Error evaluating session:', err);
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
Diagnosis: ${evaluation?.cpt_billing?.diagnosis_name || 'Musculoskeletal Derangement'} (${evaluation?.cpt_billing?.icd10_code || 'M75.10'})
Readiness Score: ${evaluation?.readiness_score || 85}%
Compliance: ${sessionReport?.overall_compliance_percent || 100}%

Executive Medical Summary:
${evaluation?.executive_summary || 'Rehabilitation completed with active MediaPipe markerless tracking.'}

Clinical Next-Session Directives:
${evaluation?.next_session_adjustments?.map((a, i) => `${i + 1}. ${a}`).join('\n')}

AI Prescriptive Home Care Tips:
${(evaluation?.clinical_tips || []).map((t, i) => `[${t.category}] ${t.title}\nInstruction: ${t.instruction}\nRationale: ${t.rationale}`).join('\n\n')}
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

${tips.map((t, i) => `${i + 1}. [${t.category.toUpperCase()}] ${t.title}\nInstruction: ${t.instruction}\nClinical Rationale: ${t.rationale}\n`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedTips(true);
    setTimeout(() => setCopiedTips(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#EFF2F6] text-slate-900 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Outer Desktop Window Shell */}
      <div className="relative w-full max-w-[1580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col">
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
        <main className="bg-[#EFF2F6] bg-clinical-grid min-h-[calc(100vh-140px)] p-4 sm:p-6 lg:p-8">
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

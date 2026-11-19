'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, UserCheck, ShieldCheck, Sparkles, User, Settings2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  PrescriptionOutput,
  SessionReport,
  ClinicalEvaluationOutput
} from '@/lib/clinical-engine';
import {
  DecipheredDoctorReport,
  convertReportToPhysioPrescription
} from '@/lib/doctor-report-ocr';

import { ClinicalAuthGate } from '@/components/auth/ClinicalAuthGate';
import { PatientProfileModal } from '@/components/auth/PatientProfileModal';
import { SessionBrowserChrome } from '@/components/session/SessionBrowserChrome';
import { SessionWorkflowStepper } from '@/components/session/SessionWorkflowStepper';
import { IntakeFormStage, IntakePreset } from '@/components/session/IntakeFormStage';
import { PrescriptionQueueStage } from '@/components/session/PrescriptionQueueStage';
import { ClinicalReportStage } from '@/components/session/ClinicalReportStage';
import { DoctorReportScannerModal } from '@/components/session/DoctorReportScannerModal';
import { ConvexTelemetryLedger } from '@/components/session/ConvexTelemetryLedger';

export default function PhysioPulseApp() {
  // Clerk Authentication State
  const { isLoaded, isSignedIn, user } = useUser();

  // Convex User Profile & Cloud Mutations
  const convexUser = useQuery(api.users.currentUser);
  const saveSessionToConvex = useMutation(api.sessions.saveSession);
  const savePrescriptionToConvex = useMutation(api.prescriptions.savePrescription);
  const saveDoctorReportToConvex = useMutation(api.doctorReports.saveDoctorReport);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // 1 = Intake & Triage, 2 = Prescription & Session, 3 = Post-Session Report
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);

  // Stage 1 Intake State (Initialized dynamically from authenticated profile)
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [affectedArea, setAffectedArea] = useState('Shoulder & Neck');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [circuitMode, setCircuitMode] = useState<'targeted' | 'standard' | 'comprehensive'>('standard');
  const [symptoms, setSymptoms] = useState('');
  const [activeProtocols, setActiveProtocols] = useState<number[]>([1, 5, 3]);

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

  // Doctor Report & OCR State
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [doctorReport, setDoctorReport] = useState<DecipheredDoctorReport | null>(null);

  // Auto-populate intake form with authenticated user profile from Convex / Clerk
  useEffect(() => {
    if (convexUser) {
      if (convexUser.name) setPatientName(convexUser.name);
      if (convexUser.age) setAge(convexUser.age);
      if (convexUser.affectedArea) setAffectedArea(convexUser.affectedArea);
      if (convexUser.painLevel) setPainLevel(convexUser.painLevel);
      if (convexUser.medicalHistory) setSymptoms(convexUser.medicalHistory);
    } else if (user) {
      const displayName = user.fullName || user.firstName || '';
      if (displayName && !patientName) {
        setPatientName(displayName);
      }
    }
  }, [convexUser, user]);

  const handleApplyDoctorReport = (rep: DecipheredDoctorReport) => {
    setDoctorReport(rep);
    const formulatedPrescription = convertReportToPhysioPrescription(rep);
    
    const resolvedName = formulatedPrescription.patient_name || patientName || user?.fullName || 'Patient';
    setPatientName(resolvedName);
    setAge(rep.patient_details.age || age || 32);
    setAffectedArea(rep.session_plan.affected_area || 'Shoulder & Neck');
    setPainLevel(rep.session_plan.vas_pain_level || 6);
    setSymptoms(
      `Deciphered Medical Document [${rep.doctor_details.doctor_name}, ${rep.doctor_details.hospital_or_clinic}]:\n` +
      `Diagnosis: ${rep.clinical_findings.diagnosis}\n\n` +
      `Clinical Rationale & Directives:\n${rep.session_plan.clinical_diagnosis_summary}`
    );

    setPrescription(formulatedPrescription);
    setActiveProtocols(formulatedPrescription.exercises.map((e) => e.protocol_id));

    // Persist deciphered OCR document to Convex DB under authenticated user
    saveDoctorReportToConvex({
      patientName: resolvedName,
      doctorName: rep.doctor_details.doctor_name,
      clinic: rep.doctor_details.hospital_or_clinic,
      rawText: rep.raw_transcription || rep.clinical_findings.diagnosis,
      diagnosis: rep.clinical_findings.diagnosis,
      confidenceScore: rep.handwriting_audit?.decipher_confidence_percent,
    }).catch((e) => console.warn('Convex OCR save notice:', e));

    // Persist formulated prescription to Convex DB under authenticated user
    savePrescriptionToConvex({
      patientName: resolvedName,
      age: rep.patient_details.age || age || 32,
      affectedArea: rep.session_plan.affected_area || 'Shoulder & Neck',
      painLevel: rep.session_plan.vas_pain_level || 6,
      symptoms: rep.clinical_findings.diagnosis,
      circuitMode: 'targeted',
      clinicalDiagnosisSummary: formulatedPrescription.clinical_diagnosis_summary,
      precautions: formulatedPrescription.precautions,
      exercises: formulatedPrescription.exercises,
      source: 'doctor_ocr',
    }).catch((e) => console.warn('Convex prescription save notice:', e));

    setActiveStage(2);
  };

  // Check if a report was forwarded from the landing page scanner on mount
  useEffect(() => {
    try {
      const pending = sessionStorage.getItem('pending_doctor_report');
      if (pending) {
        sessionStorage.removeItem('pending_doctor_report');
        const parsedReport = JSON.parse(pending);
        handleApplyDoctorReport(parsedReport);
      }
    } catch (e) {
      console.warn('Pending report extraction warning:', e);
    }
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
      desc: 'Rotator cuff impingement rehabilitation with cervical postural compensation prevention.'
    },
    {
      title: 'Post-ACL Knee Reconstruction',
      area: 'Knee & Hip',
      pain: 5,
      protocols: [2, 6, 7, 3],
      desc: 'Recovering from an ACL reconstruction. Rebuilding quadriceps and lateral pelvic stability.'
    },
    {
      title: 'Carpal Tunnel & Wrist Fatigue',
      area: 'Wrist & Forearm',
      pain: 4,
      protocols: [8, 4, 3, 5],
      desc: 'Tingling and wrist fatigue from repetitive computer desk strain and typing.'
    },
    {
      title: 'Total Hip Replacement Rehab',
      area: 'Hip & Pelvis',
      pain: 7,
      protocols: [6, 2, 7, 3],
      desc: 'Post-hip arthroplasty recovery focusing on gluteus medius coronal plane stability.'
    },
    {
      title: 'Lumbar Spine & Ergonomic Guard',
      area: 'Lower Back & Cervical Spine',
      pain: 6,
      protocols: [7, 6, 3, 2],
      desc: 'Lumbar disc bulge history with stiffness forward bending and postural slouch.'
    }
  ];

  const handleApplyPreset = (preset: IntakePreset) => {
    setAffectedArea(preset.area);
    setPainLevel(preset.pain);
    setSymptoms(preset.symptoms || preset.desc);
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
      const activeName = patientName.trim() || user?.fullName || 'Patient';
      const res = await fetch('/api/prescribe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeName,
          age,
          affectedArea,
          painLevel,
          symptoms: symptoms || 'Musculoskeletal movement limitation and stiffness.',
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

        // Persist formulated prescription to Convex DB linked to authenticated user
        savePrescriptionToConvex({
          patientName: activeName,
          age,
          affectedArea,
          painLevel,
          symptoms: symptoms || 'Targeted Physical Therapy Intake',
          circuitMode,
          clinicalDiagnosisSummary: data.prescription.clinical_diagnosis_summary || 'Custom Kinematic Regimen',
          precautions: data.prescription.precautions || 'Maintain neutral spine',
          exercises: data.prescription.exercises.map((e: any) => ({
            protocol_id: e.protocol_id,
            protocol_name: e.protocol_name,
            target_reps: e.target_reps,
            target_rom_degrees: e.target_rom_degrees,
            clinical_rationale: e.clinical_rationale,
          })),
          source: 'intake',
        }).catch((e) => console.warn('Convex prescription save notice:', e));

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
      const isLocal =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isLocal) {
        // In local development, trigger the local Python runner asynchronously
        fetch('/api/run-session', { method: 'POST' })
          .then((res) => res.json())
          .then(async (data) => {
            if (data.success && data.report) {
              setSessionReport(data.report);
              await handleTriggerEvaluation(prescription, data.report);
              setActiveStage(3);
            }
          })
          .catch((err) => {
            console.warn('Local background vision session notice:', err);
          });
      } else {
        // Cloud / Vercel: notify backend of session initialization without prematurely transitioning to report stage
        await fetch('/api/run-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'launch', prescription })
        });
      }
    } catch (err: any) {
      console.warn('Vision session launch notice:', err);
    }
  };

  const handleConcludeSession = async (directReport?: any) => {
    setIsRunningSession(false);
    try {
      if (directReport && directReport.exercises_performed) {
        setSessionReport(directReport);
        await handleTriggerEvaluation(prescription, directReport);
        setActiveStage(3);
        return;
      }

      const res = await fetch('/api/run-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'conclude', prescription })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setSessionReport(data.report);
        await handleTriggerEvaluation(prescription, data.report);
        setActiveStage(3);
      }
    } catch (err: any) {
      console.error('Error concluding vision session:', err);
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

        // Persist completed session & kinematic evaluation to Convex DB under authenticated user
        if (rep) {
          saveSessionToConvex({
            sessionId: rep.session_id,
            patientName: rep.patient_name || patientName || user?.fullName || 'Patient',
            age,
            affectedArea,
            painLevel,
            prescribedDiagnosis: rep.prescribed_diagnosis || 'Targeted Physical Therapy Session',
            overallCompliancePercent: rep.overall_compliance_percent || 100,
            exercisesPerformed: rep.exercises_performed || [],
            evaluation: data.evaluation,
          }).catch((e) => console.warn('Convex session save notice:', e));
        }
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
Patient: ${sessionReport?.patient_name || patientName || user?.fullName || 'Patient'}
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
Patient: ${sessionReport?.patient_name || patientName || user?.fullName || 'Patient'}
Timestamp: ${new Date().toLocaleString()}

${tips.map((t, i) => `${i + 1}. [${t.category.toUpperCase()}] ${t.title}\nInstruction: ${t.instruction}\nClinical Rationale: ${t.rationale}\n`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedTips(true);
    setTimeout(() => setCopiedTips(false), 2500);
  };

  // ---------------------------------------------------------------------------
  // AUTHENTICATION GUARD
  // ---------------------------------------------------------------------------
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFF2F6] font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600 font-mono">
            Verifying Clinical Authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is not signed in, render the secure clinical authentication gate
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#EFF2F6] flex flex-col justify-center items-center p-4">
        <ClinicalAuthGate />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED CLINICAL APP
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-slate-100/80 text-slate-900 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Outer Desktop Window Shell */}
      <div className="relative w-full max-w-[1580px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* 1. Desktop Browser Chrome Header */}
        <SessionBrowserChrome onOpenProfile={() => setIsProfileModalOpen(true)} />

        {/* 2. Authenticated Patient Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-700">Authenticated Patient:</span>
            <span className="font-bold text-slate-900 font-sans">
              {patientName || user?.fullName || 'Active Patient'}
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-semibold">
              Convex DB Sync Active
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition cursor-pointer shadow-2xs text-[11px]"
            >
              <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Edit Health Profile</span>
            </button>
          </div>
        </div>

        {/* 3. Top Header Stepper */}
        <SessionWorkflowStepper
          activeStage={activeStage}
          setActiveStage={setActiveStage}
          canAccessStage2={!!prescription}
          canAccessStage3={true}
        />

        {/* 4. Main Workbench Canvas */}
        <main className="bg-slate-50 min-h-[calc(100vh-140px)] p-3 sm:p-6 lg:p-8">
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
              onOpenOcrScanner={() => setIsOcrModalOpen(true)}
              activeReport={doctorReport}
            />
          )}

          {/* Stage 2: Prescription Queue & CV Session */}
          {activeStage === 2 && prescription && (
            <PrescriptionQueueStage
              prescription={prescription}
              patientName={patientName || user?.fullName || 'Patient'}
              onEditIntake={() => setActiveStage(1)}
              isRunningSession={isRunningSession}
              onLaunchVisionSession={handleLaunchVisionSession}
              onConcludeSession={handleConcludeSession}
              doctorReport={doctorReport}
              onViewDoctorReport={() => setIsOcrModalOpen(true)}
            />
          )}

          {/* Stage 3: Clinical Report */}
          {activeStage === 3 && (
            <ClinicalReportStage
              evaluation={evaluation}
              sessionReport={sessionReport}
              patientName={patientName || user?.fullName || 'Patient'}
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

          {/* Convex Real-Time Clinical Cloud Telemetry & History */}
          <ConvexTelemetryLedger />
        </main>
      </div>

      {/* Doctor Prescription OCR & Care Plan Formulation Modal */}
      <DoctorReportScannerModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onApplyPlan={handleApplyDoctorReport}
      />

      {/* Patient Health Profile Edit Modal */}
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => {
          setPatientName(updated.name);
          setAge(updated.age);
          setAffectedArea(updated.affectedArea);
          setPainLevel(updated.painLevel);
          if (updated.medicalHistory) setSymptoms(updated.medicalHistory);
        }}
      />
    </div>
  );
}

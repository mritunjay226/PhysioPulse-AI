'use client';

import React from 'react';
import {
  User,
  Activity,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  FileCheck,
  Stethoscope,
  Clock,
  Calendar,
  Pill,
  ChevronRight
} from 'lucide-react';
import { AnatomicalBodyMap } from '@/components/AnatomicalBodyMap';
import { DecipheredDoctorReport } from '@/lib/doctor-report-ocr';

export interface IntakePreset {
  title: string;
  area: string;
  pain: number;
  symptoms: string;
  desc: string;
  protocols: number[];
}

export interface IntakeFormStageProps {
  patientName: string;
  setPatientName: (name: string) => void;
  age: number;
  setAge: (age: number) => void;
  affectedArea: string;
  setAffectedArea: (area: string) => void;
  painLevel: number;
  setPainLevel: (pain: number) => void;
  symptoms: string;
  setSymptoms: (sym: string) => void;
  activeProtocols: number[];
  onSelectProtocol: (id: number) => void;
  onGeneratePrescription: () => void;
  isGenerating: boolean;
  presets: IntakePreset[];
  onApplyPreset: (preset: IntakePreset) => void;
  circuitMode: 'targeted' | 'standard' | 'comprehensive';
  setCircuitMode: (circuit: 'targeted' | 'standard' | 'comprehensive') => void;
  onOpenOcrScanner?: () => void;
  activeReport?: DecipheredDoctorReport | null;
}

export function IntakeFormStage({
  patientName,
  setPatientName,
  age,
  setAge,
  affectedArea,
  setAffectedArea,
  painLevel,
  setPainLevel,
  symptoms,
  setSymptoms,
  activeProtocols,
  onSelectProtocol,
  onGeneratePrescription,
  isGenerating,
  presets,
  onApplyPreset,
  circuitMode,
  setCircuitMode,
  onOpenOcrScanner,
  activeReport
}: IntakeFormStageProps) {
  const [uploadedReportName, setUploadedReportName] = React.useState<string | null>(null);

  const handleLoadSampleReport = (type: 'rotator' | 'acl' | 'spine') => {
    if (type === 'rotator') {
      setUploadedReportName('Discharge_Summary_Rotator_Cuff_PostOp.pdf');
      setAffectedArea('Shoulder & Neck');
      setPainLevel(5);
      setSymptoms('DISCHARGE SUMMARY & MRI FINDINGS:\nPatient underwent arthroscopic repair of right supraspinatus tendon tear. Post-operative week 4. Active forward flexion and abduction limited by pain. Passive ROM permitted to 90°. Advised to avoid compensatory trapezius shrugging and re-train scapular stability.');
    } else if (type === 'acl') {
      setUploadedReportName('MRI_Knee_ACL_Reconstruction_Report.pdf');
      setAffectedArea('Knee & Hip');
      setPainLevel(6);
      setSymptoms('CLINICAL ORTHOPEDIC NOTE:\nStatus post left ACL hamstring autograft reconstruction at 6 weeks. Mild joint effusion noted. Patient exhibits quadriceps inhibition and guarded terminal extension. Prescribed closed kinetic chain knee extension and gluteus medius pelvic stabilization.');
    } else {
      setUploadedReportName('Lumbar_Spine_MRI_Sagittal_L4L5.pdf');
      setAffectedArea('Lower Back & Cervical Spine');
      setPainLevel(6);
      setSymptoms('MRI RADIOLOGY FINDINGS (LUMBAR SPINE):\nL4-L5 posterior disc protrusion with mild thecal sac impingement. Lumbar spine flexion restricted with paraspinal muscle spasm. Advised neutral spine posture re-education, hamstring nerve glides, and strict avoidance of lumbar axial torsion.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedReportName(file.name);
      setSymptoms(
        `Uploaded Patient Document [${file.name}]:\n` +
        `Patient reports continuous musculoskeletal limitation during daily activities. Referral indicates structured physical therapy exercise with gradual progression.`
      );
    }
  };

  const getPainColor = (val: number) => {
    if (val <= 3) return 'text-emerald-700';
    if (val <= 6) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getPainDescriptor = (val: number) => {
    if (val <= 3) return 'Mild / Discomfort During Movement';
    if (val <= 6) return 'Moderate Functional Limitation';
    return 'Acute Guarded Pathomechanical Pain';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Patient Intake Form */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-sans">
                Patient Intake & Triage
              </h2>
              <p className="text-xs text-slate-500 font-sans">
                Map patient symptoms and clinical directives to rehabilitation circuits
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Stage 1 of 3
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Doctor Report OCR Banner Card */}
          <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/80 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                  <Stethoscope className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-slate-900 font-sans">
                      Upload Doctor Prescription or Clinical Referral
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-emerald-200 text-emerald-800">
                      OCR Intake Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed max-w-xl">
                    Extracts diagnoses, ICD-10 indications, and surgical precautions directly from handwritten prescriptions or referral notes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={onOpenOcrScanner}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{activeReport ? 'View / Rescan Prescription' : 'Scan Prescription (OCR)'}</span>
                </button>
              </div>
            </div>

            {/* Active Report Status Pill if already loaded */}
            {activeReport && (
              <div className="mt-3 pt-3 border-t border-emerald-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">{activeReport.doctor_details.doctor_name}</span>
                  <span className="text-slate-500">({activeReport.doctor_details.hospital_or_clinic})</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenOcrScanner}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  View Parsed Protocol & Schedule →
                </button>
              </div>
            )}
          </div>

          {/* Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-sans">
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-sans">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Affected Body Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-sans">
              Primary Affected Joint / Kinetic Chain
            </label>
            <select
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans"
            >
              <option value="Shoulder & Glenohumeral Joint">Shoulder & Glenohumeral Joint (Protocol 1)</option>
              <option value="Knee & Tibiofemoral Joint">Knee & Patella / Post-ACL (Protocol 2)</option>
              <option value="Cervical Spine & Neck">Cervical Spine & Ergonomic Neck (Protocol 3)</option>
              <option value="Elbow & Humeroulnar Joint">Elbow Flexion / Post-Fracture (Protocol 4)</option>
              <option value="Bilateral Overhead & Scapula">Bilateral Overhead Wall-Slide (Protocol 5)</option>
              <option value="Hip & Coxofemoral Joint">Hip Abduction / Arthroplasty (Protocol 6)</option>
              <option value="Lumbar Spine & Low Back">Lumbar Spine / Disc Rehab (Protocol 7)</option>
              <option value="Wrist & Carpal Tunnel">Carpal Tunnel & Forearm Tendons (Protocol 8)</option>
              <option value="Shoulder & Neck">Combined: Shoulder & Desk Neck Strain</option>
            </select>
          </div>

          {/* Subjective Pain Scale Slider */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 font-sans">
                Visual Analog Scale (VAS Pain Score)
              </span>
              <span className={`text-base font-bold font-mono ${getPainColor(painLevel)}`}>
                {painLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex items-center justify-between mt-2 text-[11px] font-sans">
              <span className="text-slate-500">1 = Mild / Nagging</span>
              <span className={`font-semibold ${getPainColor(painLevel)}`}>
                {getPainDescriptor(painLevel)}
              </span>
              <span className="text-slate-500">10 = Severe Guarding</span>
            </div>
          </div>

          {/* Circuit Depth Mode Selector */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 font-sans">
                Rehabilitation Protocol Circuit Depth
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Auto-Tuned
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mb-3">
              Configure how many sequential kinetic protocols to assemble into this session:
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setCircuitMode('targeted')}
                className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer font-medium ${
                  circuitMode === 'targeted'
                    ? 'bg-white border-emerald-600 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                Targeted (1-2)
              </button>
              <button
                type="button"
                onClick={() => setCircuitMode('standard')}
                className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer font-medium ${
                  circuitMode === 'standard'
                    ? 'bg-white border-emerald-600 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                Standard (3-4)
              </button>
              <button
                type="button"
                onClick={() => setCircuitMode('comprehensive')}
                className={`py-2 px-3 rounded-lg border transition-all text-center cursor-pointer font-medium ${
                  circuitMode === 'comprehensive'
                    ? 'bg-white border-emerald-600 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                Full Circuit (5+)
              </button>
            </div>
          </div>

          {/* Doctor Report Upload & Parsing */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 font-sans flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Upload Clinical Notes / Discharge Summary</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans mb-3">
              Upload discharge summaries or MRI reports to parse surgical contraindications into your protocol.
            </p>

            {/* Dropzone */}
            <label className="flex flex-col items-center justify-center p-3.5 border border-dashed border-slate-300 hover:border-emerald-500 rounded-lg bg-white transition-all cursor-pointer group">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span className="text-xs font-sans text-slate-600 group-hover:text-slate-900">
                  {uploadedReportName ? (
                    <span className="text-emerald-700 font-semibold">Uploaded: {uploadedReportName}</span>
                  ) : (
                    <span>Click to select PDF or image file</span>
                  )}
                </span>
              </div>
            </label>

            {/* Demo Medical Reports */}
            <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Sample Reports:</span>
              <button
                type="button"
                onClick={() => handleLoadSampleReport('rotator')}
                className="text-[11px] font-sans px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Post-Op Rotator Cuff MRI
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleReport('acl')}
                className="text-[11px] font-sans px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                ACL Autograft Note
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleReport('spine')}
                className="text-[11px] font-sans px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Lumbar Disc MRI
              </button>
            </div>
          </div>

          {/* Subjective Symptoms Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 font-sans">
              Subjective Symptoms & Clinical History
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all font-sans leading-relaxed"
              placeholder="Describe surgical history, symptoms, or movement triggers..."
            />
          </div>

          {/* Emergency Red-Flag Triage Guardrail */}
          {painLevel >= 8 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Clinical Precaution: Acute VAS Pain Level ({painLevel}/10)</span>
              </div>
              <p className="text-xs text-rose-700 font-sans leading-relaxed">
                Acute pathomechanical threshold reached. High-intensity range-of-motion movements should be paused. Consulting with your physical therapist or attending physiatrist is advised.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={onGeneratePrescription}
            disabled={isGenerating}
            className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Clinical Protocol Queue...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Generate Clinical Prescription Queue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Demo Presets */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase text-slate-600 tracking-wider">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Clinical Preset Scenarios</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset(p)}
                className="text-left p-3.5 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-400 transition-all text-xs group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                    VAS {p.pain}/10
                  </span>
                </div>
                <p className="text-slate-500 line-clamp-1 text-[11px] font-sans">{p.desc}</p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-700">
                    {p.protocols.length} Protocols:
                  </span>
                  <span>
                    P{p.protocols.join(', P')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Anatomical Body Map Card */}
      <div className="lg:col-span-5 space-y-6">
        <AnatomicalBodyMap
          activeProtocols={activeProtocols}
          onSelectProtocol={onSelectProtocol}
        />
      </div>
    </div>
  );
}

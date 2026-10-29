'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Calendar,
  Pill,
  Activity,
  Layers,
  ShieldCheck,
  Zap,
  Printer,
  Copy,
  Check,
  Eye,
  Camera,
  X,
  Stethoscope,
  ChevronRight,
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { DecipheredDoctorReport } from '@/lib/doctor-report-ocr';

export interface DoctorReportScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (report: DecipheredDoctorReport) => void;
}

export function DoctorReportScannerModal({
  isOpen,
  onClose,
  onApplyPlan
}: DoctorReportScannerModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<number>(1);
  const [report, setReport] = useState<DecipheredDoctorReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'decoder' | 'session' | 'meds' | 'schedule'>('decoder');
  const [copiedSchedule, setCopiedSchedule] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runScanningSimulation = async (sampleType?: string, fileToUpload?: File) => {
    setIsScanning(true);
    setScanStep(1);
    setError(null);

    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 900);

    try {
      let res: Response;
      if (sampleType) {
        res = await fetch('/api/ocr-prescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sample_type: sampleType })
        });
      } else if (fileToUpload) {
        const formData = new FormData();
        formData.append('prescription', fileToUpload);
        res = await fetch('/api/ocr-prescription', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/ocr-prescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sample_type: 'rotator_cuff' })
        });
      }

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse prescription');
      }

      setReport(data.report);
      setIsScanning(false);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setError(err.message || 'Error occurred while processing prescription.');
    }
  };

  const handleStartUploadScan = () => {
    if (!selectedFile) return;
    runScanningSimulation(undefined, selectedFile);
  };

  const handleSelectSample = (type: string) => {
    let previewPath = '/prescriptions/dr_sharma_rotator_cuff.png';
    if (type === 'acl_knee') previewPath = '/prescriptions/dr_sengupta_acl_knee.png';
    if (type === 'lumbar_sciatica') previewPath = '/prescriptions/dr_gupta_lumbar_spine.png';
    setFilePreview(previewPath);
    runScanningSimulation(type);
  };

  const handleCopySchedule = () => {
    if (!report) return;
    const lines = [
      `PATIENT REHABILITATION & MEDICATION SCHEDULE`,
      `Patient: ${report.patient_details.name} (Age: ${report.patient_details.age})`,
      `Consultant: ${report.doctor_details.doctor_name} (${report.doctor_details.hospital_or_clinic})`,
      `Diagnosis: ${report.clinical_findings.diagnosis}`,
      ``,
      `DAILY TIMETABLE:`,
      ...report.schedule.daily_schedule.map((s) =>
        `[${s.time_slot}] ${s.title}\n- Focus: ${s.therapy_focus}\n- Meds: ${s.medications_due.join(', ') || 'None'}\n- Actions:\n  ${s.action_items.map((a) => `• ${a}`).join('\n  ')}\n`
      ),
      `14-DAY PROGRESSION MILESTONES:`,
      ...report.schedule.milestones.map((m) =>
        `[${m.phase}] ${m.title} (Target ROM: ${m.target_rom_gain})\n  ${m.goals.map((g) => `• ${g}`).join('\n  ')}\n`
      ),
      `Follow-up Review: in ${report.schedule.follow_up.review_after_days} days (${report.schedule.follow_up.tentative_date}) with ${report.schedule.follow_up.doctor_name}`
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2500);
  };

  const handleApplyAndProceed = () => {
    if (!report) return;
    onApplyPlan(report);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Modal Window Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                  Doctor Prescription & Clinical Referral Intake (OCR)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                  Medical Shorthand Parser
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Extracts clinical notes, Latin directions (OD/BD/TDS), precautions, and structures your therapy routine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto max-h-[calc(94vh-140px)] space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* SCREEN 1: Upload or Pick Demo Sample (If no report generated yet) */}
          {!report && !isScanning && (
            <div className="space-y-6">
              {/* Top Banner Notice */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 font-sans">
                      Automated Prescription Parsing & Protocol Formulation
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans">
                      Translates clinical diagnoses, medication directions, and anti-compensation boundaries into a guided session.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                  Vision AI Active
                </span>
              </div>

              {/* Upload Zone */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-7 flex flex-col">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      filePreview
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/10'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {filePreview ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <div className="relative w-40 h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreview}
                            alt="Uploaded Prescription"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{selectedFile?.name || 'Prescription Ready for Analysis'}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 underline hover:text-slate-800">
                          Click to select a different file
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-xs">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 font-sans">
                            Upload Doctor&apos;s Prescription or Referral Slip
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-sans">
                            Drag & drop or browse image (JPG, PNG) or PDF scan
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {filePreview && (
                    <button
                      onClick={handleStartUploadScan}
                      className="mt-4 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer font-sans transition-colors"
                    >
                      <Activity className="w-4 h-4" />
                      <span>Parse Prescription & Formulate Protocol</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Instant 1-Click Samples */}
                <div className="md:col-span-5 flex flex-col justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant 1-Click Clinical Samples</span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans mb-4">
                      Test instant OCR extraction on verified clinical referral cases:
                    </p>

                    <div className="space-y-2.5">
                      {/* Sample 1: Rotator Cuff */}
                      <button
                        onClick={() => handleSelectSample('rotator_cuff')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans">
                            Dr. R. K. Sharma (Apollo Hospitals)
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Cursive Script
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                          Shoulder Impingement / Rotator Cuff + Trapezius Guarding
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time OCR</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-emerald-600" />
                        </div>
                      </button>

                      {/* Sample 2: ACL Knee */}
                      <button
                        onClick={() => handleSelectSample('acl_knee')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans">
                            Dr. Anita Sengupta (AIIMS Trauma)
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Post-Surgical Note
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                          Left Knee ACL Reconstruction + Patellar Tracking Deficit
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time OCR</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-emerald-600" />
                        </div>
                      </button>

                      {/* Sample 3: Lumbar PIVD */}
                      <button
                        onClick={() => handleSelectSample('lumbar_sciatica')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans">
                            Dr. Rajesh Gupta (Max Spine Institute)
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Spine Referral
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                          L4-L5 Disc Protrusion (PIVD) + Lumbar Stabilization
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time OCR</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-emerald-600" />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clicking any sample runs real-time clinical OCR</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Live Scanning Animation State */}
          {isScanning && (
            <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative w-64 h-80 rounded-xl overflow-hidden border border-emerald-300 shadow-lg bg-slate-50">
                {filePreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={filePreview}
                    alt="Scanning"
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Laser scan line effect */}
                <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-[bounce_2s_infinite]" />
              </div>

              <div className="space-y-2 max-w-md">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-bold text-slate-900 font-sans">
                    Multimodal Vision Model Parsing Prescription
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 font-sans">
                  <div className={scanStep >= 1 ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                    ✓ Step 1: Segmenting handwriting and text blocks
                  </div>
                  <div className={scanStep >= 2 ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                    ✓ Step 2: Extracting clinical findings & precautions
                  </div>
                  <div className={scanStep >= 3 ? 'text-emerald-700 font-medium' : 'text-slate-400'}>
                    ✓ Step 3: Formulating kinetic exercise routine & schedule
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Deciphered Results Dashboard */}
          {report && !isScanning && (
            <div className="space-y-6">
              {/* Doctor Header Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-slate-900 font-sans">
                        {report.doctor_details.doctor_name}
                      </h4>
                      <span className="text-xs text-slate-500">
                        ({report.doctor_details.qualifications})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 font-medium">
                        Reg: {report.doctor_details.registration_number}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      {report.doctor_details.hospital_or_clinic} · {report.doctor_details.department}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>Date: {report.doctor_details.consultation_date}</span>
                      <span>·</span>
                      <span>Patient: {report.patient_details.name} ({report.patient_details.age}y / {report.patient_details.gender})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => {
                      setReport(null);
                      setFilePreview(null);
                      setSelectedFile(null);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-colors"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={handleCopySchedule}
                    className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedSchedule ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchedule ? 'Copied' : 'Copy Schedule'}</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-sans">
                <button
                  onClick={() => setActiveTab('decoder')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'decoder'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>1. Deciphered Report</span>
                </button>

                <button
                  onClick={() => setActiveTab('session')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'session'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>2. Formulated Session ({report.session_plan.exercises.length} Protocols)</span>
                </button>

                <button
                  onClick={() => setActiveTab('meds')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'meds'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Pill className="w-4 h-4" />
                  <span>3. Medications & Lifestyle</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'schedule'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>4. Daily & Weekly Schedule</span>
                </button>
              </div>

              {/* TAB 1: DECIPHERED REPORT & SHORTHAND */}
              {activeTab === 'decoder' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Original Document Preview */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        Original Prescription
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        OCR Verified
                      </span>
                    </div>

                    <div className="relative w-full rounded-lg overflow-hidden border border-slate-200 bg-white max-h-[500px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={report.image_url || filePreview || '/prescriptions/dr_sharma_rotator_cuff.png'}
                        alt="Original Doctor Prescription"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Right: Deciphered Text */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Legibility vs Confidence Audit */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 mb-1">
                          Handwriting Legibility
                        </span>
                        <span className="text-2xl font-mono font-bold text-amber-600">
                          {report.handwriting_audit.legibility_score_percent}%
                        </span>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-slate-500 mb-1">
                          Deciphering Confidence
                        </span>
                        <span className="text-2xl font-mono font-bold text-emerald-700">
                          {report.handwriting_audit.decipher_confidence_percent}%
                        </span>
                      </div>
                    </div>

                    {/* Decoded Medical Shorthand Pill Tags */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Decoded Clinical Shorthand Terms</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {report.handwriting_audit.shorthand_terms_decoded.map((term, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono font-bold text-slate-900">
                                {term.raw_term}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Decoded
                              </span>
                            </div>
                            <p className="text-slate-800 font-semibold text-xs font-sans">
                              {term.decoded_meaning}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-1 font-sans">
                              {term.clinical_context}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Findings & Diagnosis */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                          Clinical Diagnosis
                        </span>
                        <h4 className="text-base font-bold text-emerald-800 font-sans">
                          {report.clinical_findings.diagnosis}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            ICD-10: {report.clinical_findings.icd10_code}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-sans">
                        <div>
                          <span className="font-bold text-slate-700 block text-xs">Chief Complaints:</span>
                          <ul className="list-disc list-inside text-slate-600 mt-0.5 space-y-0.5">
                            {report.clinical_findings.chief_complaints.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRESCRIBED SESSION */}
              {activeTab === 'session' && (
                <div className="space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <span className="text-xs uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold inline-block mb-2">
                      Formulated Protocol Routine
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 font-sans">
                      Prescribed Exercises for {report.session_plan.patient_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed font-sans max-w-4xl">
                      {report.session_plan.clinical_diagnosis_summary}
                    </p>
                    <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <span className="font-bold">Precautions: </span>
                      {report.session_plan.precautions}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.session_plan.exercises.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-block mb-2">
                            Step #{idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 mb-1 font-sans">
                            {ex.protocol_name}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3 font-sans">
                            {ex.clinical_rationale}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                            <span className="text-[10px] text-slate-400 uppercase block">Reps</span>
                            <span className="font-bold text-emerald-700">{ex.target_reps}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                            <span className="text-[10px] text-slate-400 uppercase block">Target ROM</span>
                            <span className="font-bold text-emerald-700">{ex.target_rom_degrees}°</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MEDICATION PLAN */}
              {activeTab === 'meds' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Prescribed Medications ({report.treatment_plan.medications.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {report.treatment_plan.medications.map((med, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">
                            {med.name}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {med.dosage}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-emerald-700">
                          {med.frequency} · {med.timing}
                        </div>
                        <div className="text-xs text-slate-600">
                          {med.purpose}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Daily Schedule Timetable
                  </h4>
                  <div className="space-y-2.5">
                    {report.schedule.daily_schedule.map((slot, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs ${
                          slot.is_physiopulse_session
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold font-mono text-emerald-800">{slot.time_slot}</span>
                          <span className="font-bold">{slot.title}</span>
                        </div>
                        <p className="text-slate-600 text-xs">{slot.therapy_focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Window Footer Actions */}
        {report && (
          <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-sans">
              Apply patient prescription data to populate Stage 2 kinetic exercises.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>

              <button
                onClick={handleApplyAndProceed}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer font-sans transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Apply Plan & Launch Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

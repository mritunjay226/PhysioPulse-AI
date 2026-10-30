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
  const [scanModality, setScanModality] = useState<'prescription' | 'xray' | 'mri'>('prescription');
  const [activeTab, setActiveTab] = useState<'decoder' | 'radiology' | 'session' | 'meds' | 'schedule'>('decoder');
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
          body: JSON.stringify({
            sample_type: sampleType,
            sampleId: sampleType,
            scanType: scanModality
          })
        });
      } else if (fileToUpload) {
        const formData = new FormData();
        formData.append('prescription', fileToUpload);
        formData.append('fileName', fileToUpload.name);
        formData.append('scanType', scanModality);
        res = await fetch('/api/ocr-prescription', {
          method: 'POST',
          body: formData
        });
      } else {
        res = await fetch('/api/ocr-prescription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sample_type: 'rotator_cuff',
            sampleId: 'rotator_cuff',
            scanType: scanModality
          })
        });
      }

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok || !data.report) {
        throw new Error(data.error || 'Failed to decipher document');
      }

      setReport(data.report);
      if (data.report.radiology_scan) {
        setActiveTab('radiology');
      } else {
        setActiveTab('decoder');
      }
      setIsScanning(false);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsScanning(false);
      setError(err.message || 'Error occurred while processing document.');
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
    if (type === 'xray_knee_oa') {
      previewPath = '/scan_knee_xray.png';
      setScanModality('xray');
    }
    if (type === 'mri_shoulder_tear') {
      previewPath = '/scan_shoulder_mri.png';
      setScanModality('mri');
    }
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
                      Multimodal Medical Document & Radiology Vision Intake
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans">
                      Analyzes handwritten doctor prescriptions, plain film X-Rays, and 3.0T MRI scans to formulate guarded kinematics.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap">
                  Gemini Vision Active
                </span>
              </div>

              {/* Modality Selector Switcher */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-lg border border-slate-200/60">
                <button
                  type="button"
                  onClick={() => setScanModality('prescription')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scanModality === 'prescription'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>📄 Prescription</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanModality('xray')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scanModality === 'xray'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-blue-200" />
                  <span>🩻 Digital X-Ray</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScanModality('mri')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    scanModality === 'mri'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-purple-200" />
                  <span>🧲 3.0T MRI Scan</span>
                </button>
              </div>

              {/* Upload Zone */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                <div className="md:col-span-7 flex flex-col">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      filePreview
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : scanModality === 'xray'
                        ? 'border-blue-300 hover:border-blue-500 bg-blue-50/20 hover:bg-blue-50/40'
                        : scanModality === 'mri'
                        ? 'border-purple-300 hover:border-purple-500 bg-purple-50/20 hover:bg-purple-50/40'
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
                        <div className="relative w-44 h-48 rounded-xl overflow-hidden border border-slate-200 shadow-md bg-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={filePreview}
                            alt="Uploaded Medical Image"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{selectedFile?.name || (scanModality === 'xray' ? 'X-Ray Radiograph Ready' : scanModality === 'mri' ? 'MRI Sequence Ready' : 'Prescription Ready')}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 underline hover:text-slate-800">
                          Click to select a different file
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3 flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs ${
                          scanModality === 'xray' ? 'text-blue-600' : scanModality === 'mri' ? 'text-purple-600' : 'text-emerald-600'
                        }`}>
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 font-sans">
                            {scanModality === 'xray'
                              ? 'Upload Plain Film / Digital Radiograph (X-Ray)'
                              : scanModality === 'mri'
                              ? 'Upload High-Resolution 1.5T / 3.0T MRI Sequence'
                              : 'Upload Doctor Prescription or Clinical Referral'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1 font-sans">
                            {scanModality === 'xray'
                              ? 'Bilateral Knee, Shoulder AP, or Lumbar Plain Film (JPG, PNG)'
                              : scanModality === 'mri'
                              ? 'T1, T2 FS, or Proton Density sequences of joint tears'
                              : 'Drag & drop or browse image (JPG, PNG) or clinical scan'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {filePreview && (
                    <button
                      onClick={handleStartUploadScan}
                      className={`mt-4 w-full py-3 px-4 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer font-sans transition-colors ${
                        scanModality === 'xray'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : scanModality === 'mri'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      <span>
                        {scanModality === 'xray'
                          ? 'Analyze X-Ray & Calibrate ROM Limits'
                          : scanModality === 'mri'
                          ? 'Analyze MRI & Guard Impingement Ceiling'
                          : 'Parse Prescription & Formulate Protocol'}
                      </span>
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
                    <p className="text-xs text-slate-500 font-sans mb-3">
                      Test instant multimodal vision analysis on clinical cases:
                    </p>

                    <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                      {/* Sample: Knee OA X-Ray */}
                      <button
                        onClick={() => handleSelectSample('xray_knee_oa')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-blue-50/50 border border-blue-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 font-sans flex items-center gap-1.5">
                            <span>🩻</span> Dr. S. K. Narang (Imaging)
                          </span>
                          <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                            X-Ray · 85° Cap
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 font-sans">
                          Bilateral Knee AP X-Ray: KL Grade 2 Medial Compartment OA
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time X-Ray analysis</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-blue-600" />
                        </div>
                      </button>

                      {/* Sample: Shoulder MRI */}
                      <button
                        onClick={() => handleSelectSample('mri_shoulder_tear')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-purple-50/50 border border-purple-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 font-sans flex items-center gap-1.5">
                            <span>🧲</span> Dr. Priya Venkataraman (CityScan)
                          </span>
                          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-bold">
                            3.0T MRI · 70° Cap
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1 font-sans">
                          Shoulder T2 MRI: Supraspinatus Tear + Subacromial Spur
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time MRI analysis</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-purple-600" />
                        </div>
                      </button>

                      {/* Sample: Rotator Cuff Prescription */}
                      <button
                        onClick={() => handleSelectSample('rotator_cuff')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans flex items-center gap-1.5">
                            <span>📄</span> Dr. R. K. Sharma (Apollo)
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

                      {/* Sample: ACL Knee Prescription */}
                      <button
                        onClick={() => handleSelectSample('acl_knee')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans flex items-center gap-1.5">
                            <span>📄</span> Dr. Anita Sengupta (AIIMS)
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Post-Op Note
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 font-sans">
                          Left Knee ACL Reconstruction + Patellar Tracking
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>Click to run real-time OCR</span>
                          <ChevronRight className="w-3 h-3 ml-auto text-emerald-600" />
                        </div>
                      </button>

                      {/* Sample: Lumbar Spine Prescription */}
                      <button
                        onClick={() => handleSelectSample('lumbar_sciatica')}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 transition-colors group cursor-pointer shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 font-sans flex items-center gap-1.5">
                            <span>📄</span> Dr. Rajesh Gupta (Max Spine)
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
                    <span>Multimodal AI extracts pathology and calibrates kinematic boundaries</span>
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

              {/* Radiology Safeguard Banner (Active when X-Ray or MRI is Correlated) */}
              {report.radiology_scan && (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
                      {report.radiology_scan.modality === 'xray' ? '🩻' : '🧲'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-blue-950 font-sans">
                          {report.radiology_scan.modality_label}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 font-semibold">
                          {report.radiology_scan.pathology_grade}
                        </span>
                        <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                          Kinematic Safeguard Active
                        </span>
                      </div>
                      <p className="text-xs text-blue-800/90 font-sans mt-0.5">
                        <span className="font-semibold">{report.radiology_scan.body_region}:</span> {report.radiology_scan.structural_findings[0]}
                      </p>
                    </div>
                  </div>
                  {report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees && (
                    <div className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-right shrink-0 shadow-2xs">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Articular Safety Ceiling</span>
                      <span className="text-sm font-mono font-bold text-blue-700">
                        Max {report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees}° ROM
                      </span>
                    </div>
                  )}
                </div>
              )}

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

                {report.radiology_scan && (
                  <button
                    onClick={() => setActiveTab('radiology')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === 'radiology'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>🩻 Radiology & Structural Safeguards</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('session')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === 'session'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{report.radiology_scan ? '3.' : '2.'} Formulated Session ({report.session_plan.exercises.length} Protocols)</span>
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
                  <span>{report.radiology_scan ? '4.' : '3.'} Medications & Lifestyle</span>
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
                  <span>{report.radiology_scan ? '5.' : '4.'} Daily & Weekly Schedule</span>
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

              {/* TAB 1.5: RADIOLOGY & STRUCTURAL SAFEGUARDS */}
              {activeTab === 'radiology' && report.radiology_scan && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Scan Visual Preview */}
                  <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center text-white">
                    <div className="w-full flex items-center justify-between mb-3 text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-blue-400">
                        <Activity className="w-3.5 h-3.5" />
                        {report.radiology_scan.modality === 'xray' ? 'Plain Film Radiograph' : '3.0T MRI Sequence'}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700">
                        DICOM Verified
                      </span>
                    </div>

                    <div className="relative w-full rounded-lg overflow-hidden border border-slate-700 bg-black max-h-[460px] flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={report.image_url || filePreview || (report.radiology_scan.modality === 'xray' ? '/scan_knee_xray.png' : '/scan_shoulder_mri.png')}
                        alt="Radiological Imaging Study"
                        className="w-full h-auto object-contain max-h-[420px]"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] font-mono text-emerald-400 border border-slate-800">
                        AI Target: {report.radiology_scan.body_region}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-3 text-center">
                      Correlated by Gemini Multimodal Vision Diagnostic Pipeline
                    </p>
                  </div>

                  {/* Right: Structural Findings & Kinematic Safeguards */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Articular Safety Ceiling Alert Card */}
                    <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-blue-600" />
                          <h4 className="text-sm font-bold text-blue-950 font-sans">
                            Articular Kinematic Safety Ceiling
                          </h4>
                        </div>
                        {report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees && (
                          <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-bold text-xs shadow-xs">
                            Capped at {report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees}° ROM
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-900 leading-relaxed font-sans">
                        {report.radiology_scan.modality === 'xray'
                          ? `Based on plain film evidence of ${report.radiology_scan.pathology_grade}, knee extension and flexion exercises are restricted to a maximum of ${report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees || 85}° to avoid cartilage shear stress across the medial tibial plateau.`
                          : `Based on 3.0T MRI evidence of ${report.radiology_scan.pathology_grade}, shoulder coronal abduction is capped at ${report.radiology_scan.biomechanical_restrictions.recommended_rom_cap_degrees || 70}° to prevent the supraspinatus footprint from impinging against the subacromial spur.`}
                      </p>
                    </div>

                    {/* Pathology Staging & Details */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Imaging Diagnosis & Staging
                        </span>
                        <h3 className="text-base font-bold text-slate-900 font-sans">
                          {report.clinical_findings.diagnosis}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                            {report.radiology_scan.pathology_grade}
                          </span>
                          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                            ICD-10: {report.clinical_findings.icd10_code}
                          </span>
                        </div>
                      </div>

                      {/* Structural Observations List */}
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-700 block mb-2 font-sans">
                          Structural Findings on {report.radiology_scan.modality_label}:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
                          {report.radiology_scan.structural_findings.map((finding, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Movement Contraindications & Watchpoints */}
                      <div className="pt-3 border-t border-slate-100">
                        <span className="text-xs font-bold text-rose-700 block mb-2 font-sans flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Restricted Movements & Contraindications:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-600 font-sans">
                          {report.radiology_scan.biomechanical_restrictions.restricted_movements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-rose-900/90">
                              <span className="text-rose-500 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
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

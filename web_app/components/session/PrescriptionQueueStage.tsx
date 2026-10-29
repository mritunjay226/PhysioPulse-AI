'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  AlertTriangle,
  Play,
  Video,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Pill,
  Clock
} from 'lucide-react';
import { PrescriptionOutput } from '@/lib/clinical-engine';
import { DecipheredDoctorReport } from '@/lib/doctor-report-ocr';
import { AnatomicalBodyMap } from '@/components/AnatomicalBodyMap';
import { EmbeddedVisionStudio } from '@/components/EmbeddedVisionStudio';

export interface PrescriptionQueueStageProps {
  prescription: PrescriptionOutput;
  patientName: string;
  onEditIntake: () => void;
  isRunningSession: boolean;
  onLaunchVisionSession: () => void;
  onConcludeSession: () => void;
  doctorReport?: DecipheredDoctorReport | null;
  onViewDoctorReport?: () => void;
}

export function PrescriptionQueueStage({
  prescription,
  patientName,
  onEditIntake,
  isRunningSession,
  onLaunchVisionSession,
  onConcludeSession,
  doctorReport,
  onViewDoctorReport
}: PrescriptionQueueStageProps) {
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);

  // Auto-open modal when session starts
  useEffect(() => {
    if (isRunningSession) {
      setIsVisionModalOpen(true);
    }
  }, [isRunningSession]);

  const handleStartSession = () => {
    setIsVisionModalOpen(true);
    onLaunchVisionSession();
  };

  const handleConcludeModalSession = () => {
    setIsVisionModalOpen(false);
    onConcludeSession();
  };

  return (
    <div className="space-y-6">
      {/* Session Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs uppercase text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Prescription Verified & Formulated
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Queue: {prescription.exercises.length} Sequential Protocols
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Kinetic Protocol Queue for{' '}
              <span className="text-emerald-700">{prescription.patient_name}</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed font-sans max-w-4xl">
              {prescription.clinical_diagnosis_summary}
            </p>
          </div>

          <button
            onClick={onEditIntake}
            className="self-start sm:self-center px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer font-sans shadow-xs"
          >
            Edit Intake
          </button>
        </div>

        {/* Precautions Alert */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed font-sans">
            <span className="font-bold">Clinical Precaution Notice: </span>
            {prescription.precautions}
          </div>
        </div>

        {/* Doctor Prescribed Care Plan & Schedule Accordion */}
        {doctorReport && (
          <div className="mt-5 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
            <button
              onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-sans">
                      Prescribed Care Plan ({doctorReport.doctor_details.doctor_name})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doctorReport.treatment_plan.medications.length} Medications · 4 Daily Slots
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-sans">
                    Hospital: {doctorReport.doctor_details.hospital_or_clinic} · Review in {doctorReport.schedule.follow_up.review_after_days} days
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {onViewDoctorReport && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDoctorReport();
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 underline font-medium"
                  >
                    View Original Prescription (OCR)
                  </span>
                )}
                {isScheduleExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {isScheduleExpanded && (
              <div className="p-5 border-t border-slate-200 bg-white space-y-5">
                {/* Medications preview */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Prescribed Medications
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {doctorReport.treatment_plan.medications.map((m, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] font-mono text-emerald-700">{m.frequency} · {m.timing}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2">{m.purpose}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Schedule preview */}
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Daily Schedule Timetable
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {doctorReport.schedule.daily_schedule.map((s, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          s.is_physiopulse_session
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold text-emerald-800">{s.time_slot}</div>
                        <div className="font-bold text-xs">{s.title}</div>
                        <div className="text-[11px] text-slate-500">{s.therapy_focus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Prescribed Exercises Queue with Anatomical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Prescribed Exercise Routine ({prescription.exercises.length} Protocols)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Sequential Execution</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescription.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-emerald-300 transition-colors flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Step #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      Protocol {ex.protocol_id}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1 font-sans group-hover:text-emerald-800 transition-colors">
                    {ex.protocol_name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 font-sans">
                    {ex.clinical_rationale}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-mono text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Target Reps</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {ex.target_reps} reps
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Target ROM</span>
                    <span className="text-sm font-bold text-emerald-700">
                      {ex.target_rom_degrees}°
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anatomical Body Map Sync */}
        <div className="lg:col-span-4">
          <AnatomicalBodyMap
            activeProtocols={prescription.exercises.map((e) => e.protocol_id)}
          />
        </div>
      </div>

      {/* Start CV Engine Banner Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Interactive Motion Capture
            </span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 font-sans tracking-tight">
            Launch On-Device Webcam Motion Tracking
          </h4>
          <p className="text-xs text-slate-600 font-sans mt-1 max-w-xl leading-relaxed">
            Tracks 33 3D skeletal landmarks through your webcam with real-time goniometric feedback,
            repetition counting, and audible anti-compensation cues.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isRunningSession && !isVisionModalOpen && (
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 border border-slate-300 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-600" />
              <span>Reopen Camera Window</span>
            </button>
          )}

          <button
            onClick={handleStartSession}
            disabled={isRunningSession && isVisionModalOpen}
            className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 font-sans"
          >
            {isRunningSession ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Camera Session Active</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Clinical Motion Session</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Active Session Banner (if user minimized modal while running) */}
      {isRunningSession && !isVisionModalOpen && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-slate-200 rounded-xl p-4 shadow-xl flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              Session In Progress
            </div>
            <div className="text-[11px] text-slate-500">
              Camera tracking active for {patientName || 'Patient'}
            </div>
          </div>
          <button
            onClick={() => setIsVisionModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            View Camera
          </button>
        </div>
      )}

      {/* Focused Camera Modal Dialog */}
      {isVisionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="relative w-full max-w-7xl max-h-[96vh] flex flex-col my-auto">
            <EmbeddedVisionStudio
              isRunning={isRunningSession}
              onConcludeSession={handleConcludeModalSession}
              patientName={patientName}
              isModal={true}
              onCloseModal={() => setIsVisionModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

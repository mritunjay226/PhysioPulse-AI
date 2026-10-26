'use client';

import React from 'react';
import { Layers, AlertTriangle, Play } from 'lucide-react';
import { PrescriptionOutput } from '@/lib/clinical-engine';
import { AnatomicalBodyMap } from '@/components/AnatomicalBodyMap';
import { EmbeddedVisionStudio } from '@/components/EmbeddedVisionStudio';

export interface PrescriptionQueueStageProps {
  prescription: PrescriptionOutput;
  patientName: string;
  onEditIntake: () => void;
  isRunningSession: boolean;
  onLaunchVisionSession: () => void;
  onConcludeSession: () => void;
}

export function PrescriptionQueueStage({
  prescription,
  patientName,
  onEditIntake,
  isRunningSession,
  onLaunchVisionSession,
  onConcludeSession
}: PrescriptionQueueStageProps) {
  return (
    <div className="space-y-6">
      {/* Session Header Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-bold">
                Prescription Confirmed
              </span>
              <span className="text-xs text-slate-600 font-mono">
                Queue: {prescription.exercises.length} Sequential Protocols
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
              Kinetic Chain Prescription for {prescription.patient_name}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed font-sans">
              {prescription.clinical_diagnosis_summary}
            </p>
          </div>

          <button
            onClick={onEditIntake}
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer font-sans shadow-sm"
          >
            Edit Intake
          </button>
        </div>

        {/* Precautions Alert */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed font-sans">
            <span className="font-bold text-amber-900 font-mono">Clinical Safeguard Notice: </span>
            {prescription.precautions}
          </div>
        </div>
      </div>

      {/* Prescribed Exercises Queue with Anatomical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Prescribed Sequential Protocol Queue ({prescription.exercises.length} Protocols)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Auto-advancing Queue</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescription.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all flex flex-col justify-between shadow-sm theme-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      QUEUE #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      PROTOCOL {ex.protocol_id}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1 font-sans">
                    {ex.protocol_name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-sans">
                    {ex.clinical_rationale}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 font-mono text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Target Reps</span>
                    <span className="text-sm font-bold text-blue-600">
                      {ex.target_reps} reps
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="block text-[10px] text-slate-400 uppercase font-semibold">Target ROM</span>
                    <span className="text-sm font-bold text-blue-600">
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

      {/* Start CV Engine Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm theme-card">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-sans">
            On-Device Markerless Motion Capture Engine
          </h4>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Spawns 33-landmark kinematic tracking on local camera with real-time goniometric biofeedback.
          </p>
        </div>
        <button
          onClick={onLaunchVisionSession}
          disabled={isRunningSession}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 font-sans"
        >
          {isRunningSession ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Camera Engine Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Clinical Vision Session</span>
            </>
          )}
        </button>
      </div>

      {/* Embedded Vision Studio (Markerless MoCap Engine) */}
      <div className="pt-2">
        <EmbeddedVisionStudio
          isRunning={isRunningSession}
          onConcludeSession={onConcludeSession}
          patientName={patientName}
        />
      </div>
    </div>
  );
}

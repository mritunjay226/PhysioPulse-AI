import os

web_app_dir = os.path.abspath('web_app')

# 1. IntakeFormStage.tsx
intake_content = '''\'use client\';

import React from \'react\';
import { User, Flame, Sparkles, ArrowRight, Layers, Zap } from \'lucide-react\';
import { AnatomicalBodyMap } from \'@/components/AnatomicalBodyMap\';

export interface IntakePreset {
  title: string;
  area: string;
  pain: number;
  protocols: number[];
  desc: string;
}

export interface IntakeFormStageProps {
  patientName: string;
  setPatientName: (val: string) => void;
  age: number;
  setAge: (val: number) => void;
  affectedArea: string;
  setAffectedArea: (val: string) => void;
  painLevel: number;
  setPainLevel: (val: number) => void;
  symptoms: string;
  setSymptoms: (val: string) => void;
  activeProtocols: number[];
  onSelectProtocol: (protocolId: number) => void;
  onGeneratePrescription: () => void;
  isGenerating: boolean;
  presets: IntakePreset[];
  onApplyPreset: (preset: IntakePreset) => void;
  circuitMode?: \'targeted\' | \'standard\' | \'comprehensive\';
  setCircuitMode?: (mode: \'targeted\' | \'standard\' | \'comprehensive\') => void;
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
  circuitMode = \'standard\',
  setCircuitMode
}: IntakeFormStageProps) {
  const getPainColor = (level: number) => {
    if (level <= 3) return \'text-emerald-400 bg-emerald-950/60 border-emerald-800/60\';
    if (level <= 6) return \'text-amber-400 bg-amber-950/60 border-amber-800/60\';
    return \'text-rose-400 bg-rose-950/60 border-rose-800/60\';
  };

  const getPainLabel = (level: number) => {
    if (level <= 3) return \'Mild Articular Discomfort\';
    if (level <= 6) return \'Moderate Mechanical Impingement\';
    return \'Acute Guarded Pathomechanical Pain\';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Patient Intake Form */}
      <div className="lg:col-span-7 bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/70">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight font-mono">
                Patient Clinical Intake
              </h2>
              <p className="text-xs text-zinc-400 font-sans">
                AI Triage Agent maps patient symptoms to 8 clinical kinematic protocols
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
            STAGE 1 OF 3
          </span>
        </div>

        <div className="space-y-5">
          {/* Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-sans"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Affected Body Area */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Primary Affected Kinetic Chain / Joint
            </label>
            <select
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-sans"
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

          {/* Pain Level Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Visual Pain Rating Scale (VAS: 1 - 10)
              </label>
              <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${getPainColor(painLevel)}`}>
                Level {painLevel}/10 — {getPainLabel(painLevel)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-1">
              <span>1 (Mild)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe Articular Guard)</span>
            </div>
          </div>

          {/* Kinetic Circuit Depth Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                Rehabilitation Circuit Depth
              </label>
              <span className="text-[11px] font-mono text-zinc-500">
                Multi-Joint Kinetic Synergy
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: \'targeted\', label: \'Targeted\', reps: \'2-3 Exercises\', desc: \'Acute/Focal\' },
                { id: \'standard\', label: \'Standard\', reps: \'3-4 Exercises\', desc: \'Recommended\', badge: true },
                { id: \'comprehensive\', label: \'Comprehensive\', reps: \'4-5 Exercises\', desc: \'Full Chain\' }
              ].map((mode) => {
                const isActive = (circuitMode || \'standard\') === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCircuitMode && setCircuitMode(mode.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? \'bg-teal-500/10 border-teal-500/60 shadow-sm shadow-teal-500/10\'
                        : \'bg-[#09090b] border-zinc-800 hover:border-zinc-700 text-zinc-400\'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-bold font-mono ${isActive ? \'text-teal-300\' : \'text-zinc-200\'}`}>
                        {mode.label}
                      </span>
                      {mode.badge && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-400 border border-teal-500/40 font-semibold">
                          Optimal
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">{mode.reps}</div>
                    <div className="text-[10px] text-zinc-500 font-sans">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symptoms Textarea */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Patient Condition & Subjective History (Natural Language)
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full bg-[#09090b] border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-sans leading-relaxed"
              placeholder="Describe surgical history, symptoms, or movement triggers..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={onGeneratePrescription}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span className="font-mono">AI Clinical Agent Synthesizing Kinetic Routine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="font-mono">Synthesize Clinical AI Prescription Queue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Hackathon Demo Presets */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase text-teal-400 tracking-wider">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Instant Demo Clinical Scenarios (Kinetic Circuits)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset(p)}
                className="text-left p-3.5 rounded-xl bg-[#09090b] hover:bg-zinc-900/90 border border-zinc-800/90 hover:border-teal-500/40 transition-all text-xs group cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-200 group-hover:text-teal-300 transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-700/80 text-zinc-400 font-semibold">
                    VAS {p.pain}/10
                  </span>
                </div>
                <p className="text-zinc-500 line-clamp-1 text-[11px] font-sans">{p.desc}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-teal-400/80">
                    {p.protocols.length} Kinetic Protocols:
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    P{p.protocols.join(\', P\')}
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
'''

# 2. PrescriptionQueueStage.tsx
queue_content = '''\'use client\';

import React from \'react\';
import { Layers, AlertTriangle, Play } from \'lucide-react\';
import { PrescriptionOutput } from \'@/lib/clinical-engine\';
import { AnatomicalBodyMap } from \'@/components/AnatomicalBodyMap\';
import { EmbeddedVisionStudio } from \'@/components/EmbeddedVisionStudio\';

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
      <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/70">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono uppercase text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30 font-bold">
                Prescription Confirmed
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Queue: {prescription.exercises.length} Sequential Protocols
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight font-mono">
              Kinetic Chain Prescription for {prescription.patient_name}
            </h2>
            <p className="text-sm text-zinc-400 mt-1 leading-relaxed font-sans">
              {prescription.clinical_diagnosis_summary}
            </p>
          </div>

          <button
            onClick={onEditIntake}
            className="self-start sm:self-center px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer font-mono shadow-sm"
          >
            Edit Intake
          </button>
        </div>

        {/* Precautions Alert */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/20 border border-amber-800/50 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed font-sans">
            <span className="font-bold text-amber-300 font-mono">Clinical Safeguard Notice: </span>
            {prescription.precautions}
          </div>
        </div>
      </div>

      {/* Prescribed Exercises Queue with Anatomical Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Prescribed Sequential Protocol Queue ({prescription.exercises.length} Protocols)</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Auto-advancing Queue</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prescription.exercises.map((ex, idx) => (
              <div
                key={idx}
                className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      QUEUE #{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-zinc-500 font-semibold">
                      PROTOCOL {ex.protocol_id}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-100 mb-1 font-mono">
                    {ex.protocol_name}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4 font-sans">
                    {ex.clinical_rationale}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80 font-mono text-xs">
                  <div className="bg-[#09090b] p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Target Reps</span>
                    <span className="text-sm font-bold text-teal-400">
                      {ex.target_reps} reps
                    </span>
                  </div>
                  <div className="bg-[#09090b] p-2.5 rounded-xl border border-zinc-800/80">
                    <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Target ROM</span>
                    <span className="text-sm font-bold text-teal-400">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-zinc-800/80 shadow-xl">
        <div>
          <h4 className="text-sm font-bold text-zinc-100 font-mono">
            On-Device Markerless Motion Capture Engine
          </h4>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Spawns 33-landmark kinematic tracking on local camera with real-time goniometric biofeedback.
          </p>
        </div>
        <button
          onClick={onLaunchVisionSession}
          disabled={isRunningSession}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50 font-mono"
        >
          {isRunningSession ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
'''

# 3. AnatomicalBodyMap.tsx
map_content = '''\'use client\';

import React, { useState } from \'react\';
import Image from \'next/image\';
import { Activity, Check } from \'lucide-react\';

export interface AnatomicalBodyMapProps {
  activeProtocols: number[];
  onSelectProtocol?: (protocolId: number) => void;
}

interface AnatomicalPin {
  id: string;
  name: string;
  protocolId: number;
  protocolName: string;
  xPct: number;
  yPct: number;
  description: string;
}

const BODY_PINS: AnatomicalPin[] = [
  {
    id: \'cervical\',
    name: \'Cervical Spine\',
    protocolId: 3,
    protocolName: \'Protocol 3: Cervical Posture Guard\',
    xPct: 50,
    yPct: 15,
    description: \'Craniovertebral angle & neck posture drift\'
  },
  {
    id: \'left_shoulder\',
    name: \'Left Shoulder\',
    protocolId: 1,
    protocolName: \'Protocol 1: Frozen Shoulder Abduction\',
    xPct: 34,
    yPct: 24,
    description: \'Glenohumeral lateral abduction (0-180°)\'
  },
  {
    id: \'right_shoulder\',
    name: \'Right Shoulder Girdle\',
    protocolId: 5,
    protocolName: \'Protocol 5: Bilateral Overhead Wall-Slide\',
    xPct: 66,
    yPct: 24,
    description: \'Bilateral overhead scapulohumeral sync\'
  },
  {
    id: \'left_elbow\',
    name: \'Left Elbow\',
    protocolId: 4,
    protocolName: \'Protocol 4: Elbow Flexion Rehab\',
    xPct: 26,
    yPct: 37,
    description: \'Humeroulnar hinge flexion (0-150°)\'
  },
  {
    id: \'left_wrist\',
    name: \'Left Wrist / Carpal\',
    protocolId: 8,
    protocolName: \'Protocol 8: Carpal Tunnel Extension\',
    xPct: 20,
    yPct: 49,
    description: \'Radiocarpal dorsal flexion & median nerve\'
  },
  {
    id: \'lumbar\',
    name: \'Lumbar Spine\',
    protocolId: 7,
    protocolName: \'Protocol 7: Lumbar Spine Rehab\',
    xPct: 50,
    yPct: 43,
    description: \'Lumbar hinge motion & core pelvic bracing\'
  },
  {
    id: \'left_hip\',
    name: \'Left Hip Complex\',
    protocolId: 6,
    protocolName: \'Protocol 6: Hip Lateral Abduction\',
    xPct: 43,
    yPct: 54,
    description: \'Coxofemoral coronal abduction & pelvic level\'
  },
  {
    id: \'left_knee\',
    name: \'Left Knee Patella\',
    protocolId: 2,
    protocolName: \'Protocol 2: Post-ACL Knee Squat\',
    xPct: 43,
    yPct: 73,
    description: \'Tibiofemoral hinge & valgus prevention\'
  }
];

export function AnatomicalBodyMap({
  activeProtocols,
  onSelectProtocol
}: AnatomicalBodyMapProps) {
  const [hoveredPin, setHoveredPin] = useState<AnatomicalPin | null>(null);

  const isProtocolActive = (protocolId: number) => activeProtocols.includes(protocolId);

  return (
    <div className="bg-[#121215] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/70 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-sm font-mono tracking-tight">
                Anatomical Kinetic Map
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans">
                Markerless 3D musculoskeletal topology
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
            {activeProtocols.length} Targeted Joint{activeProtocols.length === 1 ? \'\' : \'s\'}
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-4 font-sans leading-relaxed">
          Interactive kinetic topology. Click joint pins to toggle clinical rehabilitation protocols:
        </p>

        {/* 3D Muscular Model Canvas Container */}
        <div className="relative flex items-center justify-center py-6 bg-[#09090b] rounded-xl border border-zinc-800/80 overflow-hidden min-h-[460px]">
          {/* Subtle background radial grid */}
          <div className="absolute inset-0 bg-clinical-grid opacity-20 pointer-events-none" />

          {/* Concentric telemetry rings */}
          <div className="absolute w-[260px] h-[260px] rounded-full border border-zinc-800/60 pointer-events-none" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-zinc-800/40 pointer-events-none" />

          {/* 3D Muscular Model Image */}
          <div className="relative w-[240px] h-[420px] flex items-center justify-center select-none">
            <Image
              src="/anatomical_model_2x.png"
              alt="3D Anatomical Musculoskeletal Model"
              width={260}
              height={440}
              priority
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
            />

            {/* Interactive Protocol Pins Over the 3D Body */}
            {BODY_PINS.map((pin) => {
              const active = isProtocolActive(pin.protocolId);
              return (
                <button
                  key={pin.id}
                  onClick={() => onSelectProtocol && onSelectProtocol(pin.protocolId)}
                  onMouseEnter={() => setHoveredPin(pin)}
                  onMouseLeave={() => setHoveredPin(null)}
                  style={{
                    left: `${pin.xPct}%`,
                    top: `${pin.yPct}%`,
                    transform: \'translate(-50%, -50%)\'
                  }}
                  className={`absolute z-20 group cursor-pointer transition-all ${
                    active ? \'scale-125\' : \'hover:scale-115\'
                  }`}
                  title={`${pin.name} (${pin.protocolName})`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-md ${
                        active
                          ? \'bg-teal-400 text-black ring-4 ring-teal-500/30 shadow-lg shadow-teal-500/30 font-extrabold\'
                          : \'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:border-teal-400 hover:text-teal-300\'
                      }`}
                    >
                      {active ? \'✓\' : \'+\'}
                    </span>
                    {active && (
                      <span className="absolute -inset-1 rounded-full bg-teal-400/25 animate-ping pointer-events-none" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredPin && (
            <div className="absolute bottom-3 left-4 right-4 z-30 p-3 rounded-xl bg-[#121215]/95 backdrop-blur-md border border-zinc-700 shadow-xl text-xs pointer-events-none transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-zinc-100 font-mono">{hoveredPin.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-bold border border-teal-500/30">
                  Protocol {hoveredPin.protocolId}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug font-sans">{hoveredPin.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Protocols List Footer */}
      <div className="mt-4 pt-3.5 border-t border-zinc-800/70">
        <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider block mb-2">
          Active Protocol Kinetic Coverage
        </span>
        <div className="flex flex-wrap gap-1.5">
          {BODY_PINS.filter((p) => isProtocolActive(p.protocolId)).map((pin) => (
            <span
              key={pin.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-semibold font-mono"
            >
              <Check className="w-3 h-3 text-teal-400 stroke-[3]" />
              <span>{pin.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
'''

# 4. Write files
files_to_write = {
    os.path.join(web_app_dir, 'components', 'session', 'IntakeFormStage.tsx'): intake_content,
    os.path.join(web_app_dir, 'components', 'session', 'PrescriptionQueueStage.tsx'): queue_content,
    os.path.join(web_app_dir, 'components', 'AnatomicalBodyMap.tsx'): map_content,
}

for path, content in files_to_write.items():
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\\n')
    print(f"Successfully wrote {path} (size: {len(content)})")

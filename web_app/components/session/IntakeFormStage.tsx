'use client';

import React from 'react';
import { User, Flame, Sparkles, ArrowRight, Layers, Zap } from 'lucide-react';
import { AnatomicalBodyMap } from '@/components/AnatomicalBodyMap';

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
  circuitMode?: 'targeted' | 'standard' | 'comprehensive';
  setCircuitMode?: (mode: 'targeted' | 'standard' | 'comprehensive') => void;
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
  circuitMode = 'standard',
  setCircuitMode
}: IntakeFormStageProps) {
  const getPainColor = (level: number) => {
    if (level <= 3) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (level <= 6) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getPainLabel = (level: number) => {
    if (level <= 3) return 'Mild Articular Discomfort';
    if (level <= 6) return 'Moderate Mechanical Impingement';
    return 'Acute Guarded Pathomechanical Pain';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Patient Intake Form */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm theme-card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <User className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                Patient Clinical Intake
              </h2>
              <p className="text-xs text-slate-600 font-sans">
                AI Triage Agent maps patient symptoms to 8 clinical kinematic protocols
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            STAGE 1 OF 3
          </span>
        </div>

        <div className="space-y-5">
          {/* Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                Patient Full Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                placeholder="e.g. Sarah Jenkins"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Affected Body Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
              Primary Affected Kinetic Chain / Joint
            </label>
            <select
              value={affectedArea}
              onChange={(e) => setAffectedArea(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
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
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 font-mono uppercase tracking-wider">
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
              <span>1 (Mild)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe Articular Guard)</span>
            </div>
          </div>

          {/* Kinetic Circuit Depth Mode */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Rehabilitation Circuit Depth
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Multi-Joint Kinetic Synergy
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'targeted', label: 'Targeted', reps: '2-3 Exercises', desc: 'Acute/Focal' },
                { id: 'standard', label: 'Standard', reps: '3-4 Exercises', desc: 'Recommended', badge: true },
                { id: 'comprehensive', label: 'Comprehensive', reps: '4-5 Exercises', desc: 'Full Chain' }
              ].map((mode) => {
                const isActive = (circuitMode || 'standard') === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCircuitMode && setCircuitMode(mode.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 border-blue-500/60 shadow-xs'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-bold font-sans ${isActive ? 'text-blue-700' : 'text-slate-800'}`}>
                        {mode.label}
                      </span>
                      {mode.badge && (
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 border border-blue-200 font-semibold">
                          Optimal
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-600">{mode.reps}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{mode.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symptoms Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-mono">
              Patient Condition & Subjective History (Natural Language)
            </label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-sans leading-relaxed"
              placeholder="Describe surgical history, symptoms, or movement triggers..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={onGeneratePrescription}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-mono">AI Clinical Agent Synthesizing Kinetic Routine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="font-sans">Synthesize Clinical AI Prescription Queue</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>

        {/* Hackathon Demo Presets */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase text-blue-600 tracking-wider">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Instant Demo Clinical Scenarios (Kinetic Circuits)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onApplyPreset(p)}
                className="text-left p-3.5 rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-blue-300 transition-all text-xs group cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
                    VAS {p.pain}/10
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-1 text-[11px] font-sans">{p.desc}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-blue-600/80 font-medium">
                    {p.protocols.length} Kinetic Protocols:
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">
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

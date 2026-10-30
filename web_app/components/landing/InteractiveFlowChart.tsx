'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  FileScan,
  Camera,
  Activity,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Volume2,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface FlowStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  metricLabel: string;
  metricValue: string;
  details: string[];
  previewType: 'intake' | 'vision' | 'goniometry' | 'report';
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'intake',
    stepNumber: '01',
    title: 'Intake & OCR Extraction',
    subtitle: 'Prescription & Clinical Orders',
    badge: 'Automated Ingestion',
    icon: FileScan,
    description:
      'Upload physical therapy scripts, operative records, or select an orthopedic preset. Our OCR engine parses clinical safeguards and configures targeted ROM boundaries.',
    metricLabel: 'Extraction Accuracy',
    metricValue: '99.2%',
    details: [
      'Parses handwritten physician directives & surgical timelines',
      'Maps diagnoses to ICD-10 codes (M75.1 Rotator Cuff, S83.5 ACL)',
      'Establishes patient-safe ROM thresholds & target reps'
    ],
    previewType: 'intake'
  },
  {
    id: 'vision',
    stepNumber: '02',
    title: 'Markerless 33-Point Vision',
    subtitle: 'WebAssembly Browser Inference',
    badge: 'Zero Cloud Video',
    icon: Camera,
    description:
      'Standard webcams stream directly into client memory. 33 3D skeletal landmarks are calculated in real-time at 30 FPS without wearable sensors or hardware straps.',
    metricLabel: 'Frame Rate',
    metricValue: '30 FPS',
    details: [
      'Zero video transmitted to external servers (100% HIPAA safe)',
      'Sub-millimeter joint coordinate tracking across frontal & sagittal planes',
      'Self-calibrating camera perspective with automatic distance checks'
    ],
    previewType: 'vision'
  },
  {
    id: 'goniometry',
    stepNumber: '03',
    title: 'Biomechanical Goniometry',
    subtitle: 'Real-Time Audio Anti-Compensation',
    badge: '< 1.4° Vicon Parity',
    icon: Activity,
    description:
      'As patients perform exercises, the engine calculates instantaneous vector angles. If compensatory form occurs, real-time auditory prompts coach proper kinematics.',
    metricLabel: 'Goniometric Precision',
    metricValue: '< 1.4°',
    details: [
      'Instant vector goniometry between anatomical landmarks',
      'Detects shoulder hiking, torso leaning, and knee valgus collapse',
      'Sub-second synthetic audio coaching cues keep patients safe'
    ],
    previewType: 'goniometry'
  },
  {
    id: 'report',
    stepNumber: '04',
    title: 'SOAP Report & CPT Ledger',
    subtitle: 'Automated Billing & Documentation',
    badge: 'CPT 98975 / 98977',
    icon: FileCheck,
    description:
      'Upon session completion, an audit-ready clinical summary is compiled with bilateral symmetry metrics, ROM recovery deltas, and timestamped Medicare RTM codes.',
    metricLabel: 'Billing Compliance',
    metricValue: '100%',
    details: [
      'Auto-generates clinical SOAP progress notes for EHR systems',
      'Logs 16-day transmission thresholds for CPT 98977 reimbursement',
      'Exports objective ROM comparison charts and printable PDF summaries'
    ],
    previewType: 'report'
  }
];

export function InteractiveFlowChart() {
  const [activeStepId, setActiveStepId] = useState<string>('intake');
  const activeStep = FLOW_STEPS.find((s) => s.id === activeStepId) || FLOW_STEPS[0];
  const pulseLineRef = useRef<HTMLDivElement>(null);

  // GSAP continuous transmission pulse line across stages
  useEffect(() => {
    if (!pulseLineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-flow-beam',
        { left: '-10%', opacity: 0 },
        {
          left: '110%',
          opacity: 1,
          duration: 3,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 1
        }
      );
    }, pulseLineRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="flow-chart" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200 relative overflow-hidden">
      {/* Background Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Stagger Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14 lg:mb-18"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase tracking-wider font-mono text-[11px]">End-to-End Clinical Architecture</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight">
            How PhysioPulse Works
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            A frictionless, closed-loop clinical pathway from physician prescription intake to objective post-session documentation. Click any stage to inspect the pipeline.
          </p>
        </motion.div>

        {/* Animated Connecting Beam (GSAP) */}
        <div ref={pulseLineRef} className="relative hidden lg:block w-full h-1 bg-slate-200/80 rounded-full mb-3 overflow-hidden">
          <div className="gsap-flow-beam absolute top-0 w-28 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

        {/* The Visual Flowchart Stepper Strip with Framer Motion Layout & Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {FLOW_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === activeStepId;
            return (
              <motion.button
                key={step.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveStepId(step.id)}
                className={`group relative text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Active Indicator Top Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeFlowBar"
                    className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80'
                    }`}
                  >
                    STAGE {step.stepNumber}
                  </span>
                  
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base font-sans tracking-tight leading-snug">
                  {step.title}
                </h3>
                
                <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-sans">
                  {step.subtitle}
                </p>

                {/* Micro Pill for quick spec */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                    {step.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-600 flex items-center gap-0.5 font-medium">
                    Inspect <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Interactive Inspector Canvas */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            
            {/* Left 7 Columns: Step Deep Dive with AnimatePresence */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Header Tag */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200/60">
                      STAGE {activeStep.stepNumber} ARCHITECTURE
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      {activeStep.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium ml-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Verified Clinical Stage
                    </span>
                  </div>

                  {/* Bold Stage Title */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                    {activeStep.title}
                  </h3>

                  <p className="mt-3 text-slate-600 text-base leading-relaxed font-sans">
                    {activeStep.description}
                  </p>

                  {/* Bullet Proof Points */}
                  <div className="mt-6 space-y-3">
                    {activeStep.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        className="flex items-start gap-3 text-sm text-slate-700 font-sans"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="block text-[11px] font-mono uppercase text-slate-400 font-semibold">
                      {activeStep.metricLabel}
                    </span>
                    <span className="text-2xl font-mono font-extrabold text-slate-900">
                      {activeStep.metricValue}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="block text-[11px] font-mono uppercase text-slate-400 font-semibold">
                      HIPAA Architecture
                    </span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Client-Only
                    </span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/session"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer group"
                  >
                    <span>Launch In Studio</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Micro-Preview with Silky Crossfades */}
            <div className="lg:col-span-5 bg-slate-50/70 p-6 sm:p-8 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.previewType}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Preview 1: Intake & OCR */}
                  {activeStep.previewType === 'intake' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                            Rx
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">Dr. Robert Chen, MD</div>
                            <div className="text-[11px] text-slate-500">Orthopedic Surgery · Mount Sinai</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                          PARSED
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <span className="text-slate-400 font-mono text-[10px] block">DIAGNOSIS</span>
                          <span className="font-semibold text-slate-800">Rotator Cuff Repair (Supraspinatus)</span>
                          <span className="text-slate-500 block text-[11px] mt-0.5 font-mono">ICD-10: M75.122 · Week 4 Post-Op</span>
                        </div>

                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <span className="text-slate-400 font-mono text-[10px] block">PRESCRIBED BOUNDARIES</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="font-medium text-slate-700">Target Glenohumeral Flexion</span>
                            <span className="font-mono font-bold text-emerald-700">140° Max</span>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                            <span>Upper Trapezius Limit</span>
                            <span className="font-mono">&lt; 5° Hiking</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Converts doctor instructions into automated camera cues</span>
                      </div>
                    </div>
                  )}

                  {/* Preview 2: Markerless Vision */}
                  {activeStep.previewType === 'vision' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900 font-mono">LANDMARK TELEMETRY</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono">
                          WASM 30 FPS
                        </span>
                      </div>

                      {/* Simulated Visual Landmark Radar */}
                      <div className="bg-slate-900 rounded-xl p-4 text-emerald-400 font-mono text-xs relative overflow-hidden">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-2">
                          <span>CLIENT BUFFER</span>
                          <span className="text-emerald-400">33 / 33 POINTS ACTIVE</span>
                        </div>
                        <div className="space-y-1.5 font-mono text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">L_SHOULDER [11]:</span>
                            <span>x: 0.482, y: 0.312, z: -0.14</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">L_ELBOW [13]:</span>
                            <span>x: 0.514, y: 0.490, z: -0.22</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">L_WRIST [15]:</span>
                            <span>x: 0.540, y: 0.680, z: -0.19</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center justify-between">
                          <span>INFERENCE LATENCY</span>
                          <span className="font-bold">14.2 ms / frame</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Video frames never leave local machine memory</span>
                      </div>
                    </div>
                  )}

                  {/* Preview 3: Goniometry & Audio */}
                  {activeStep.previewType === 'goniometry' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-900">REAL-TIME GONIOMETER</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          FEEDBACK ACTIVE
                        </span>
                      </div>

                      {/* Goniometer Gauge */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                        <span className="text-3xl sm:text-4xl font-mono font-extrabold text-slate-900">
                          128°
                        </span>
                        <span className="text-xs text-slate-500 font-mono block mt-0.5">
                          Target Range: 140° Flexion
                        </span>
                        
                        <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                          <motion.div
                            className="bg-emerald-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '91%' }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                          <span>Baseline: 45°</span>
                          <span className="text-emerald-700 font-bold">91% Completed</span>
                          <span>Target: 140°</span>
                        </div>
                      </div>

                      {/* Audio Anti-Compensation Cue */}
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                            Live Auditory Prompt
                          </span>
                          <span className="text-amber-800 text-xs">
                            &quot;Keep shoulder down, do not hike your trap&quot;
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview 4: SOAP & CPT */}
                  {activeStep.previewType === 'report' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="text-xs font-bold text-slate-900">CLINICAL SOAP REPORT</div>
                          <div className="text-[11px] text-slate-500">Session ID #PP-2026-8941</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                          AUDIT READY
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="text-slate-400 font-mono text-[10px] block">OBJECTIVE FINDING</span>
                          <span className="text-slate-800 font-medium">
                            Active left shoulder flexion reached 128° (+14° vs baseline). Bilateral symmetry scored 96%.
                          </span>
                        </div>

                        <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                          <span className="text-emerald-800 font-mono text-[10px] font-bold block">
                            MEDICARE RTM REIMBURSEMENT
                          </span>
                          <div className="flex justify-between items-center mt-1 text-slate-800">
                            <span className="font-bold">CPT 98977: Musculoskeletal Data Transmission</span>
                            <span className="font-mono font-bold text-emerald-700">$55.72</span>
                          </div>
                          <span className="text-[11px] text-slate-600 block mt-0.5">
                            Transmission Day 16 of 30 logged and validated.
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 font-mono">
                        <span>PDF Export: Available</span>
                        <span className="text-emerald-700 font-bold">EHR Synced</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

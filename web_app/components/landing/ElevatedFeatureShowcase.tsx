'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  ShieldCheck,
  Cpu,
  Volume2,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';

export function ElevatedFeatureShowcase() {
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'latency' | 'accuracy' | 'privacy'>('latency');

  return (
    <section id="capabilities" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-4 border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Core Biomechanical Capabilities</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight">
            Engineered for clinical precision. Built for any webcam.
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            Eliminating hardware barriers and sensor drift with deterministic computer vision, on-device WebAssembly kinematics, and automated clinical documentation.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: 33 3D Landmark Tracking (Large Feature, 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="md:col-span-7 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 group shadow-2xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  33 POSE LANDMARKS
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                Sub-Degree Markerless Joint Goniometry
              </h3>

              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                By tracking 33 3D anatomical landmarks simultaneously, PhysioPulse computes instant angles for glenohumeral elevation, knee flexion-extension, cervical spine alignment, and pelvic tilt without physical attachments.
              </p>

              {/* Interactive Micro Tab bar with Framer Motion sliding pill */}
              <div className="mt-6 p-1 bg-white rounded-xl border border-slate-200 flex items-center gap-1 max-w-md relative">
                {(['latency', 'accuracy', 'privacy'] as const).map((tabKey) => {
                  const isSelected = activeInteractiveTab === tabKey;
                  const label =
                    tabKey === 'latency'
                      ? '30 FPS WASM'
                      : tabKey === 'accuracy'
                      ? '< 1.4° Accuracy'
                      : '100% On-Device';

                  return (
                    <button
                      key={tabKey}
                      onClick={() => setActiveInteractiveTab(tabKey)}
                      className={`relative flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer z-10 ${
                        isSelected ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="featureTabHighlight"
                          className="absolute inset-0 bg-emerald-600 rounded-lg shadow-2xs -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                        />
                      )}
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Micro Tab Content with AnimatePresence */}
              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 min-h-[58px] flex items-center">
                <AnimatePresence mode="wait">
                  {activeInteractiveTab === 'latency' && (
                    <motion.div
                      key="latency"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between"
                    >
                      <span>Processes each frame in ~14ms inside browser WebAssembly heap. Zero frame drops.</span>
                      <span className="font-mono font-bold text-emerald-700 ml-3 shrink-0">30 FPS</span>
                    </motion.div>
                  )}
                  {activeInteractiveTab === 'accuracy' && (
                    <motion.div
                      key="accuracy"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between"
                    >
                      <span>Benchmarked side-by-side with 12-camera optoelectronic Vicon motion capture.</span>
                      <span className="font-mono font-bold text-emerald-700 ml-3 shrink-0">&lt; 1.4° Error</span>
                    </motion.div>
                  )}
                  {activeInteractiveTab === 'privacy' && (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex items-center justify-between"
                    >
                      <span>Raw camera feed is held strictly in local GPU memory and discarded immediately.</span>
                      <span className="font-mono font-bold text-emerald-700 ml-3 shrink-0">HIPAA Safe</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Client Architecture: MediaPipe Vision</span>
              <span className="font-semibold text-emerald-700">Standard 720p/1080p Webcams</span>
            </div>
          </motion.div>

          {/* Card 2: Real-time Audio Biofeedback (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 group shadow-2xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                  <Volume2 className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                  SUB-SECOND AUDIO
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white font-sans tracking-tight">
                Anti-Compensation Coaching
              </h3>

              <p className="mt-3 text-slate-300 text-sm leading-relaxed font-sans">
                Patients cannot see subtle dysfunctions like scapular elevation, torso lateral sway, or knee valgus collapse. The audio coach instantly cues correction before bad habits engrain.
              </p>

              {/* Visual Audio Wave Simulated Cue with animated soundbars */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Active Auditory Prompt
                    </span>
                  </div>

                  {/* Animated Sound Wave Bars */}
                  <div className="flex items-end gap-1 h-3.5">
                    {[0.3, 0.7, 1.0, 0.5, 0.8, 0.4].map((scale, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: ['25%', `${scale * 100}%`, '25%'] }}
                        transition={{
                          duration: 0.6 + i * 0.1,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="w-0.5 bg-emerald-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
                
                <p className="text-sm font-medium text-slate-100 font-sans italic">
                  &ldquo;Lower your shoulder. Maintain straight posture.&rdquo;
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Trigger: Kinetic Deviations &gt; 5°</span>
              <span className="text-emerald-400 font-semibold">Instant Latency</span>
            </div>
          </motion.div>

          {/* Card 3: Prescription OCR Engine (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 group shadow-2xs hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-6 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <Cpu className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                Doctor Script OCR
              </h3>

              <p className="mt-2 text-slate-600 text-sm leading-relaxed font-sans">
                Converts messy clinical handwriting and PDF referrals into targeted exercise protocols with surgical phase safeguards.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-900 block">ICD-10 Mapping</span>
              <span>Rotator cuff, ACL, Cervical, Lumbar</span>
            </div>
          </motion.div>

          {/* Card 4: Medicare RTM & CPT Code Automation (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 group shadow-2xs hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-6 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <FileCheck2 className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                CPT 98975 / 98977 Billing
              </h3>

              <p className="mt-2 text-slate-600 text-sm leading-relaxed font-sans">
                Automatically tracks the 16-day transmission milestone per 30 days required for Medicare Remote Therapeutic Monitoring reimbursement.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-900 block">$125+ / Patient / Mo</span>
              <span>Audit-ready session logs and EHR sync</span>
            </div>
          </motion.div>

          {/* Card 5: Objective SOAP Reporting (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="md:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all duration-200 group shadow-2xs hover:shadow-md"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 mb-6 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <TrendingUp className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 font-sans tracking-tight">
                Objective SOAP Notes
              </h3>

              <p className="mt-2 text-slate-600 text-sm leading-relaxed font-sans">
                Replaces subjective therapist notes with hard numbers: peak ROM, bilateral symmetry percentages, and completion rates.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 text-xs font-mono text-slate-500">
              <span className="font-bold text-slate-900 block">Printable PDF &amp; Clipboard</span>
              <span>1-click clinical handover export</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Zap,
  Play,
  Check
} from 'lucide-react';
import { EfficientMuscularVideo } from '@/components/ui/EfficientMuscularVideo';

interface HeroJointPreset {
  id: string;
  name: string;
  joint: string;
  targetRom: string;
  measuredRomVal: number;
  measuredRom: string;
  progressPct: number;
  symmetry: string;
  clinicalNote: string;
  icdCode: string;
}

const HERO_JOINTS: HeroJointPreset[] = [
  {
    id: 'shoulder',
    name: 'Rotator Cuff',
    joint: 'Left Glenohumeral Joint',
    targetRom: '140° Flexion',
    measuredRomVal: 128,
    measuredRom: '128°',
    progressPct: 91,
    symmetry: '96% bilateral symmetry',
    clinicalNote: 'Scapular plane elevation normal. No upper trapezius compensation detected.',
    icdCode: 'ICD-10: M75.122'
  },
  {
    id: 'knee',
    name: 'Patellar / ACL',
    joint: 'Left Tibiofemoral Complex',
    targetRom: '125° Squat Flexion',
    measuredRomVal: 116,
    measuredRom: '116°',
    progressPct: 92,
    symmetry: '94% bilateral symmetry',
    clinicalNote: 'Knee aligns over second ray. Zero medial knee valgus collapse.',
    icdCode: 'ICD-10: S83.512'
  },
  {
    id: 'cervical',
    name: 'Cervical Spine',
    joint: 'C4-C7 Suboccipital Complex',
    targetRom: '45° Axial Extension',
    measuredRomVal: 42,
    measuredRom: '42°',
    progressPct: 93,
    symmetry: '98% axial alignment',
    clinicalNote: 'Deep cervical flexor recruitment confirmed. Forward head shift reduced.',
    icdCode: 'ICD-10: M54.2'
  },
  {
    id: 'lumbar',
    name: 'Lumbar Pelvic',
    joint: 'L4-S1 Lumbopelvic Rhythm',
    targetRom: '60° Hip Flexion',
    measuredRomVal: 54,
    measuredRom: '54°',
    progressPct: 90,
    symmetry: '95% bilateral symmetry',
    clinicalNote: 'Neutral lumbar spine lordosis preserved throughout eccentric motion.',
    icdCode: 'ICD-10: M54.5'
  }
];

export interface LandingHeroProps {
  onOpenOcrModal?: () => void;
}

export function LandingHero({ onOpenOcrModal }: LandingHeroProps) {
  const [activeJoint, setActiveJoint] = useState<HeroJointPreset>(HERO_JOINTS[0]);
  const [displayAngle, setDisplayAngle] = useState<number>(HERO_JOINTS[0].measuredRomVal);
  const angleCounterRef = useRef({ val: HERO_JOINTS[0].measuredRomVal });

  // GSAP Smooth Interpolation for Numeric Angle Counter
  useEffect(() => {
    const tween = gsap.to(angleCounterRef.current, {
      val: activeJoint.measuredRomVal,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayAngle(Math.round(angleCounterRef.current.val));
      }
    });

    return () => {
      tween.kill();
    };
  }, [activeJoint]);

  return (
    <section className="relative bg-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 overflow-hidden">
      {/* Background Soft Glow with subtle animated float */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Bold Typography & Action Triggers with Framer Motion Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start z-10"
          >
            
            {/* Category Pill with Ping */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200/80 shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <span className="uppercase tracking-wider font-mono text-[11px]">
                Autonomous Telerehabilitation &amp; RTM
              </span>
            </motion.div>

            {/* Massive Bold Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] font-sans"
            >
              Clinical motion tracking through{' '}
              <span className="text-emerald-700 underline decoration-emerald-200 decoration-wavy underline-offset-4">
                any webcam
              </span>
              .
            </motion.h1>

            {/* Authoritative Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-xl font-normal"
            >
              PhysioPulse tracks 33 3D skeletal landmarks locally in your browser. Prescribe targeted protocols, correct patient form with sub-second audio biofeedback, and automate CMS Remote Therapeutic Monitoring (CPT 98975 / 98977) billing.
            </motion.p>

            {/* Tactile Action Buttons with Framer Motion hover/tap */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/session"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Clinical Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {onOpenOcrModal ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onOpenOcrModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Scan Doctor&apos;s Prescription</span>
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/session"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Scan Doctor&apos;s Prescription</span>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* High-Trust Specification Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-10 pt-6 border-t border-slate-200 w-full grid grid-cols-3 gap-3 sm:gap-6 text-slate-600"
            >
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Sensors
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Standard 720p/1080p cams
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Client WASM
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Zero video to cloud
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-sm font-sans flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  CPT 98975 / 98977
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  16-day compliant ledger
                </span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Interactive 3D Muscular Model & Animated HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            
            {/* The 3D Anatomical Video Showcase */}
            <div className="relative w-full max-w-[500px] lg:max-w-[560px] h-[480px] sm:h-[540px] lg:h-[600px] flex items-center justify-center">
              <EfficientMuscularVideo
                className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
                poster="/muscular_poster.jpg"
                alt="3D Anatomical Musculoskeletal Model"
                blendMultiply={true}
              />

              {/* Floating Real-Time Goniometry HUD with GSAP interpolated number */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute top-3 right-2 sm:right-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-lg text-left z-20 min-w-[170px]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold font-mono text-slate-400 tracking-wider">
                    Live Goniometer
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-mono font-extrabold text-slate-900 tracking-tight">
                    {displayAngle}°
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    / {activeJoint.targetRom.split(' ')[0]}
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                  <motion.div
                    className="bg-emerald-600 h-full rounded-full"
                    initial={false}
                    animate={{ width: `${activeJoint.progressPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>Target: {activeJoint.targetRom.split(' ')[0]}</span>
                  <span className="font-bold text-emerald-700">{activeJoint.progressPct}% Reach</span>
                </div>
              </motion.div>

              {/* Floating Biomechanical Alignment HUD */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-3 shadow-lg text-left z-20 max-w-[220px]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                    {activeJoint.icdCode}
                  </span>
                </div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeJoint.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="font-bold text-slate-900 text-xs truncate mt-1">
                      {activeJoint.joint}
                    </div>
                    
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 font-mono">
                      {activeJoint.symmetry}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Interactive Joint Switcher with Framer Motion layout pill animation */}
            <div className="w-full max-w-[480px] mt-2">
              <div className="relative flex items-center justify-between gap-1 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs">
                {HERO_JOINTS.map((item) => {
                  const isSelected = activeJoint.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveJoint(item)}
                      className={`relative flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center z-10 ${
                        isSelected ? 'text-emerald-800' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="heroJointPill"
                          className="absolute inset-0 bg-white rounded-xl shadow-xs border border-emerald-200/60 -z-10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeJoint.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 text-center"
                >
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    <strong className="text-slate-900 font-semibold">Kinematic Directive: </strong>
                    {activeJoint.clinicalNote}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}

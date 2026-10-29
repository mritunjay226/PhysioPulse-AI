'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText
} from 'lucide-react';
import { EfficientMuscularVideo } from '@/components/ui/EfficientMuscularVideo';

interface HeroJointPreset {
  id: string;
  name: string;
  joint: string;
  targetRom: string;
  measuredRom: string;
  progressPct: number;
  symmetry: string;
  clinicalNote: string;
}

const HERO_JOINTS: HeroJointPreset[] = [
  {
    id: 'shoulder',
    name: 'Rotator Cuff',
    joint: 'Left Glenohumeral Joint',
    targetRom: '140° Flexion',
    measuredRom: '128°',
    progressPct: 91,
    symmetry: '96% bilateral symmetry',
    clinicalNote: 'Scapular plane trajectory normal. No upper trapezius compensation detected.'
  },
  {
    id: 'knee',
    name: 'Patellar / ACL',
    joint: 'Left Tibiofemoral Complex',
    targetRom: '125° Squat Flexion',
    measuredRom: '116°',
    progressPct: 92,
    symmetry: '94% bilateral symmetry',
    clinicalNote: 'Knee aligns with second toe. Zero medial knee valgus collapse.'
  },
  {
    id: 'cervical',
    name: 'Cervical Spine',
    joint: 'C4-C7 Suboccipital Complex',
    targetRom: '45° Axial Extension',
    measuredRom: '42°',
    progressPct: 93,
    symmetry: '98% axial alignment',
    clinicalNote: 'Forward head displacement reduced by 3.8 cm from initial baseline.'
  },
  {
    id: 'lumbar',
    name: 'Lumbar Pelvic',
    joint: 'L4-S1 Lumbopelvic Rhythm',
    targetRom: '60° Hip Flexion',
    measuredRom: '54°',
    progressPct: 90,
    symmetry: '95% bilateral symmetry',
    clinicalNote: 'Lumbar lordosis preserved throughout eccentric phase.'
  }
];

export interface LandingHeroProps {
  onOpenOcrModal?: () => void;
}

export function LandingHero({ onOpenOcrModal }: LandingHeroProps) {
  const [activeJoint, setActiveJoint] = useState<HeroJointPreset>(HERO_JOINTS[0]);

  return (
    <section className="relative bg-white pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-6 flex flex-col items-start z-10">
            
            {/* Simple Category Label */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-6 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Markerless Telerehabilitation & RTM</span>
            </div>

            {/* Direct Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-sans">
              Objective motion tracking for physical therapy through any webcam.
            </h1>

            {/* Grounded Subhead */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-xl">
              PhysioPulse tracks 33 3D skeletal landmarks locally in the browser. Prescribe evidence-based exercises, give patients real-time form guidance, and automatically generate CMS Remote Therapeutic Monitoring (CPT 98975 / 98977) billing documentation.
            </p>

            {/* Clean Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Link
                href="/session"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <span>Launch live session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {onOpenOcrModal ? (
                <button
                  onClick={onOpenOcrModal}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Upload prescription</span>
                </button>
              ) : (
                <Link
                  href="/session"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Upload prescription</span>
                </Link>
              )}
            </div>

            {/* Technical Factual Highlights */}
            <div className="mt-10 pt-6 border-t border-slate-200 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-900 block">Zero hardware</span>
                <span>Runs on standard webcams</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">On-device inference</span>
                <span>No patient video sent to cloud</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900 block">CPT compliant</span>
                <span>Logs 16-day transmission intervals</span>
              </div>
            </div>

          </div>

          {/* Right Column: Unboxed, Larger 3D Muscular Model */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            
            {/* The Free-Standing Video Showcase (No card, larger, coming out) */}
            <div className="relative w-full max-w-[500px] lg:max-w-[580px] h-[500px] sm:h-[580px] lg:h-[660px] flex items-center justify-center">
              <EfficientMuscularVideo
                className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(15,23,42,0.14)]"
                poster="/muscular_poster.jpg"
                alt="3D Anatomical Musculoskeletal Model"
                blendMultiply={true}
              />

              {/* Floating Goniometry Metric HUD */}
              <div className="absolute top-4 right-2 sm:right-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl p-3 shadow-md text-left z-20">
                <span className="text-[10px] uppercase font-bold font-mono text-slate-400 block tracking-wider">
                  Live Angle
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-mono font-bold text-slate-900">
                    {activeJoint.measuredRom}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    / {activeJoint.targetRom.split(' ')[0]}
                  </span>
                </div>
                <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${activeJoint.progressPct}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Target: {activeJoint.targetRom.split(' ')[0]}</span>
                  <span className="font-semibold text-emerald-700">{activeJoint.progressPct}%</span>
                </div>
              </div>

              {/* Floating Joint / Alignment HUD */}
              <div className="absolute bottom-6 left-2 sm:left-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-xl px-3 py-2 shadow-md text-left z-20 max-w-[200px]">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block tracking-wider">
                  Target Joint
                </span>
                <div className="font-semibold text-slate-900 text-xs truncate mt-0.5">
                  {activeJoint.joint}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                  {activeJoint.symmetry}
                </div>
              </div>
            </div>

            {/* Joint Switcher & Clinical Note below the figure */}
            <div className="w-full max-w-[460px] mt-2">
              <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
                {HERO_JOINTS.map((item) => {
                  const isSelected = activeJoint.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveJoint(item)}
                      className={`flex-1 py-1.5 px-2 rounded-md text-xs transition-colors cursor-pointer text-center ${
                        isSelected
                          ? 'bg-white text-emerald-800 font-semibold shadow-xs border border-emerald-200/50'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-[11px] text-slate-500 mt-2 font-sans px-2">
                {activeJoint.clinicalNote}
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

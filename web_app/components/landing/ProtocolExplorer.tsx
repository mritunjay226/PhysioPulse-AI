'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProtocolInfo {
  id: number;
  name: string;
  joint: string;
  targetRom: string;
  primaryMuscle: string;
  clinicalIndication: string;
  safeguards: string;
  reps: number;
  sets: number;
}

const CLINICAL_PROTOCOLS: ProtocolInfo[] = [
  {
    id: 1,
    name: 'Rotator Cuff Supraspinatus Elevation',
    joint: 'Glenohumeral / Scapulothoracic Joint',
    targetRom: '140° Active Flexion',
    primaryMuscle: 'Supraspinatus, Anterior Deltoid',
    clinicalIndication: 'Post-operative rotator cuff repair (Weeks 4-12), Subacromial Impingement',
    safeguards: 'Monitors upper trapezius hiking; enforces 30° scapular plane.',
    reps: 12,
    sets: 3
  },
  {
    id: 2,
    name: 'Closed-Chain Patellar Squat',
    joint: 'Tibiofemoral & Patellofemoral Joint',
    targetRom: '120° Knee Flexion',
    primaryMuscle: 'Quadriceps Femoris, Gluteus Medius',
    clinicalIndication: 'ACL Reconstruction, Patellofemoral Pain Syndrome, Total Knee Arthroplasty',
    safeguards: 'Monitors dynamic knee valgus collapse and frontal plane knee deviation.',
    reps: 15,
    sets: 3
  },
  {
    id: 3,
    name: 'Cervical Retraction & Extension',
    joint: 'Cervical Spine (C4-C7) & Suboccipitals',
    targetRom: '45° Axial Extension',
    primaryMuscle: 'Deep Cervical Flexors, Rhomboids',
    clinicalIndication: 'Upper Crossed Syndrome, Cervical Radiculopathy, Desk Postural Strain',
    safeguards: 'Prompts chin tuck prior to extension; limits hyperextension.',
    reps: 10,
    sets: 4
  },
  {
    id: 4,
    name: 'Bilateral Shoulder Abduction',
    joint: 'Bilateral Glenohumeral Joint',
    targetRom: '150° Coronal Abduction',
    primaryMuscle: 'Middle Deltoid, Serratus Anterior',
    clinicalIndication: 'Adhesive Capsulitis (Frozen Shoulder), Thoracic Outlet Syndrome',
    safeguards: 'Calculates bilateral symmetry ratio in real-time.',
    reps: 10,
    sets: 3
  },
  {
    id: 7,
    name: 'Lumbar Pelvic Neutral Hinge',
    joint: 'Lumbopelvic Rhythm & Hip Hinge',
    targetRom: '60° Hip Flexion (0° Lumbar Flexion)',
    primaryMuscle: 'Transverse Abdominis, Multifidus, Gluteus Maximus',
    clinicalIndication: 'Chronic Lower Back Pain, Lumbar Disc Herniation',
    safeguards: 'Maintains neutral lordosis; alerts on posterior pelvic tilt.',
    reps: 12,
    sets: 3
  }
];

export function ProtocolExplorer() {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolInfo>(CLINICAL_PROTOCOLS[0]);

  return (
    <section id="protocols" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Protocols
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Supported clinical rehabilitation circuits.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            Evidence-based orthopedic protocols with pre-calibrated safety boundaries and anti-compensation rules.
          </p>
        </div>

        {/* 2-Column Clinical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* List */}
          <div className="lg:col-span-5 space-y-2">
            {CLINICAL_PROTOCOLS.map((proto) => {
              const isSelected = selectedProtocol.id === proto.id;
              return (
                <button
                  key={proto.id}
                  onClick={() => setSelectedProtocol(proto)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-emerald-600 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {proto.name}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      {proto.joint}
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-700 shrink-0 ml-3">
                    {proto.targetRom.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono text-slate-500 block">
                  Protocol #{selectedProtocol.id}
                </span>
                <h3 className="text-xl font-bold text-slate-900 font-sans mt-0.5">
                  {selectedProtocol.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase font-bold block">
                  Target ROM
                </span>
                <span className="text-base font-mono font-bold text-emerald-700">
                  {selectedProtocol.targetRom}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">
                  Target Joint
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedProtocol.joint}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">
                  Target Musculature
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedProtocol.primaryMuscle}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 uppercase font-bold text-[10px] block mb-1">
                  Clinical Indications
                </span>
                <span className="text-slate-700 leading-relaxed">
                  {selectedProtocol.clinicalIndication}
                </span>
              </div>
              <div className="sm:col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-700 font-bold block mb-0.5">
                  Anti-Compensation Boundary:
                </span>
                <span className="text-slate-600 leading-relaxed">
                  {selectedProtocol.safeguards}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Standard: {selectedProtocol.sets} sets × {selectedProtocol.reps} reps
              </span>
              <Link
                href="/session"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Launch in session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

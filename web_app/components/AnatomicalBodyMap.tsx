'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Activity, Check } from 'lucide-react';

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
    id: 'cervical',
    name: 'Cervical Spine',
    protocolId: 3,
    protocolName: 'Protocol 3: Cervical Posture Guard',
    xPct: 50,
    yPct: 15,
    description: 'Craniovertebral angle & neck posture drift'
  },
  {
    id: 'left_shoulder',
    name: 'Left Shoulder',
    protocolId: 1,
    protocolName: 'Protocol 1: Frozen Shoulder Abduction',
    xPct: 34,
    yPct: 24,
    description: 'Glenohumeral lateral abduction (0-180°)'
  },
  {
    id: 'right_shoulder',
    name: 'Right Shoulder Girdle',
    protocolId: 5,
    protocolName: 'Protocol 5: Bilateral Overhead Wall-Slide',
    xPct: 66,
    yPct: 24,
    description: 'Bilateral overhead scapulohumeral sync'
  },
  {
    id: 'left_elbow',
    name: 'Left Elbow',
    protocolId: 4,
    protocolName: 'Protocol 4: Elbow Flexion Rehab',
    xPct: 26,
    yPct: 37,
    description: 'Humeroulnar hinge flexion (0-150°)'
  },
  {
    id: 'left_wrist',
    name: 'Left Wrist / Carpal',
    protocolId: 8,
    protocolName: 'Protocol 8: Carpal Tunnel Extension',
    xPct: 20,
    yPct: 49,
    description: 'Radiocarpal dorsal flexion & median nerve'
  },
  {
    id: 'lumbar',
    name: 'Lumbar Spine',
    protocolId: 7,
    protocolName: 'Protocol 7: Lumbar Spine Rehab',
    xPct: 50,
    yPct: 43,
    description: 'Lumbar hinge motion & core pelvic bracing'
  },
  {
    id: 'left_hip',
    name: 'Left Hip Complex',
    protocolId: 6,
    protocolName: 'Protocol 6: Hip Lateral Abduction',
    xPct: 43,
    yPct: 54,
    description: 'Coxofemoral coronal abduction & pelvic level'
  },
  {
    id: 'left_knee',
    name: 'Left Knee Patella',
    protocolId: 2,
    protocolName: 'Protocol 2: Post-ACL Knee Squat',
    xPct: 43,
    yPct: 73,
    description: 'Tibiofemoral hinge & valgus prevention'
  }
];

export function AnatomicalBodyMap({
  activeProtocols,
  onSelectProtocol
}: AnatomicalBodyMapProps) {
  const [hoveredPin, setHoveredPin] = useState<AnatomicalPin | null>(null);

  const isProtocolActive = (protocolId: number) => activeProtocols.includes(protocolId);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm flex flex-col justify-between theme-card">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <Activity className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-sans tracking-tight">
                Anatomical Kinetic Map
              </h3>
              <p className="text-[11px] text-slate-500 font-sans">
                Markerless 3D musculoskeletal topology
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {activeProtocols.length} Targeted Joint{activeProtocols.length === 1 ? '' : 's'}
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
          Interactive kinetic topology. Click joint pins to toggle clinical rehabilitation protocols:
        </p>

        {/* 3D Muscular Model Canvas Container */}
        <div className="relative flex items-center justify-center py-6 bg-[#EFF2F6] rounded-xl border border-slate-200 overflow-hidden min-h-[460px] bg-clinical-grid">
          {/* Concentric telemetry rings */}
          <div className="absolute w-[260px] h-[260px] rounded-full border border-slate-200/80 pointer-events-none" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-slate-100 pointer-events-none" />

          {/* 3D Muscular Model Image */}
          <div className="relative w-[240px] h-[420px] flex items-center justify-center select-none">
            <Image
              src="/anatomical_model_2x.png"
              alt="3D Anatomical Musculoskeletal Model"
              width={260}
              height={440}
              priority
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(15,23,42,0.12)]"
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
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute z-20 group cursor-pointer transition-all ${
                    active ? 'scale-125' : 'hover:scale-115'
                  }`}
                  title={`${pin.name} (${pin.protocolName})`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-md ${
                        active
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 shadow-md font-extrabold'
                          : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {active ? '✓' : '+'}
                    </span>
                    {active && (
                      <span className="absolute -inset-1 rounded-full bg-blue-500/25 animate-ping-subtle pointer-events-none" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredPin && (
            <div className="absolute bottom-3 left-4 right-4 z-30 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl text-xs text-slate-800 pointer-events-none transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 font-sans">{hoveredPin.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  Protocol {hoveredPin.protocolId}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug font-sans">{hoveredPin.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Protocols List Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100">
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">
          Active Protocol Kinetic Coverage
        </span>
        <div className="flex flex-wrap gap-1.5">
          {BODY_PINS.filter((p) => isProtocolActive(p.protocolId)).map((pin) => (
            <span
              key={pin.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold font-mono"
            >
              <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
              <span>{pin.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

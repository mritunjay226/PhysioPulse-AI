'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HotspotJoint {
  id: string;
  name: string;
  category: string;
  protocolId: number;
  xPct: number;
  yPct: number;
  romTarget: string;
  romCurrent: string;
  romProgressPct: number;
  symmetryPct: number;
  status: 'optimal' | 'recovering' | 'acute';
  description: string;
}

export interface StudioAnatomicalHeroProps {
  joints: HotspotJoint[];
  selectedJoint: HotspotJoint;
  onSelectJoint: (joint: HotspotJoint) => void;
  rotationAngle: number;
  setRotationAngle: React.Dispatch<React.SetStateAction<number>>;
  zoomLevel: number;
}

export function StudioAnatomicalHero({
  joints,
  selectedJoint,
  onSelectJoint,
  rotationAngle,
  setRotationAngle,
  zoomLevel
}: StudioAnatomicalHeroProps) {
  return (
    <div className="flex-1 relative flex items-center justify-center min-h-[580px] select-none overflow-hidden">
      {/* Background Radial Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full border border-slate-200/50" />
        <div className="absolute w-[540px] h-[540px] rounded-full border border-dashed border-slate-200/40" />
        <div className="absolute w-[660px] h-[660px] rounded-full border border-slate-100/60" />
      </div>

      {/* SVG Connecting Spline Line to Diagnostic Drawer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ overflow: 'visible' }}
      >
        <path
          d={`M ${selectedJoint.xPct}% ${selectedJoint.yPct}% C ${
            selectedJoint.xPct + 20
          }% ${selectedJoint.yPct - 10}%, ${selectedJoint.xPct + 35}% ${
            selectedJoint.yPct + 15
          }%, 100% 38%`}
          fill="none"
          stroke="#1865F2"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="opacity-70 animate-pulse"
        />
        <circle
          cx={`${selectedJoint.xPct}%`}
          cy={`${selectedJoint.yPct}%`}
          r="6"
          fill="#1865F2"
          className="animate-ping-subtle"
        />
        <circle
          cx={`${selectedJoint.xPct}%`}
          cy={`${selectedJoint.yPct}%`}
          r="3.5"
          fill="#FFFFFF"
          stroke="#1865F2"
          strokeWidth="2"
        />
      </svg>

      {/* Central 3D Muscular Body Cutout */}
      <div
        className="relative z-10 transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoomLevel})`
        }}
      >
        {/* Anatomical Model Image */}
        <div className="relative w-[340px] h-[580px] sm:w-[380px] sm:h-[620px] flex items-center justify-center">
          <Image
            src="/anatomical_model_2x.png"
            alt="Human Anatomical Musculoskeletal Model"
            width={400}
            height={650}
            priority
            className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(15,23,42,0.12)]"
          />

          {/* Hotspot Interactive Markers */}
          {joints.map((joint) => {
            const isSelected = selectedJoint.id === joint.id;
            return (
              <button
                key={joint.id}
                onClick={() => onSelectJoint(joint)}
                style={{
                  left: `${joint.xPct}%`,
                  top: `${joint.yPct}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute z-20 group cursor-pointer transition-all ${
                  isSelected ? 'scale-125' : 'hover:scale-110'
                }`}
                title={`${joint.name} — Click to inspect kinematic metrics`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all shadow-md ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    +
                  </span>
                  {isSelected && (
                    <span className="absolute -inset-1 rounded-full bg-blue-500/20 animate-ping-subtle pointer-events-none" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Orbit Ring with Rotation Angle Indicator */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-200/90 shadow-xs z-30">
          <button
            onClick={() => setRotationAngle((prev) => (prev - 15 + 360) % 360)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Rotate Left 15°"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-600 font-semibold min-w-[42px] text-center">
            {rotationAngle}°
          </span>
          <button
            onClick={() => setRotationAngle((prev) => (prev + 15) % 360)}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Rotate Right 15°"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

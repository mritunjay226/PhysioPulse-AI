'use client';

import React from 'react';

interface StickmanProps {
  protocolId: number;
  className?: string;
}

export function StickmanExerciseAnimation({ protocolId, className = '' }: StickmanProps) {
  // Protocol 1: Shoulder Abduction
  // Protocol 2: Knee Squat & Extension
  // Protocol 3: Cervical Posture Guard (Chin Tuck)
  // Protocol 4: Elbow Flexion Curl
  // Protocol 5: Bilateral Overhead Wall Slide
  // Protocol 6: Hip Side Abduction
  // Protocol 7: Lumbar Hip Hinge
  // Protocol 8: Wrist Extension & Glide

  const renderAnimation = () => {
    switch (protocolId) {
      case 1:
        // Shoulder Abduction: arm raises out to side 90 deg
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <defs>
              <linearGradient id="stickEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <style>{`
              @keyframes shoulderRaise {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-88deg); }
                100% { transform: rotate(0deg); }
              }
              .moving-arm-p1 {
                transform-origin: 118px 65px;
                animation: shoulderRaise 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="40" y1="165" x2="160" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
            
            {/* Target arc at 90 deg */}
            <path d="M 155 65 A 37 37 0 0 1 118 102" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="3 3" />
            <text x="150" y="55" fill="#059669" fontSize="10" fontWeight="bold" fontFamily="sans-serif">90° Target</text>

            {/* Head */}
            <circle cx="100" cy="38" r="14" fill="#f8fafc" stroke="#059669" strokeWidth="3.5" />
            {/* Face guide eyes */}
            <circle cx="96" cy="37" r="1.5" fill="#059669" />
            <circle cx="104" cy="37" r="1.5" fill="#059669" />

            {/* Torso */}
            <line x1="100" y1="52" x2="100" y2="110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            
            {/* Shoulders bar */}
            <line x1="82" y1="65" x2="118" y2="65" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Static Left Arm */}
            <line x1="82" y1="65" x2="72" y2="108" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="72" cy="108" r="3" fill="#64748b" />

            {/* Animated Right Arm raising to 90 deg */}
            <g className="moving-arm-p1">
              {/* Upper arm + Forearm */}
              <line x1="118" y1="65" x2="118" y2="105" stroke="url(#stickEmerald)" strokeWidth="4" strokeLinecap="round" />
              <circle cx="118" cy="105" r="3.5" fill="#059669" />
            </g>

            {/* Pelvis & Legs */}
            <line x1="88" y1="110" x2="112" y2="110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="90" y1="110" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="110" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Motion arrow */}
            <path d="M 135 105 Q 155 90 148 70" fill="none" stroke="#059669" strokeWidth="1.5" strokeDasharray="2 2" markerEnd="url(#arrow)" />
          </svg>
        );

      case 2:
        // Knee Squat: standing tall -> knee bend 90 deg -> stand
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes squatMotion {
                0%, 15% { transform: translateY(0px); }
                50%, 65% { transform: translateY(28px); }
                100% { transform: translateY(0px); }
              }
              @keyframes kneeFlex {
                0%, 15% { d: path("M 85 105 L 85 135 L 85 165"); }
                50%, 65% { d: path("M 85 133 L 65 145 L 85 165"); }
                100% { d: path("M 85 105 L 85 135 L 85 165"); }
              }
              @keyframes kneeFlexRight {
                0%, 15% { d: path("M 115 105 L 115 135 L 115 165"); }
                50%, 65% { d: path("M 115 133 L 135 145 L 115 165"); }
                100% { d: path("M 115 105 L 115 135 L 115 165"); }
              }
              .squatting-body {
                animation: squatMotion 3.4s ease-in-out infinite;
              }
              .left-leg-bend {
                animation: kneeFlex 3.4s ease-in-out infinite;
              }
              .right-leg-bend {
                animation: kneeFlexRight 3.4s ease-in-out infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Upper body moving down */}
            <g className="squatting-body">
              {/* Head */}
              <circle cx="100" cy="32" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
              {/* Torso */}
              <line x1="100" y1="45" x2="100" y2="105" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
              {/* Arms reaching forward for balance */}
              <line x1="100" y1="60" x2="140" y2="68" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {/* Dynamic Legs bending to 90 deg */}
            <path className="left-leg-bend" d="M 85 105 L 85 135 L 85 165" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <path className="right-leg-bend" d="M 115 105 L 115 135 L 115 165" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* 90 deg guide indicator */}
            <text x="145" y="145" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">90° Squat</text>
          </svg>
        );

      case 3:
        // Cervical Posture Guard (Chin Tuck - Side Profile View)
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes chinTuck {
                0%, 20% { transform: translateX(0px); }
                50%, 75% { transform: translateX(-24px); }
                100% { transform: translateX(0px); }
              }
              .retracting-head {
                animation: chinTuck 3.6s ease-in-out infinite;
              }
            `}</style>
            {/* Vertical posture alignment line */}
            <line x1="95" y1="20" x2="95" y2="165" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="4 4" />
            <text x="100" y="24" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Alignment Line</text>

            {/* Chair & Torso (Seated Profile) */}
            {/* Spine & Torso */}
            <line x1="95" y1="68" x2="95" y2="135" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
            {/* Seated Thigh */}
            <line x1="95" y1="135" x2="145" y2="135" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            {/* Seated Shin */}
            <line x1="145" y1="135" x2="145" y2="170" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            {/* Chair outline */}
            <path d="M 85 75 L 85 142 L 135 142" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2 2" />

            {/* Retracting Head & Neck (Moving straight backward) */}
            <g className="retracting-head">
              {/* Neck */}
              <line x1="115" y1="66" x2="100" y2="68" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              {/* Head Profile */}
              <circle cx="118" cy="44" r="14" fill="#f8fafc" stroke="#059669" strokeWidth="3.5" />
              {/* Nose pointing right */}
              <path d="M 132 44 L 138 47 L 132 50" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              {/* Chin */}
              <path d="M 128 54 Q 124 57 118 57" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              {/* Horizontal retraction arrow */}
              <path d="M 148 48 L 136 48" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)" />
            </g>

            {/* Instruction tooltip */}
            <rect x="25" y="85" width="62" height="34" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="30" y="99" fill="#166534" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PULL CHIN</text>
            <text x="30" y="111" fill="#166534" fontSize="8" fontWeight="bold" fontFamily="sans-serif">STRAIGHT BACK</text>
          </svg>
        );

      case 4:
        // Elbow Flexion Curl: forearm curls up to shoulder
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes elbowCurl {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-130deg); }
                100% { transform: rotate(0deg); }
              }
              .moving-forearm {
                transform-origin: 125px 95px;
                animation: elbowCurl 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Head & Torso */}
            <circle cx="100" cy="38" r="14" fill="#f8fafc" stroke="#059669" strokeWidth="3.5" />
            <line x1="100" y1="52" x2="100" y2="120" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="68" x2="120" y2="68" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Left Arm Static */}
            <line x1="80" y1="68" x2="75" y2="115" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />

            {/* Upper Arm pinned to side */}
            <line x1="120" y1="68" x2="125" y2="95" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="125" cy="95" r="4" fill="#059669" />

            {/* Curled Forearm */}
            <g className="moving-forearm">
              <line x1="125" y1="95" x2="125" y2="140" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="125" cy="140" r="4" fill="#10b981" />
            </g>

            {/* Motion arc */}
            <path d="M 125 140 A 45 45 0 0 1 100 68" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="3 3" />
            <text x="135" y="80" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">125°+ Curl</text>

            {/* Legs seated/standing */}
            <line x1="90" y1="120" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="120" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 5:
        // Bilateral Overhead Wall Slide: both arms slide up into V
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes slideLeftArm {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-45deg) translateY(-15px); }
                100% { transform: rotate(0deg); }
              }
              @keyframes slideRightArm {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(45deg) translateY(-15px); }
                100% { transform: rotate(0deg); }
              }
              .wall-slide-left {
                transform-origin: 75px 65px;
                animation: slideLeftArm 3.4s ease-in-out infinite;
              }
              .wall-slide-right {
                transform-origin: 125px 65px;
                animation: slideRightArm 3.4s ease-in-out infinite;
              }
            `}</style>
            {/* Head & Body */}
            <circle cx="100" cy="40" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
            <line x1="100" y1="53" x2="100" y2="115" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Goalpost Left Arm */}
            <g className="wall-slide-left">
              <line x1="100" y1="65" x2="70" y2="65" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <line x1="70" y1="65" x2="70" y2="35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <circle cx="70" cy="35" r="3.5" fill="#059669" />
            </g>

            {/* Goalpost Right Arm */}
            <g className="wall-slide-right">
              <line x1="100" y1="65" x2="130" y2="65" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <line x1="130" y1="65" x2="130" y2="35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <circle cx="130" cy="35" r="3.5" fill="#059669" />
            </g>

            {/* Legs */}
            <line x1="90" y1="115" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="115" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />

            <text x="68" y="16" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Overhead "V" Slide</text>
          </svg>
        );

      case 6:
        // Hip Lateral Abduction: standing, right leg swings out to side 30 deg
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes hipAbduction {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-28deg); }
                100% { transform: rotate(0deg); }
              }
              .moving-leg {
                transform-origin: 105px 110px;
                animation: hipAbduction 3.2s ease-in-out infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
            {/* Balance Support Chair / Bar */}
            <line x1="60" y1="65" x2="60" y2="165" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="60" cy="65" r="3" fill="#94a3b8" />

            {/* Head & Torso */}
            <circle cx="95" cy="38" r="14" fill="#f8fafc" stroke="#059669" strokeWidth="3.5" />
            <line x1="95" y1="52" x2="95" y2="110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            
            {/* Left Arm holding support */}
            <line x1="95" y1="65" x2="60" y2="65" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

            {/* Supporting Left Leg */}
            <line x1="88" y1="110" x2="88" y2="165" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

            {/* Abducting Right Leg */}
            <g className="moving-leg">
              <line x1="105" y1="110" x2="105" y2="165" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="105" cy="165" r="3" fill="#10b981" />
            </g>

            {/* Target Arc */}
            <text x="120" y="145" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">30° Hip Lift</text>
          </svg>
        );

      case 7:
        // Lumbar Spine Flexion & Hip Hinge
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes hipHinge {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-35deg); }
                100% { transform: rotate(0deg); }
              }
              .hinging-torso {
                transform-origin: 110px 115px;
                animation: hipHinge 3.5s ease-in-out infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="40" y1="165" x2="160" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Legs with slight soft knee bend */}
            <line x1="110" y1="115" x2="106" y2="140" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <line x1="106" y1="140" x2="110" y2="165" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

            {/* Hinging Torso and Head */}
            <g className="hinging-torso">
              {/* Flat spine */}
              <line x1="110" y1="115" x2="110" y2="55" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              {/* Head aligned with spine */}
              <circle cx="110" cy="40" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
              {/* Arms hanging naturally straight down */}
              <line x1="110" y1="65" x2="110" y2="105" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
            </g>

            <text x="35" y="80" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Flat Back Hinge</text>
            <text x="35" y="94" fill="#64748b" fontSize="8" fontFamily="sans-serif">Push Hips Back</text>
          </svg>
        );

      case 8:
      default:
        // Carpal Tunnel Wrist Extension: forearm resting flat, hand bending upward
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full">
            <style>{`
              @keyframes wristExtend {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-32deg); }
                100% { transform: rotate(0deg); }
              }
              .moving-hand {
                transform-origin: 110px 105px;
                animation: wristExtend 3.0s ease-in-out infinite;
              }
            `}</style>
            {/* Table / Desk Surface */}
            <line x1="30" y1="115" x2="170" y2="115" stroke="#cbd5e1" strokeWidth="3" />
            <text x="35" y="130" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Flat Table Support</text>

            {/* Arm Resting Flat */}
            <line x1="45" y1="105" x2="110" y2="105" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
            {/* Wrist Pivot Point */}
            <circle cx="110" cy="105" r="4.5" fill="#059669" />

            {/* Hand extending up */}
            <g className="moving-hand">
              <line x1="110" y1="105" x2="155" y2="105" stroke="#059669" strokeWidth="5.5" strokeLinecap="round" />
              {/* Fingers */}
              <circle cx="155" cy="105" r="3.5" fill="#10b981" />
            </g>

            {/* 25 deg angle arc */}
            <path d="M 150 105 A 40 40 0 0 0 144 85" fill="none" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="2 2" />
            <text x="135" y="75" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">25° Lift</text>
          </svg>
        );
    }
  };

  return (
    <div className={`relative flex items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl p-2 overflow-hidden ${className}`}>
      {renderAnimation()}
      <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
        <span className="text-[10px] font-semibold text-emerald-800 bg-white/95 px-2.5 py-0.5 rounded-full shadow-xs border border-emerald-100">
          Animated Technique Guide
        </span>
      </div>
    </div>
  );
}

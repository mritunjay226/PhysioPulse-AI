'use client';

import React from 'react';

interface StickmanProps {
  protocolId: number;
  className?: string;
}

export function StickmanExerciseAnimation({ protocolId, className = '' }: StickmanProps) {
  // Protocol 1: Frozen Shoulder Lateral Raise (Glenohumeral Abduction & Elevation)
  // Protocol 2: Post-ACL Knee Squat & Extension (Tibiofemoral & Quadriceps Control)
  // Protocol 3: Cervical Retraction & Ergonomic Posture Guard (Chin Tuck)
  // Protocol 4: Post-Fracture Elbow Flexion Rehabilitation (Elbow Curl)
  // Protocol 5: Bilateral Overhead Wall-Slide Sync (Scapulothoracic Rhythm)
  // Protocol 6: Total Hip Replacement Side Abduction (Gluteus Medius)
  // Protocol 7: Lumbar Spine Flexion & Hip Hinge (Neutral Spine)
  // Protocol 8: Carpal Tunnel Wrist & Forearm Extension (Radiocarpal)

  const renderAnimation = () => {
    switch (protocolId) {
      case 1:
        // Protocol 1: Frozen Shoulder Lateral Raise - Front View
        // Right arm abducts laterally in coronal plane from side (0°) up to horizontal (90°)
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <linearGradient id="stickEmerald1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <marker id="arrowP1" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            <style>{`
              @keyframes p1ShoulderRaise {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-90deg); }
                100% { transform: rotate(0deg); }
              }
              .p1-moving-arm {
                transform-origin: 122px 60px;
                animation: p1ShoulderRaise 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* 90° Horizontal Target Reference Line */}
            <line x1="122" y1="60" x2="182" y2="60" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* 90° Angular Arc Guide */}
            <path d="M 122 102 A 42 42 0 0 0 164 60" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrowP1)" />
            <text x="145" y="52" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">90° Target</text>

            {/* Head */}
            <circle cx="100" cy="34" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
            <circle cx="96" cy="34" r="1.5" fill="#059669" />
            <circle cx="104" cy="34" r="1.5" fill="#059669" />
            <path d="M 98 41 Q 100 43 102 41" stroke="#059669" strokeWidth="1.2" fill="none" />

            {/* Neck & Spine / Torso */}
            <line x1="100" y1="47" x2="100" y2="108" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Shoulder Girdle (Stays level without shrugging) */}
            <line x1="78" y1="60" x2="122" y2="60" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Left Arm (Resting naturally at side) */}
            <line x1="78" y1="60" x2="74" y2="86" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="74" cy="86" r="3" fill="#64748b" />
            <line x1="74" y1="86" x2="72" y2="110" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="72" cy="113" r="3.5" fill="#94a3b8" />

            {/* Pelvis & Legs */}
            <line x1="86" y1="108" x2="114" y2="108" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            {/* Left Leg */}
            <line x1="88" y1="108" x2="88" y2="136" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="88" cy="136" r="3" fill="#475569" />
            <line x1="88" y1="136" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="82" y1="165" x2="94" y2="165" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            {/* Right Leg */}
            <line x1="112" y1="108" x2="112" y2="136" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="112" cy="136" r="3" fill="#475569" />
            <line x1="112" y1="136" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="106" y1="165" x2="118" y2="165" stroke="#334155" strokeWidth="3" strokeLinecap="round" />

            {/* Animated Right Arm - Pure Lateral Glenohumeral Abduction */}
            <g className="p1-moving-arm">
              {/* Upper Arm */}
              <line x1="122" y1="60" x2="122" y2="86" stroke="url(#stickEmerald1)" strokeWidth="4" strokeLinecap="round" />
              {/* Elbow Joint */}
              <circle cx="122" cy="86" r="3" fill="#059669" />
              {/* Forearm */}
              <line x1="122" y1="86" x2="122" y2="110" stroke="url(#stickEmerald1)" strokeWidth="3.5" strokeLinecap="round" />
              {/* Hand */}
              <circle cx="122" cy="114" r="3.5" fill="#10b981" />
            </g>

            {/* Right Shoulder Pivot Joint Node */}
            <circle cx="122" cy="60" r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />

            {/* Clinical form cues */}
            <text x="32" y="80" fill="#64748b" fontSize="8" fontFamily="sans-serif">Neck Relaxed</text>
            <text x="32" y="90" fill="#64748b" fontSize="8" fontFamily="sans-serif">(No Shrug)</text>
          </svg>
        );

      case 2:
        // Protocol 2: Post-ACL Knee Squat & Extension - Sagittal Side Profile
        // Anatomically accurate squat: hips hinge back, spine stays neutral, thighs descend to 90° parallel
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            {/* Ground Line */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Bench / Chair Guide behind hips to cue "sit back" */}
            <path d="M 40 100 L 40 134 L 75 134" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="3 3" />
            <text x="38" y="94" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Chair Depth Guide</text>

            {/* 90° Knee Flexion Reference Arc (Visible in Squat Depth) */}
            <path d="M 104 116 A 18 18 0 0 1 114 134" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
            <text x="118" y="128" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">90° Knee Angle</text>

            {/* Foot (Glued firmly flat to floor throughout squat) */}
            <line x1="76" y1="164" x2="114" y2="164" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />

            {/* Lower Leg & Thigh (Ankle -> Knee -> Hip) */}
            <path
              fill="none"
              stroke="#059669"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 92 164 L 92 134 L 92 104"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 92 164 L 92 134 L 92 104;
                  M 92 164 L 92 134 L 92 104;
                  M 92 164 L 104 134 L 68 134;
                  M 92 164 L 104 134 L 68 134;
                  M 92 164 L 92 134 L 92 104
                "
              />
            </path>

            {/* Knee Joint Node */}
            <circle cx="92" cy="134" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5">
              <animate
                attributeName="cx"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="92; 92; 104; 104; 92"
              />
            </circle>

            {/* Hip Joint Node */}
            <circle cx="92" cy="104" r="4" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5">
              <animate
                attributeName="cx"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="92; 92; 68; 68; 92"
              />
              <animate
                attributeName="cy"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="104; 104; 134; 134; 104"
              />
            </circle>

            {/* Torso & Spine (Neutral flat spine that hinges naturally from hip) */}
            <path
              fill="none"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              d="M 92 104 L 92 52"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 92 104 L 92 52;
                  M 92 104 L 92 52;
                  M 68 134 L 96 86;
                  M 68 134 L 96 86;
                  M 92 104 L 92 52
                "
              />
            </path>

            {/* Arms (Reach forward during squat for natural counterbalance) */}
            <path
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              d="M 92 56 L 102 92"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 92 56 L 102 92;
                  M 92 56 L 102 92;
                  M 96 86 L 138 86;
                  M 96 86 L 138 86;
                  M 92 56 L 102 92
                "
              />
            </path>

            {/* Head (Faces forward, keeps cervical spine aligned with torso) */}
            <circle cx="92" cy="34" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3">
              <animate
                attributeName="cx"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="92; 92; 102; 102; 92"
              />
              <animate
                attributeName="cy"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="34; 34; 66; 66; 34"
              />
            </circle>

            {/* Squat coaching cues */}
            <text x="32" y="156" fill="#64748b" fontSize="8" fontFamily="sans-serif">Hips Back</text>
            <text x="135" y="156" fill="#64748b" fontSize="8" fontFamily="sans-serif">Heels Down</text>
          </svg>
        );

      case 3:
        // Protocol 3: Cervical Posture Guard (Chin Tuck) - Seated Side Profile
        // Pure horizontal retraction of head onto vertical plumb line over shoulders; neck stays attached!
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP3" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            {/* Ground Line */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Vertical Plumb Line / Alignment Axis (Passing through C7 and Acromion) */}
            <line x1="88" y1="18" x2="88" y2="165" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="92" y="24" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Neutral Plumb Line</text>

            {/* Chair Geometry (Seated Ergonomic Base) */}
            <path d="M 76 68 L 76 138 L 122 138" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="76" y1="138" x2="76" y2="165" stroke="#cbd5e1" strokeWidth="2.5" />
            <line x1="120" y1="138" x2="120" y2="165" stroke="#cbd5e1" strokeWidth="2.5" />

            {/* Seated Lower Body (Pelvis, Thigh, Knee, Shin, Foot) */}
            <line x1="88" y1="138" x2="126" y2="138" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="126" cy="138" r="3.5" fill="#475569" />
            <line x1="126" y1="138" x2="126" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="122" y1="165" x2="136" y2="165" stroke="#334155" strokeWidth="3" strokeLinecap="round" />

            {/* Thoracic Spine (Firmly against chair back; anchored C7 at 88, 68) */}
            <line x1="88" y1="138" x2="88" y2="68" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
            {/* Shoulder Joint at (88, 68) */}
            <circle cx="88" cy="68" r="4" fill="#059669" />

            {/* Resting Arm on Thigh */}
            <path d="M 88 68 L 110 102 L 120 134" fill="none" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="120" cy="134" r="3" fill="#64748b" />

            {/* Cervical Spine (Neck) - Continuously attached from C7 (88, 68) to skull base */}
            <line
              x1="88"
              y1="68"
              x2="108"
              y2="52"
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <animate
                attributeName="x2"
                dur="3.6s"
                repeatCount="indefinite"
                keyTimes="0; 0.20; 0.55; 0.75; 1"
                values="108; 108; 89; 89; 108"
              />
              <animate
                attributeName="y2"
                dur="3.6s"
                repeatCount="indefinite"
                keyTimes="0; 0.20; 0.55; 0.75; 1"
                values="52; 52; 50; 50; 52"
              />
            </line>

            {/* Head Profile with Ear Target Node (Glides purely horizontal backward) */}
            <g>
              <circle cx="114" cy="38" r="14" fill="#f8fafc" stroke="#059669" strokeWidth="3.5">
                <animate
                  attributeName="cx"
                  dur="3.6s"
                  repeatCount="indefinite"
                  keyTimes="0; 0.20; 0.55; 0.75; 1"
                  values="114; 114; 90; 90; 114"
                />
              </circle>
              {/* Nose pointing right */}
              <path d="M 128 38 L 134 41 L 128 44" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.6s"
                  repeatCount="indefinite"
                  keyTimes="0; 0.20; 0.55; 0.75; 1"
                  values="0 0; 0 0; -24 0; -24 0; 0 0"
                />
              </path>
              {/* Chin profile */}
              <path d="M 124 48 Q 120 51 114 51" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="3.6s"
                  repeatCount="indefinite"
                  keyTimes="0; 0.20; 0.55; 0.75; 1"
                  values="0 0; 0 0; -24 0; -24 0; 0 0"
                />
              </path>
              {/* Ear Acoustic Canal (Alignment target that locks directly on green plumb line) */}
              <circle cx="110" cy="38" r="2.5" fill="#10b981">
                <animate
                  attributeName="cx"
                  dur="3.6s"
                  repeatCount="indefinite"
                  keyTimes="0; 0.20; 0.55; 0.75; 1"
                  values="110; 110; 88; 88; 110"
                />
              </circle>
            </g>

            {/* Horizontal Retraction Cue Arrow */}
            <path d="M 148 42 L 136 42" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowP3)" />
            <text x="140" y="36" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Glide Back</text>

            {/* Instruction tooltip */}
            <rect x="24" y="86" width="60" height="32" rx="6" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="28" y="99" fill="#166534" fontSize="8" fontWeight="bold" fontFamily="sans-serif">EAR ALIGNS</text>
            <text x="28" y="110" fill="#166534" fontSize="8" fontWeight="bold" fontFamily="sans-serif">OVER SHOULDER</text>
          </svg>
        );

      case 4:
        // Protocol 4: Post-Fracture Elbow Flexion (Elbow Curl) - Front View
        // Upper arm stays anchored to ribcage; forearm curls smoothly up toward shoulder (125°+ flexion)
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP4" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            <style>{`
              @keyframes p4ElbowCurl {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(135deg); }
                100% { transform: rotate(0deg); }
              }
              .p4-moving-forearm {
                transform-origin: 122px 98px;
                animation: p4ElbowCurl 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* 125°+ Flexion Arc at Elbow Joint */}
            <path d="M 122 136 A 38 38 0 0 1 95 71" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrowP4)" />
            <text x="135" y="78" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">125° Curl</text>

            {/* Head */}
            <circle cx="100" cy="34" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
            <circle cx="96" cy="34" r="1.5" fill="#059669" />
            <circle cx="104" cy="34" r="1.5" fill="#059669" />

            {/* Torso / Spine */}
            <line x1="100" y1="47" x2="100" y2="114" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Shoulders */}
            <line x1="78" y1="62" x2="122" y2="62" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Left Arm (Relaxed at side) */}
            <line x1="78" y1="62" x2="74" y2="88" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="74" cy="88" r="3" fill="#64748b" />
            <line x1="74" y1="88" x2="72" y2="115" stroke="#64748b" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="72" cy="118" r="3.5" fill="#94a3b8" />

            {/* Pelvis & Legs */}
            <line x1="88" y1="114" x2="112" y2="114" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="90" y1="114" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="114" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />

            {/* Upper Arm Anchored to Ribcage (Stationary humerus) */}
            <line x1="122" y1="62" x2="122" y2="98" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            {/* Upper Arm Anchor Guard Badge */}
            <rect x="130" y="74" width="60" height="18" rx="4" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <text x="134" y="86" fill="#64748b" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">Arm Stationary</text>

            {/* Animated Forearm Curling Upward and Inward toward anterior shoulder */}
            <g className="p4-moving-forearm">
              {/* Forearm */}
              <line x1="122" y1="98" x2="122" y2="140" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              {/* Hand & Palm */}
              <circle cx="122" cy="142" r="3.5" fill="#10b981" />
            </g>

            {/* Elbow Joint Pivot Node */}
            <circle cx="122" cy="98" r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        );

      case 5:
        // Protocol 5: Bilateral Overhead Wall-Slide Sync (Scapulothoracic Rhythm)
        // Starts in "W" goalpost position; slides simultaneously up into high "V" with 100% attached shoulders
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <linearGradient id="stickEmerald5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            {/* Ground Line */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Overhead "V" Guide Lines (Target 120° Reach) */}
            <line x1="80" y1="64" x2="40" y2="16" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1="120" y1="64" x2="160" y2="16" stroke="#a7f3d0" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="66" y="16" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Overhead 120° V-Slide</text>

            {/* Head */}
            <circle cx="100" cy="38" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
            <circle cx="96" cy="38" r="1.5" fill="#059669" />
            <circle cx="104" cy="38" r="1.5" fill="#059669" />

            {/* Torso & Spine */}
            <line x1="100" y1="51" x2="100" y2="114" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Shoulder Girdle */}
            <line x1="80" y1="64" x2="120" y2="64" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Pelvis & Standing Legs */}
            <line x1="88" y1="114" x2="112" y2="114" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <line x1="90" y1="114" x2="88" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="110" y1="114" x2="112" y2="165" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />

            {/* Left Arm: Slides from "W" (elbow down/out, hand up) to High "Y" (elbow up/out, hand high) */}
            <path
              fill="none"
              stroke="url(#stickEmerald5)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 80 64 L 64 80 L 64 50"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 80 64 L 64 80 L 64 50;
                  M 80 64 L 64 80 L 64 50;
                  M 80 64 L 54 44 L 42 18;
                  M 80 64 L 54 44 L 42 18;
                  M 80 64 L 64 80 L 64 50
                "
              />
            </path>
            {/* Left Shoulder Pivot Node (Permanently connected to torso) */}
            <circle cx="80" cy="64" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />

            {/* Right Arm: Synchronized symmetrical slide to High "Y" */}
            <path
              fill="none"
              stroke="url(#stickEmerald5)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M 120 64 L 136 80 L 136 50"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 120 64 L 136 80 L 136 50;
                  M 120 64 L 136 80 L 136 50;
                  M 120 64 L 146 44 L 158 18;
                  M 120 64 L 146 44 L 158 18;
                  M 120 64 L 136 80 L 136 50
                "
              />
            </path>
            {/* Right Shoulder Pivot Node (Permanently connected to torso) */}
            <circle cx="120" cy="64" r="4" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />

            {/* Symmetry verification badge */}
            <rect x="55" y="146" width="90" height="16" rx="4" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            <text x="60" y="157" fill="#166534" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Bilateral Symmetry 100%</text>
          </svg>
        );

      case 6:
        // Protocol 6: Total Hip Replacement Side Abduction - Front Standing View
        // Left hand holds support barre; torso stays vertical; right leg abducts cleanly 30° out
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP6" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            <style>{`
              @keyframes p6HipAbduction {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-30deg); }
                100% { transform: rotate(0deg); }
              }
              .p6-moving-leg {
                transform-origin: 104px 110px;
                animation: p6HipAbduction 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Ground */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Stability Support Chair / Barre on Left */}
            <line x1="48" y1="66" x2="48" y2="165" stroke="#94a3b8" strokeWidth="3" />
            <line x1="40" y1="66" x2="56" y2="66" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <text x="32" y="58" fill="#64748b" fontSize="8" fontFamily="sans-serif">Support Barre</text>

            {/* Head & Upright Torso (No lateral lean cheat) */}
            <circle cx="95" cy="34" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3" />
            <line x1="95" y1="47" x2="95" y2="110" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

            {/* Left Hand Holding Support Barre */}
            <line x1="95" y1="62" x2="48" y2="66" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="48" cy="66" r="3" fill="#059669" />

            {/* Right Arm at Side */}
            <line x1="95" y1="62" x2="112" y2="88" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />

            {/* Level Pelvic Line (Ensures no pelvic drop / Trendelenburg compensation) */}
            <line x1="86" y1="110" x2="104" y2="110" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="78" y1="110" x2="112" y2="110" stroke="#a7f3d0" strokeWidth="1" strokeDasharray="2 2" />

            {/* Supporting Left Leg (Solid vertical base) */}
            <line x1="86" y1="110" x2="86" y2="138" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="86" cy="138" r="3" fill="#475569" />
            <line x1="86" y1="138" x2="86" y2="165" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <line x1="80" y1="165" x2="92" y2="165" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />

            {/* 30° Abduction Target Arc */}
            <path d="M 104 150 A 40 40 0 0 0 124 144" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrowP6)" />
            <text x="126" y="140" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">30° Range</text>

            {/* Abducting Right Leg (Rotates out to side from hip joint) */}
            <g className="p6-moving-leg">
              <line x1="104" y1="110" x2="104" y2="138" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="104" cy="138" r="3" fill="#059669" />
              <line x1="104" y1="138" x2="104" y2="165" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              <circle cx="104" cy="165" r="3" fill="#10b981" />
            </g>

            {/* Right Hip Joint Node */}
            <circle cx="104" cy="110" r="4.5" fill="#059669" stroke="#ffffff" strokeWidth="1.5" />

            {/* Coaching notes */}
            <text x="60" y="130" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Level Pelvis</text>
            <text x="60" y="138" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">(No Lean)</text>
          </svg>
        );

      case 7:
        // Protocol 7: Lumbar Spine Flexion & Hip Hinge - Side Profile View
        // Soft knees, hips shift posterior, spine stays 100% flat (neutral lumbar spine)
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP7" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            {/* Ground Line */}
            <line x1="30" y1="165" x2="170" y2="165" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

            {/* Planted Foot */}
            <line x1="94" y1="164" x2="124" y2="164" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />

            {/* Soft Knee Shin (Ankle -> Soft Knee maintaining 15° bend) */}
            <line x1="106" y1="164" x2="114" y2="136" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <circle cx="114" cy="136" r="3.5" fill="#475569" />

            {/* Thigh (Soft Knee -> Posterior Shifting Hips) */}
            <line
              x1="114"
              y1="136"
              x2="106"
              y2="106"
              stroke="#475569"
              strokeWidth="4"
              strokeLinecap="round"
            >
              <animate
                attributeName="x2"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="106; 106; 78; 78; 106"
              />
              <animate
                attributeName="y2"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="106; 106; 114; 114; 106"
              />
            </line>

            {/* Flat Neutral Spine (Hinges from hip; head to pelvis stays in perfectly straight line) */}
            <path
              fill="none"
              stroke="#059669"
              strokeWidth="4.5"
              strokeLinecap="round"
              d="M 106 106 L 106 52"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 106 106 L 106 52;
                  M 106 106 L 106 52;
                  M 78 114 L 120 78;
                  M 78 114 L 120 78;
                  M 106 106 L 106 52
                "
              />
            </path>

            {/* Straight Spine Alignment Reference Rod (Highlights that back NEVER hunches) */}
            <path
              fill="none"
              stroke="#86efac"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              d="M 106 112 L 106 46"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 106 112 L 106 46;
                  M 106 112 L 106 46;
                  M 72 120 L 126 72;
                  M 72 120 L 126 72;
                  M 106 112 L 106 46
                "
              />
            </path>

            {/* Hanging Plumb Line Arms (Hang naturally straight down from shoulder) */}
            <path
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              d="M 106 54 L 106 94"
            >
              <animate
                attributeName="d"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="
                  M 106 54 L 106 94;
                  M 106 54 L 106 94;
                  M 120 78 L 120 118;
                  M 120 78 L 120 118;
                  M 106 54 L 106 94
                "
              />
            </path>

            {/* Head (Maintains neutral cervical spine aligned with torso) */}
            <circle cx="106" cy="34" r="13" fill="#f8fafc" stroke="#059669" strokeWidth="3">
              <animate
                attributeName="cx"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="106; 106; 128; 128; 106"
              />
              <animate
                attributeName="cy"
                dur="3.4s"
                repeatCount="indefinite"
                keyTimes="0; 0.15; 0.50; 0.65; 1"
                values="34; 34; 68; 68; 34"
              />
            </circle>

            {/* Posterior Hip Push Cue Arrow */}
            <path d="M 88 100 L 72 104" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowP7)" />
            <text x="32" y="96" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Push Hips Back</text>
            <text x="32" y="106" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">Flat Back Guard</text>
          </svg>
        );

      case 8:
      default:
        // Protocol 8: Carpal Tunnel Wrist & Forearm Extension - Side View on Table
        // Forearm stays glued flat to desk; hand cleanly bends upward at radiocarpal joint (70° extension)
        return (
          <svg viewBox="0 0 200 180" className="w-full h-full select-none">
            <defs>
              <marker id="arrowP8" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#059669" />
              </marker>
            </defs>
            <style>{`
              @keyframes p8WristExtend {
                0%, 15% { transform: rotate(0deg); }
                50%, 65% { transform: rotate(-65deg); }
                100% { transform: rotate(0deg); }
              }
              .p8-moving-hand {
                transform-origin: 105px 104px;
                animation: p8WristExtend 3.0s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}</style>
            {/* Table / Desk Surface */}
            <rect x="20" y="108" width="160" height="8" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="20" y1="116" x2="180" y2="116" stroke="#94a3b8" strokeWidth="2" />
            <text x="24" y="132" fill="#94a3b8" fontSize="8" fontFamily="sans-serif">Desk Support Surface</text>

            {/* Forearm Flat On Desk (Arm stays anchored) */}
            <path d="M 32 104 L 105 104" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
            {/* Forearm Anchor Indicator */}
            <rect x="42" y="86" width="56" height="14" rx="3" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            <text x="46" y="96" fill="#64748b" fontSize="7" fontWeight="bold" fontFamily="sans-serif">Forearm Glued</text>

            {/* 70° Extension Target Arc */}
            <path d="M 148 104 A 44 44 0 0 0 126 65" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrowP8)" />
            <text x="132" y="58" fill="#059669" fontSize="9" fontWeight="bold" fontFamily="sans-serif">70° Extension</text>

            {/* Animated Hand & Fingers (Pivots smoothly upward at wrist joint) */}
            <g className="p8-moving-hand">
              {/* Palm / Metacarpals */}
              <line x1="105" y1="104" x2="140" y2="104" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
              {/* Knuckles & Fingers */}
              <line x1="140" y1="104" x2="158" y2="104" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="158" cy="104" r="3" fill="#059669" />
              {/* Thumb */}
              <path d="M 118 104 L 126 97" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {/* Radiocarpal (Wrist) Pivot Node */}
            <circle cx="105" cy="104" r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />

            {/* Decompression notice */}
            <text x="96" y="146" fill="#059669" fontSize="8" fontWeight="bold" fontFamily="sans-serif">Carpal Tunnel Decompression</text>
            <text x="96" y="156" fill="#64748b" fontSize="7.5" fontFamily="sans-serif">No Forearm Lifting</text>
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

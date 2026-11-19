import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing
} from 'remotion';

/**
 * PhysioPulse AI - 20-Second 1080p 30 FPS Cinematic Concept Animation
 * Built for Aarambhathon • Problem Statement 6: "AI for Smarter Healthcare"
 * Team: Ctrl Alt Elite
 * 
 * Timeline (30 FPS, 600 frames total = 20s):
 *  - 0s - 4.5s  (Frames 0-135): Doctor Prescription Ingestion & AI Session Planning
 *  - 4.5s - 15s (Frames 135-450): Live Vision Studio, Goniometer 0->128°, 8s Scapular Shrug & Voice Coach
 *  - 15s - 16.5s(Frames 450-495): Clinical Telemetry & Doctor Ledger
 *  - 16.5s - 20s(Frames 495-600): Outro: Logo + Team Ctrl Alt Elite
 */

export const PhysioPulsePromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // =========================================================================
  // KINEMATICS & GONIOMETER TIMINGS (All mathematically derived from frame)
  // =========================================================================
  
  // Angle interpolation:
  // Phase A (4.5s to 7.8s = frames 135 to 234): Smooth rise 0 -> 78 deg
  // Phase B (8.0s to 10.3s = frames 240 to 310): Stalls / wobbles around 80-82 deg during shrug
  // Phase C (10.5s to 14.5s = frames 315 to 435): Cleans up and drives cleanly to 128 deg
  let currentAngle = 0;
  if (frame < 135) {
    currentAngle = 0;
  } else if (frame < 235) {
    currentAngle = interpolate(frame, [135, 235], [0, 78], {
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
  } else if (frame < 315) {
    // Shrug period - angle fluctuates slightly around 80-82 deg
    const wobble = Math.sin((frame - 235) * 0.4) * 2.2;
    currentAngle = interpolate(frame, [235, 315], [78, 83], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }) + wobble;
  } else if (frame < 440) {
    // Post-correction clean drive to 128 deg
    currentAngle = interpolate(frame, [315, 435], [83, 128], {
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    });
  } else {
    currentAngle = 128;
  }

  const targetAngle = 140; // 140 deg target for rotator cuff abduction
  const roundedAngle = Math.round(currentAngle);
  
  // Progress bar fill: 0 to 91.4% (128 / 140)
  const targetProgressPct = Math.min(100, (currentAngle / targetAngle) * 100);

  // =========================================================================
  // 8.0s SCAPULAR SHRUG TRIGGER (Frame 240 = 8.0s)
  // =========================================================================
  const isShrugActive = frame >= 240 && frame < 325; // 8.0s to 10.8s
  const shrugFlash = isShrugActive ? Math.sin((frame - 240) * 0.45) > 0 : false;
  
  // Voice Coach banner opacity and bounce
  const voiceBannerOpacity = interpolate(
    frame,
    [240, 248, 320, 335],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const voiceBannerY = interpolate(
    frame,
    [240, 248, 320, 335],
    [30, 0, 0, -20],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Arm & Shoulder Kinematics for SVG Stickman
  // When shrugging, shoulder node translates upward by up to 18px
  const shoulderShrugOffset = interpolate(
    frame,
    [235, 250, 305, 325],
    [0, -18, -18, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Reps count: increments from 7 to 8 after 13.5s (frame 405)
  const currentReps = frame >= 405 ? 8 : 7;

  // =========================================================================
  // STAGE TRANSITIONS
  // =========================================================================
  // Stage 1 (Prescription -> Session Plan): frames 0 to 135
  const stage1Opacity = interpolate(frame, [0, 10, 120, 135], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const stage1Scale = interpolate(frame, [120, 135], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Prescription -> Plan Card Morph (at frame 65-95 = 2.1s - 3.1s)
  const cardFlip = interpolate(frame, [60, 85], [0, 180], {
    easing: Easing.bezier(0.4, 0, 0.2, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const isCardFlipped = cardFlip >= 90;
  
  // AI Scan line position (frames 25 to 65)
  const scanProgress = interpolate(frame, [25, 65], [-10, 110], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Stage 2 (Live Vision Studio): frames 130 to 480
  const stage2Opacity = interpolate(frame, [130, 145, 475, 490], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Stage 3 (Clinical Telemetry Toast): frames 430 to 485
  const stage3Opacity = interpolate(frame, [430, 442, 475, 485], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  // Stage 4 (Outro Logo + Team Ctrl Alt Elite): frames 485 to 600
  const stage4Opacity = interpolate(frame, [485, 505], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const stage4Scale = interpolate(frame, [485, 520], [0.92, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: '#090E1A',
        color: '#FFFFFF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Dynamic Background Mesh & Ambient Emerald Lighting */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: 200,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: isShrugActive
            ? 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(9,14,26,0) 70%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(9,14,26,0) 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          transition: 'background 0.3s ease'
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          bottom: -200,
          left: 100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.12) 0%, rgba(9,14,26,0) 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Blueprint Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      />

      {/* PERSISTENT TOP HEADER BAR */}
      <div
        style={{
          height: 84,
          padding: '0 64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(16px)',
          zIndex: 50,
          position: 'relative'
        }}
      >
        {/* Brand Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)'
            }}
          >
            <svg width="26" height="24" viewBox="0 0 46 40" fill="none">
              <path
                d="M28.7783 0C30.2444 0 31.5988 0.769 32.3262 2.015L45.1709 24.02C46.5414 26.37 46.137 29.327 44.1836 31.24L36.4326 38.828C35.6405 39.567 34.6309 40 33.543 40H12.4131C11.3332 39.974 10.3035 39.592 9.52346 38.828L1.77248 31.24C-0.141664 29.366 -0.560192 26.327 0.785179 24.02L13.6299 2.015C14.3574 0.769 15.7116 0 17.1778 0H28.7783Z"
                fill="#10B981"
              />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                PhysioPulse
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  letterSpacing: '0.05em'
                }}
              >
                AI
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Autonomous Telerehabilitation &amp; RTM
            </span>
          </div>
        </div>

        {/* Center Live Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isShrugActive ? '#EF4444' : '#10B981',
                boxShadow: isShrugActive ? '0 0 12px #EF4444' : '0 0 12px #10B981'
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', color: '#E2E8F0' }}>
              {frame < 135
                ? 'STAGE 1: PRESCRIPTION INGESTION'
                : frame < 460
                ? 'STAGE 2: LIVE 30 FPS KINEMATICS'
                : 'STAGE 3: TELEMETRY & VERIFICATION'}
            </span>
          </div>

          <div style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'monospace' }}>
            FPS: 31.4 | LATENCY: 14.8ms | WEBCAM 1080P
          </div>
        </div>

        {/* Small "Concept animation" Label (Required by Prompt) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.15)'
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#10B981'
            }}
          >
            Concept animation
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* STAGE 1: PRESCRIPTION INGESTION -> SESSION PLAN (Frames 0 - 135)    */}
      {/* =================================================================== */}
      {stage1Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '84px 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage1Opacity,
            transform: `scale(${stage1Scale})`,
            zIndex: 20
          }}
        >
          {/* Section Subhead */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 36
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 20,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#10B981',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: 14
              }}
            >
              Multimodal Medical OCR Engine
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Turn Doctor Prescriptions Into Executable Circuits
            </h2>
            <p style={{ fontSize: 16, color: '#94A3B8', marginTop: 8 }}>
              Photographed discharge notes and MRI summaries are decoded into clinical ROM bounds.
            </p>
          </div>

          {/* 3D Perspective Flip Container */}
          <div
            style={{
              width: 820,
              height: 480,
              perspective: 1200,
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${cardFlip}deg)`
              }}
            >
              {/* FRONT: PHOTOGRAPHED DOCTOR PRESCRIPTION */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  borderRadius: 24,
                  padding: '36px 44px',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  overflow: 'hidden'
                }}
              >
                {/* AI Laser Scan Line Effect */}
                {scanProgress >= 0 && scanProgress <= 100 && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: `${scanProgress}%`,
                        height: 3,
                        background: 'linear-gradient(90deg, transparent, #10B981, transparent)',
                        boxShadow: '0 0 18px 4px #10B981',
                        zIndex: 10
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: `${scanProgress}%`,
                        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, transparent 100%)',
                        zIndex: 9
                      }}
                    />
                  </>
                )}

                {/* Prescription Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>
                        DR. EMILY VANCE, MD • ORTHOPEDIC SURGERY
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        Metro Orthopedic Institute • License #NY-84920
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      ICD-10: M75.122
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18, fontSize: 13, color: '#475569' }}>
                    <div>
                      <strong>Patient:</strong> Mritunjay Mishra (Age 24)
                    </div>
                    <div>
                      <strong>Date:</strong> November 14, 2026
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <strong>Diagnosis:</strong> Post-Rotator Cuff Surgical Repair (Left Shoulder)
                    </div>
                  </div>
                </div>

                {/* Handwritten / Clinical Directives */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px dashed #CBD5E1',
                    borderRadius: 14,
                    padding: '20px 24px',
                    margin: '16px 0'
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                    Physical Therapy Prescription &amp; Kinetic Boundaries
                  </div>
                  <div style={{ fontSize: 15, color: '#1E293B', lineHeight: 1.6, fontStyle: 'italic' }}>
                    &ldquo;Initiate progressive active-assisted abduction (0° to 90°, target 140°). 
                    <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '1px 6px', borderRadius: 4, fontWeight: 600, margin: '0 4px' }}>
                      Strictly avoid scapular shrug
                    </span>
                    and momentum substitution. Follow with bilateral wall slides &amp; cervical posture alignment.&rdquo;
                  </div>
                </div>

                {/* Card Bottom: AI Parsing Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
                      {scanProgress > 50 ? '✓ Gemini 2.5 Flash: Extracted 3 Protocols' : 'Scanning clinical document...'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    Confidence: 99.4%
                  </div>
                </div>
              </div>

              {/* BACK: MORPHED CLINICAL SESSION PLAN */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  borderRadius: 24,
                  padding: '36px 44px',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 10,
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#10B981'
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>
                          Auto-Planned Kinetic Session
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8' }}>
                          Custom Routine for Mritunjay Mishra
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#10B981',
                        fontSize: 11,
                        fontWeight: 700
                      }}
                    >
                      3 Protocols Verified
                    </div>
                  </div>

                  {/* 3 Protocols List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                    {/* Protocol 1 (Active) */}
                    <div
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 12,
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '4px 8px', borderRadius: 6 }}>
                          P1
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700 }}>
                            Frozen Shoulder Abduction
                          </div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>
                            Target: 0° → 140° • 10 Reps • Shrug Watch Active
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981' }}>
                        ACTIVE QUEUE
                      </span>
                    </div>

                    {/* Protocol 2 */}
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 12,
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '4px 8px', borderRadius: 6 }}>
                          P5
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>
                            Bilateral Overhead Wall Slide
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            Target: 120° Symmetry • 10 Reps
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748B' }}>Next in queue</span>
                    </div>

                    {/* Protocol 3 */}
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 12,
                        padding: '12px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '4px 8px', borderRadius: 6 }}>
                          P3
                        </span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>
                            Cervical Posture &amp; Neck Guard
                          </div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>
                            Target: 90° Collinear • 12 Reps
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748B' }}>Final Anchor</span>
                    </div>
                  </div>
                </div>

                {/* Action Launch Bar */}
                <div
                  style={{
                    backgroundColor: '#10B981',
                    borderRadius: 12,
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    fontWeight: 800,
                    fontSize: 14,
                    color: '#FFFFFF',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <span>Launching On-Device Vision Studio</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 2: LIVE VISION STUDIO & GONIOMETER KINEMATICS (Frames 130-480)*/}
      {/* =================================================================== */}
      {stage2Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '84px 0 0 0',
            padding: '36px 64px 48px',
            display: 'grid',
            gridTemplateColumns: '1.25fr 0.75fr',
            gap: 40,
            opacity: stage2Opacity,
            zIndex: 15
          }}
        >
          {/* LEFT: 3D KINEMATIC CAMERA VIEWPORT */}
          <div
            style={{
              backgroundColor: '#0F172A',
              border: isShrugActive
                ? '2px solid #EF4444'
                : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 24,
              boxShadow: isShrugActive
                ? '0 0 40px rgba(239, 68, 68, 0.25)'
                : '0 20px 50px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border 0.2s ease'
            }}
          >
            {/* Viewport Top HUD Strip */}
            <div
              style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: isShrugActive ? '#EF4444' : '#10B981',
                    boxShadow: isShrugActive ? '0 0 10px #EF4444' : '0 0 10px #10B981'
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>
                  P1: FROZEN SHOULDER ABDUCTION
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    color: '#94A3B8'
                  }}
                >
                  33 LANDMARKS @ 30+ FPS
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>
                  REPS: <strong style={{ color: '#FFFFFF', fontSize: 14 }}>{currentReps}</strong> / 10
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: isShrugActive ? '#EF4444' : '#10B981',
                    backgroundColor: isShrugActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    padding: '3px 10px',
                    borderRadius: 6,
                    border: isShrugActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {isShrugActive ? 'COMPENSATION ACTIVE' : 'CLEAN TRAJECTORY'}
                </div>
              </div>
            </div>

            {/* Main Kinematic Visual Canvas */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.9) 100%)'
              }}
            >
              {/* Grid Lines on Floor */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 60,
                  width: '80%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)'
                }}
              />

              {/* BIOMECHANICAL SKELETON FIGURE (SVG) */}
              <svg width="460" height="460" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="vectorEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                  <linearGradient id="vectorRose" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F87171" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>

                {/* Head */}
                <circle cx="150" cy="65" r="22" fill="#1E293B" stroke="#94A3B8" strokeWidth="2.5" />
                <circle cx="144" cy="63" r="2.5" fill="#94A3B8" />
                <circle cx="156" cy="63" r="2.5" fill="#94A3B8" />

                {/* Cervical Spine (Neck) */}
                <line x1="150" y1="87" x2="150" y2="105" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                {/* Torso Spine */}
                <line x1="150" y1="105" x2="150" y2="195" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

                {/* Pelvis */}
                <line x1="130" y1="195" x2="170" y2="195" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

                {/* Legs */}
                <line x1="130" y1="195" x2="125" y2="280" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="170" y1="195" x2="175" y2="280" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />

                {/* Left Arm (Resting) */}
                <line x1="120" y1="105" x2="110" y2="185" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                <circle cx="110" cy="185" r="4" fill="#475569" />

                {/* Shoulders Bar (Reacts to Shrug: right shoulder elevates!) */}
                <line
                  x1="120"
                  y1="105"
                  x2="180"
                  y2={105 + shoulderShrugOffset}
                  stroke={isShrugActive ? '#EF4444' : '#94A3B8'}
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Right Shoulder Landmark Node (12) */}
                <circle
                  cx="180"
                  cy={105 + shoulderShrugOffset}
                  r="6"
                  fill={isShrugActive ? '#EF4444' : '#10B981'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  filter={isShrugActive ? 'drop-shadow(0 0 8px #EF4444)' : 'drop-shadow(0 0 8px #10B981)'}
                />

                {/* Shrug Warning Arrow / Highlight when active */}
                {isShrugActive && (
                  <g>
                    <path
                      d="M 194 115 L 194 92"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow)"
                    />
                    <text x="204" y="104" fill="#EF4444" fontSize="10" fontWeight="bold">
                      TRAP ELEVATION +14%
                    </text>
                  </g>
                )}

                {/* Right Arm: Glenohumeral Abduction Vector */}
                {/* Math for arm rotation by currentAngle */}
                {(() => {
                  const rad = (currentAngle * Math.PI) / 180;
                  const armLength = 76;
                  // Arm starts pointing down (dx = 0, dy = armLength), rotates clockwise/outward to side
                  const elbowX = 180 + Math.sin(rad) * armLength;
                  const elbowY = 105 + shoulderShrugOffset + Math.cos(rad) * armLength;
                  
                  // Forearm extends collinear or slight elbow extension
                  const wristX = 180 + Math.sin(rad) * (armLength * 1.85);
                  const wristY = 105 + shoulderShrugOffset + Math.cos(rad) * (armLength * 1.85);

                  return (
                    <g>
                      {/* Range of Motion Ghost Arc (0° to 140°) */}
                      <path
                        d="M 180 181 A 76 76 0 0 1 121 56"
                        fill="none"
                        stroke="rgba(16, 185, 129, 0.15)"
                        strokeWidth="18"
                      />
                      
                      {/* Active Vector */}
                      <line
                        x1="180"
                        y1={105 + shoulderShrugOffset}
                        x2={elbowX}
                        y2={elbowY}
                        stroke={isShrugActive ? 'url(#vectorRose)' : 'url(#vectorEmerald)'}
                        strokeWidth="5"
                        strokeLinecap="round"
                      />

                      {/* Elbow Landmark (14) */}
                      <circle
                        cx={elbowX}
                        cy={elbowY}
                        r="5"
                        fill={isShrugActive ? '#EF4444' : '#10B981'}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />

                      {/* Forearm */}
                      <line
                        x1={elbowX}
                        y1={elbowY}
                        x2={wristX}
                        y2={wristY}
                        stroke={isShrugActive ? 'url(#vectorRose)' : 'url(#vectorEmerald)'}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Wrist Landmark (16) */}
                      <circle
                        cx={wristX}
                        cy={wristY}
                        r="5"
                        fill="#FFFFFF"
                        stroke={isShrugActive ? '#EF4444' : '#10B981'}
                        strokeWidth="2"
                      />

                      {/* Floating Angle Flag beside wrist */}
                      <g transform={`translate(${wristX + 14}, ${wristY - 10})`}>
                        <rect
                          x="0"
                          y="0"
                          width="58"
                          height="24"
                          rx="6"
                          fill={isShrugActive ? '#EF4444' : '#10B981'}
                        />
                        <text
                          x="29"
                          y="16"
                          fill="#FFFFFF"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {roundedAngle}°
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>

              {/* RED "SCAPULAR SHRUG DETECTED" BANNER (Flashes at 8.0s) */}
              {isShrugActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    right: 24,
                    backgroundColor: shrugFlash ? 'rgba(239, 68, 68, 0.95)' : 'rgba(220, 38, 38, 0.85)',
                    border: '2px solid #FCA5A5',
                    borderRadius: 16,
                    padding: '16px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 30
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: '#FFFFFF',
                        color: '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        fontWeight: 900
                      }}
                    >
                      ⚠️
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                        SCAPULAR SHRUG DETECTED
                      </div>
                      <div style={{ fontSize: 13, color: '#FEE2E2', fontWeight: 500 }}>
                        Upper trapezius substitution +14% • Drop shoulder &amp; isolate deltoid
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '6px 14px',
                      backgroundColor: '#FFFFFF',
                      color: '#B91C1C',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 800
                    }}
                  >
                    ↓ LOWER SHOULDER
                  </div>
                </div>
              )}

              {/* VOICE COACH CAPTION BANNER (Sub-18ms Feedback) */}
              {voiceBannerOpacity > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 36,
                    right: 36,
                    opacity: voiceBannerOpacity,
                    transform: `translateY(${voiceBannerY}px)`,
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: 16,
                    padding: '14px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 30
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18
                    }}
                  >
                    🔊
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      VoiceCoach Audio Biofeedback
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>
                      &ldquo;Keep elbow straight — avoid shoulder shrug!&rdquo;
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME GONIOMETER & REHAB VITALS CARD */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20
            }}
          >
            {/* Goniometer Card (Matches Landing Page Design) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '28px 32px',
                color: '#0F172A',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                border: '1px solid #E2E8F0',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Live Goniometer
                </span>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: isShrugActive ? '#EF4444' : '#10B981',
                    boxShadow: isShrugActive ? '0 0 10px #EF4444' : '0 0 10px #10B981'
                  }}
                />
              </div>

              {/* Large Digital Angle Display */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 16 }}>
                <span
                  style={{
                    fontSize: 64,
                    fontWeight: 900,
                    color: isShrugActive ? '#EF4444' : '#0F172A',
                    letterSpacing: '-0.04em',
                    fontFamily: 'monospace'
                  }}
                >
                  {roundedAngle}°
                </span>
                <span style={{ fontSize: 20, color: '#64748B', fontWeight: 700, fontFamily: 'monospace' }}>
                  / {targetAngle}°
                </span>
              </div>

              {/* Goniometer Fill Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#F1F5F9',
                  overflow: 'hidden',
                  marginTop: 18,
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${targetProgressPct}%`,
                    borderRadius: 8,
                    background: isShrugActive
                      ? 'linear-gradient(90deg, #F87171, #EF4444)'
                      : 'linear-gradient(90deg, #34D399, #10B981)',
                    transition: 'width 0.05s linear'
                  }}
                />
              </div>

              {/* Status Pill Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                  ROM Completion: {Math.round(targetProgressPct)}%
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 6,
                    backgroundColor: isShrugActive
                      ? '#FEE2E2'
                      : roundedAngle >= 125
                      ? '#D1FAE5'
                      : '#E0E7FF',
                    color: isShrugActive
                      ? '#B91C1C'
                      : roundedAngle >= 125
                      ? '#065F46'
                      : '#3730A3'
                  }}
                >
                  {isShrugActive
                    ? 'ADJUST FORM'
                    : roundedAngle >= 125
                    ? '✓ TARGET REACHED'
                    : 'IN MOTION'}
                </span>
              </div>
            </div>

            {/* Kinetic Biomechanical Vitals */}
            <div
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 20,
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                backdropFilter: 'blur(12px)'
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Biomechanical Safeguards
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#CBD5E1' }}>Bilateral Symmetry:</span>
                <strong style={{ fontSize: 15, color: '#10B981', fontFamily: 'monospace' }}>
                  96.2% Normal
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#CBD5E1' }}>Scapular Shrug Index:</span>
                <strong
                  style={{
                    fontSize: 15,
                    color: isShrugActive ? '#EF4444' : '#10B981',
                    fontFamily: 'monospace'
                  }}
                >
                  {isShrugActive ? '14% (Alert >10%)' : '4.1% (Safe)'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#CBD5E1' }}>Lateral Trunk Lean:</span>
                <strong style={{ fontSize: 15, color: '#10B981', fontFamily: 'monospace' }}>
                  2.4° (Normal &lt;10°)
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: '#CBD5E1' }}>Signal Stabilization:</span>
                <strong style={{ fontSize: 15, color: '#10B981', fontFamily: 'monospace' }}>
                  1-Euro Low-Pass Filter
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 3: CLINICAL SESSION REPORT & CPT TOAST (Frames 430 - 485)     */}
      {/* =================================================================== */}
      {stage3Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 64,
            width: 520,
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            borderRadius: 20,
            padding: '24px 28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px #E2E8F0',
            opacity: stage3Opacity,
            zIndex: 40
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ✓ Session Completed
            </span>
            <span style={{ fontSize: 11, color: '#64748B' }}>
              1-Click PDF Ready
            </span>
          </div>

          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            Official Doctor Summary Generated
          </div>
          <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
            Peak ROM: <strong>128° achieved</strong> • Bilateral Symmetry: <strong>96%</strong> • Compensations: <strong>1 caught &amp; corrected</strong>.
          </div>

          <div
            style={{
              marginTop: 14,
              padding: '8px 12px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              color: '#065F46',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>CMS RTM Transmission Eligible</span>
            <span>CPT 98975 / 98977</span>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* STAGE 4: HERO OUTRO: LOGO + TEAM CTRL ALT ELITE (Frames 485 - 600)  */}
      {/* =================================================================== */}
      {stage4Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '84px 0 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: stage4Opacity,
            transform: `scale(${stage4Scale})`,
            zIndex: 50,
            backgroundColor: 'rgba(9, 14, 26, 0.95)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Glowing Animated Logomark */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 32,
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '2px solid rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px rgba(16, 185, 129, 0.4)',
              marginBottom: 32
            }}
          >
            <svg width="68" height="60" viewBox="0 0 46 40" fill="none">
              <path
                d="M28.7783 0C30.2444 0 31.5988 0.769 32.3262 2.015L45.1709 24.02C46.5414 26.37 46.137 29.327 44.1836 31.24L36.4326 38.828C35.6405 39.567 34.6309 40 33.543 40H12.4131C11.3332 39.974 10.3035 39.592 9.52346 38.828L1.77248 31.24C-0.141664 29.366 -0.560192 26.327 0.785179 24.02L13.6299 2.015C14.3574 0.769 15.7116 0 17.1778 0H28.7783Z"
                fill="#10B981"
              />
            </svg>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#FFFFFF'
            }}
          >
            PhysioPulse{' '}
            <span style={{ color: '#10B981' }}>AI</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 24,
              color: '#94A3B8',
              marginTop: 12,
              marginBottom: 28,
              fontWeight: 500
            }}
          >
            Transforming standard webcams into 3D biomechanical kinematic sensors
          </p>

          {/* TEAM CTRL ALT ELITE BADGE */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 32px',
              borderRadius: 999,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10B981',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
              marginBottom: 36
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.12em', color: '#10B981', textTransform: 'uppercase' }}>
              TEAM CTRL ALT ELITE
            </span>
          </div>

          {/* Track Tag & Specs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              fontSize: 14,
              color: '#64748B',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: 24
            }}
          >
            <span>AARAMBHATHON • PROBLEM STATEMENT 6: AI FOR SMARTER HEALTHCARE</span>
            <span>•</span>
            <span style={{ color: '#E2E8F0' }}>$0 Extra Hardware</span>
            <span>•</span>
            <span style={{ color: '#E2E8F0' }}>100% On-Device Privacy</span>
            <span>•</span>
            <span style={{ color: '#E2E8F0' }}>30+ FPS Kinematics</span>
          </div>
        </div>
      )}
    </div>
  );
};

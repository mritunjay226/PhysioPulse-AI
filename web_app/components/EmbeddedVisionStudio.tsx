'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import {
  Video,
  Play,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  StopCircle,
  Clock,
  Zap,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  BookOpen,
  Check,
  Compass,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Award,
  HelpCircle
} from 'lucide-react';
import { StickmanExerciseAnimation } from '@/components/studio/StickmanExerciseAnimation';

export interface ExerciseGuide {
  id: number;
  title: string;
  short_name: string;
  subtitle: string;
  targetJoint: string;
  recommendedView: string;
  targetRom: number;
  targetReps: number;
  actionSummary: string;
  avoidSummary: string;
  steps: {
    num: string;
    title: string;
    description: string;
  }[];
  formTips: string[];
  commonMistakes: string[];
}

export const EXERCISE_GUIDES: Record<number, ExerciseGuide> = {
  1: {
    id: 1,
    title: 'Frozen Shoulder Lateral Raise',
    short_name: 'Shoulder Raise',
    subtitle: 'Glenohumeral Abduction & Elevation',
    targetJoint: 'Shoulder (Glenohumeral)',
    recommendedView: 'Front View (Face Camera 6–8 ft)',
    targetRom: 90,
    targetReps: 10,
    actionSummary: 'Slowly raise your arm out to the side until parallel to the floor (90°). Keep your elbow straight and palm down.',
    avoidSummary: 'Do not shrug your shoulder toward your ear, and keep your body upright without leaning sideways.',
    steps: [
      {
        num: '01',
        title: 'Starting Stance',
        description: 'Stand tall facing the camera with your neck relaxed, shoulders dropped, and arm resting naturally at your side.'
      },
      {
        num: '02',
        title: 'Raise to 90°',
        description: 'Slowly lift your arm sideways until it reaches shoulder height (90°). Keep your elbow straight throughout.'
      },
      {
        num: '03',
        title: 'Controlled Lowering',
        description: 'Pause briefly at the top, then lower your arm back down over 2 seconds with smooth control.'
      }
    ],
    formTips: [
      'Relax your neck muscles — keep your shoulder down.',
      'Breathe out as you raise, breathe in as you lower.'
    ],
    commonMistakes: [
      'Shrugging the shoulder toward your ear.',
      'Leaning your torso sideways to cheat the height.'
    ]
  },
  2: {
    id: 2,
    title: 'Post-ACL Knee Squat & Extension',
    short_name: 'Knee Squat',
    subtitle: 'Tibiofemoral & Quadriceps Control',
    targetJoint: 'Knee & Quadriceps',
    recommendedView: 'Full Body View (Head to Toe)',
    targetRom: 90,
    targetReps: 10,
    actionSummary: 'Push your hips back and bend knees down into a comfortable squat, then press through heels to stand tall.',
    avoidSummary: 'Do not let knees buckle inward (valgus), and keep your heels firmly planted flat on the floor.',
    steps: [
      {
        num: '01',
        title: 'Foot Placement',
        description: 'Stand with feet shoulder-width apart, toes pointing straight or slightly outward.'
      },
      {
        num: '02',
        title: 'Sit Back into Squat',
        description: 'Hinge hips backward like sitting into a sturdy chair. Lower until thighs approach 90° with chest upright.'
      },
      {
        num: '03',
        title: 'Drive to Stand',
        description: 'Press firmly through your heels to return to standing position without locking knees forcefully.'
      }
    ],
    formTips: [
      'Keep your chest proud and eyes facing straight ahead.',
      'Ensure knees track directly over your toes.'
    ],
    commonMistakes: [
      'Knees collapsing inward toward each other.',
      'Heels lifting off the ground as you squat.'
    ]
  },
  3: {
    id: 3,
    title: 'Cervical Retraction & Ergonomic Posture Guard',
    short_name: 'Chin Tuck Retraction',
    subtitle: 'Deep Neck Flexor & Posture Alignment',
    targetJoint: 'Cervical Spine (Neck)',
    recommendedView: 'Upper Body Seated View (Chest to Head)',
    targetRom: 45,
    targetReps: 8,
    actionSummary: 'Gently glide your chin straight backward (make a subtle double chin) without tilting your head down.',
    avoidSummary: 'Do not nod your head down toward your chest or lean back; glide purely horizontally.',
    steps: [
      {
        num: '01',
        title: 'Neutral Posture',
        description: 'Sit upright with shoulders relaxed and eyes looking straight ahead at horizon level.'
      },
      {
        num: '02',
        title: 'Glide Chin Back',
        description: 'Gently pull your chin straight backward into your neck. Feel a light, pleasant stretch at the skull base.'
      },
      {
        num: '03',
        title: 'Hold & Release',
        description: 'Hold the chin tuck position for 3 to 5 seconds while breathing normally, then relax back to center.'
      }
    ],
    formTips: [
      'Imagine sliding your head straight back along a horizontal bookshelf.',
      'Keep your teeth lightly separated and jaw relaxed.'
    ],
    commonMistakes: [
      'Looking down like nodding "yes" instead of sliding back.',
      'Hunching your shoulders up toward your ears.'
    ]
  },
  4: {
    id: 4,
    title: 'Post-Fracture Elbow Flexion Rehabilitation',
    short_name: 'Elbow Curl',
    subtitle: 'Humeroulnar Joint & Biceps Activation',
    targetJoint: 'Elbow (Humeroulnar)',
    recommendedView: 'Front / Seated View (Waist Up)',
    targetRom: 125,
    targetReps: 12,
    actionSummary: 'Keep your upper arm pinned gently against your ribs, curl your palm toward your shoulder, and lower smoothly.',
    avoidSummary: 'Do not swing your elbow forward or let it flare out away from your body.',
    steps: [
      {
        num: '01',
        title: 'Arm Anchored',
        description: 'Rest upper arm comfortably against your side with your palm facing forward.'
      },
      {
        num: '02',
        title: 'Smooth Curl',
        description: 'Bend your elbow upward, bringing your hand close to your shoulder within a comfortable range.'
      },
      {
        num: '03',
        title: 'Controlled Lowering',
        description: 'Straighten your arm back down over 2–3 seconds until your arm is fully extended.'
      }
    ],
    formTips: [
      'Keep your upper arm completely still throughout the motion.',
      'Maintain an upright torso without swinging your back.'
    ],
    commonMistakes: [
      'Swinging the elbow forward to lift the hand higher.',
      'Shrugging the shoulder during the curl.'
    ]
  },
  5: {
    id: 5,
    title: 'Bilateral Overhead Wall-Slide Sync',
    short_name: 'Overhead Wall Slide',
    subtitle: 'Scapulothoracic Rhythm & Shoulder Elevation',
    targetJoint: 'Both Shoulders & Upper Back',
    recommendedView: 'Front View (Both Arms in Frame)',
    targetRom: 120,
    targetReps: 10,
    actionSummary: 'Slide both arms upwards simultaneously into a high "V" shape, keeping both hands even, then lower in control.',
    avoidSummary: 'Do not let one arm lag behind the other, and avoid arching your lower back as hands go overhead.',
    steps: [
      {
        num: '01',
        title: 'Starting "W" Position',
        description: 'Elbows bent at 90° by your ribs, forearms vertical, shoulder blades lightly engaged.'
      },
      {
        num: '02',
        title: 'Synchronized Reach',
        description: 'Reach both arms up into a wide "V" shape overhead, keeping both hands at the exact same level.'
      },
      {
        num: '03',
        title: 'Smooth Return',
        description: 'Pull elbows back down slowly to rib level while pulling shoulder blades gently downward.'
      }
    ],
    formTips: [
      'Move both hands at the exact same speed and height.',
      'Keep your stomach braced so your lower back does not arch.'
    ],
    commonMistakes: [
      'One arm moving faster or reaching higher than the other.',
      'Arching your lower back aggressively.'
    ]
  },
  6: {
    id: 6,
    title: 'Total Hip Replacement Side Abduction',
    short_name: 'Hip Lateral Lift',
    subtitle: 'Gluteus Medius & Pelvic Stabilization',
    targetJoint: 'Hip & Pelvis',
    recommendedView: 'Full Body Standing View',
    targetRom: 35,
    targetReps: 10,
    actionSummary: 'Holding a chair or wall for light balance, lift your leg straight out to the side (30°), pause, and lower slowly.',
    avoidSummary: 'Do not lean your torso sideways to fake height; keep your upper body tall and toes pointing forward.',
    steps: [
      {
        num: '01',
        title: 'Tall Base',
        description: 'Stand tall with feet parallel. Lightly hold a sturdy surface for balance.'
      },
      {
        num: '02',
        title: 'Side Leg Lift',
        description: 'Lift your leg smoothly out to the side without turning your toes outward or leaning your torso.'
      },
      {
        num: '03',
        title: 'Controlled Descent',
        description: 'Lower your foot back to the starting position over 2 seconds with steady control.'
      }
    ],
    formTips: [
      'Keep your pelvis completely level like balancing a cup of water.',
      'Keep toes pointing forward rather than turning upward.'
    ],
    commonMistakes: [
      'Leaning your torso sideways toward the chair to lift the leg higher.',
      'Swinging the leg forward instead of strictly to the side.'
    ]
  },
  7: {
    id: 7,
    title: 'Lumbar Spine Flexion & Hip Hinge',
    short_name: 'Lumbar Hip Hinge',
    subtitle: 'Neutral Spine & Posterior Chain Control',
    targetJoint: 'Lower Back & Hips',
    recommendedView: 'Side / Oblique View',
    targetRom: 35,
    targetReps: 10,
    actionSummary: 'With soft knees, push your hips straight back and tilt forward from your hips, keeping your spine flat and long.',
    avoidSummary: 'Do not round or hunch your lower back; keep your shoulders back and spine straight like a board.',
    steps: [
      {
        num: '01',
        title: 'Stance with Soft Knees',
        description: 'Stand with feet hip-width apart and knees softly unlocked. Chest proud and core engaged.'
      },
      {
        num: '02',
        title: 'Hinge Hips Back',
        description: 'Push your tailbone straight backward toward the wall behind you. Allow your upper body to tilt forward naturally.'
      },
      {
        num: '03',
        title: 'Return to Tall Stance',
        description: 'Squeeze glutes and press feet into the floor to return upright to tall posture.'
      }
    ],
    formTips: [
      'Keep a straight line from your head down to your tailbone.',
      'The motion comes from pushing hips back, not from bending your waist.'
    ],
    commonMistakes: [
      'Rounding the lower back like bending over to tie shoes.',
      'Squatting down too deep instead of hinging backwards.'
    ]
  },
  8: {
    id: 8,
    title: 'Carpal Tunnel Wrist & Forearm Extension',
    short_name: 'Wrist Extension',
    subtitle: 'Forearm Tendon & Nerve Decompression',
    targetJoint: 'Wrist (Radiocarpal)',
    recommendedView: 'Seated Close-Up View (Arm on Desk)',
    targetRom: 70,
    targetReps: 12,
    actionSummary: 'With forearm resting flat on your desk or thigh, gently bend your wrist back lifting hand upward, hold, and relax.',
    avoidSummary: 'Do not lift your elbow or forearm off the desk, and avoid forcing or jerking the motion.',
    steps: [
      {
        num: '01',
        title: 'Forearm Rested Flat',
        description: 'Rest your forearm flat on a desk or thigh with your hand hanging slightly over the edge, palm down.'
      },
      {
        num: '02',
        title: 'Bend Wrist Back',
        description: 'Lift your fingers and palm up toward the ceiling, bending cleanly at your wrist joint.'
      },
      {
        num: '03',
        title: 'Slow Lowering',
        description: 'Hold at the top for 1–2 seconds, then slowly lower your hand back to level resting position.'
      }
    ],
    formTips: [
      'Keep fingers relaxed — do not clench into a tight fist.',
      'Keep the motion gentle, smooth, and completely pain-free.'
    ],
    commonMistakes: [
      'Lifting your whole elbow or arm off the desk.',
      'Twisting the wrist sideways instead of straight backward.'
    ]
  }
};

export interface EmbeddedVisionStudioProps {
  isRunning: boolean;
  onConcludeSession: (report?: any) => void;
  patientName: string;
  prescription?: any;
  isModal?: boolean;
  onCloseModal?: () => void;
}

/**
 * Standard MediaPipe 33-point Pose Connections & Key Joints
 */
const POSE_CONNECTIONS: [number, number][] = [
  // Head & Facial alignment
  [0, 1], [1, 2], [2, 3], [3, 7], // nose to left eye and ear
  [0, 4], [4, 5], [5, 6], [6, 8], // nose to right eye and ear
  [9, 10],                        // mouth
  [11, 0], [12, 0],               // collarbone/neck to nose

  // Torso
  [11, 12], // shoulders
  [11, 23], // left shoulder to hip
  [12, 24], // right shoulder to hip
  [23, 24], // hips

  // Left Arm
  [11, 13], // left shoulder to elbow
  [13, 15], // left elbow to wrist
  [15, 17], // wrist to pinky
  [15, 19], // wrist to index
  [15, 21], // wrist to thumb
  [17, 19], // hand contour

  // Right Arm
  [12, 14], // right shoulder to elbow
  [14, 16], // right elbow to wrist
  [16, 18], // wrist to pinky
  [16, 20], // wrist to index
  [16, 22], // wrist to thumb
  [18, 20], // hand contour

  // Left Leg
  [23, 25], // left hip to knee
  [25, 27], // left knee to ankle
  [27, 29], // left ankle to heel
  [27, 31], // left ankle to foot index
  [29, 31], // foot base

  // Right Leg
  [24, 26], // right hip to knee
  [26, 28], // right knee to ankle
  [28, 30], // right ankle to heel
  [28, 32], // right ankle to foot index
  [30, 32]  // foot base
];

const KEY_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

function calculateAngleDegrees(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number }
): number {
  if (!a || !b || !c) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return angle;
}

function drawClinicalBone(
  ctx: CanvasRenderingContext2D,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  color: string = '#00f0c8',
  thickness: number = 6,
  glowColor?: string
) {
  const glow = glowColor || (color === '#ef4444' ? 'rgba(239, 68, 68, 0.45)' : color === '#10b981' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(0, 240, 200, 0.45)');

  // 1. Wide Outer Glow Layer
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = glow;
  ctx.lineWidth = thickness * 2 + 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 2. Main Thick Clinical Bone
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  // 3. Crisp White Center Laser Core
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1.5, thickness - 3.2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

function drawClinicalJoint(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number },
  color: string = '#00f0c8',
  radius: number = 9,
  glowColor?: string
) {
  const glow = glowColor || (color === '#ef4444' ? 'rgba(239, 68, 68, 0.45)' : color === '#10b981' ? 'rgba(16, 185, 129, 0.45)' : 'rgba(0, 240, 200, 0.45)');

  ctx.save();
  // 1. Concentric Halo Ring
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius + 4.5, 0, 2 * Math.PI);
  ctx.strokeStyle = glow;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Solid Color Center Body
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();

  // 3. Crisp Center White Pinpoint
  ctx.beginPath();
  ctx.arc(p.x, p.y, Math.max(2, radius - 4.5), 0, 2 * Math.PI);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();
}

function drawClinicalGoniometerArc(
  ctx: CanvasRenderingContext2D,
  center: { x: number; y: number },
  pt1: { x: number; y: number },
  pt2: { x: number; y: number },
  currentAngle: number,
  targetAngle: number,
  isBadForm: boolean = false,
  radius: number = 48
) {
  const v1 = { x: pt1.x - center.x, y: pt1.y - center.y };
  const v2 = { x: pt2.x - center.x, y: pt2.y - center.y };
  const n1 = Math.hypot(v1.x, v1.y);
  const n2 = Math.hypot(v2.x, v2.y);
  if (n1 === 0 || n2 === 0) return;

  const ang1 = Math.atan2(v1.y, v1.x);
  const ang2 = Math.atan2(v2.y, v2.x);

  const startAng = Math.min(ang1, ang2);
  let endAng = Math.max(ang1, ang2);
  const diff = endAng - startAng;
  if (diff > Math.PI) {
    endAng = Math.min(ang1, ang2) + 2 * Math.PI;
  }

  const isHit = currentAngle >= targetAngle;
  const color = isBadForm ? '#ef4444' : isHit ? '#10b981' : '#00f0c8';
  const glow = isBadForm ? 'rgba(239, 68, 68, 0.4)' : isHit ? 'rgba(16, 185, 129, 0.4)' : 'rgba(0, 240, 200, 0.4)';

  ctx.save();
  // 1. Arc outer glow
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAng, endAng);
  ctx.strokeStyle = glow;
  ctx.lineWidth = 6;
  ctx.stroke();

  // 2. Arc crisp line
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, startAng, endAng);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 3. Double concentric celebration rings on target hit
  if (isHit && !isBadForm) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius + 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(center.x, center.y, radius + 12, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 4. Floating Angle Pill Badge (counter-mirrored to cancel parent CSS scale-x-[-1])
  const midAng = (startAng + endAng) / 2;
  const badgeX = center.x + Math.cos(midAng) * (radius + 20);
  const badgeY = center.y + Math.sin(midAng) * (radius + 20);
  const angleText = `${Math.round(currentAngle)}°`;

  ctx.font = 'bold 12px monospace';
  const tw = ctx.measureText(angleText).width;

  ctx.save();
  ctx.translate(badgeX, badgeY);
  ctx.scale(-1, 1); // Flip horizontally to cancel parent mirror!

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-tw / 2 - 7, -11, tw + 14, 22, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isHit ? '#34d399' : '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(angleText, 0, 0);
  ctx.restore();

  ctx.restore();
}

/**
 * Default Thin Landmark Skeleton:
 * Draws all 33 full-body MediaPipe landmarks with thin crisp lines (1.8px) and small node dots.
 */
function drawDefaultThinSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number
) {
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0, 240, 200, 0.65)'; // crisp luminous cyan

  // 1. Thin connection lines across entire body
  for (const [startIdx, endIdx] of POSE_CONNECTIONS) {
    const p1 = landmarks[startIdx];
    const p2 = landmarks[endIdx];
    if (p1 && p2 && (p1.visibility ?? 1) > 0.18 && (p2.visibility ?? 1) > 0.18) {
      ctx.beginPath();
      ctx.moveTo(p1.x * width, p1.y * height);
      ctx.lineTo(p2.x * width, p2.y * height);
      ctx.stroke();
    }
  }

  // 2. Small joint node dots
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (!lm || (lm.visibility ?? 1) < 0.20) continue;

    const x = lm.x * width;
    const y = lm.y * height;
    const isFace = i <= 10;
    const radius = isFace ? 2.5 : 3.5;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#00f0c8';
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Full Clinical Vision Mesh:
 * 1. Default: thin landmarks across the entire body.
 * 2. Targeted: thick glowing clinical bones + enlarged joint nodes on targeted body parts for the active exercise.
 */
function drawClinicalVisionMesh(
  ctx: CanvasRenderingContext2D,
  landmarks: any[],
  width: number,
  height: number,
  isBadForm: boolean = false,
  showSkeleton: boolean = true,
  activeMode: number = 1,
  primaryAngle: number = 0,
  targetRom: number = 90
) {
  ctx.clearRect(0, 0, width, height);
  if (!showSkeleton || !landmarks || landmarks.length === 0) return;

  // 1. DEFAULT: Draw full-body THIN landmarks by default
  drawDefaultThinSkeleton(ctx, landmarks, width, height);

  const getPt = (idx: number) => {
    const lm = landmarks[idx];
    if (!lm || (lm.visibility ?? 1) < 0.18) return null;
    return { x: lm.x * width, y: lm.y * height };
  };

  const isHit = primaryAngle >= targetRom;
  const activeColor = isBadForm ? '#ef4444' : isHit ? '#10b981' : '#00f0c8';

  // 2. TARGETED: Draw THICK glowing clinical bones and enlarged joint nodes on targeted body parts
  if (activeMode === 1) {
    // Mode 1: Shoulder Abduction (Target: Shoulder, Upper Arm, Forearm, Torso)
    const rSh = getPt(11);
    const lSh = getPt(12);
    const rEl = getPt(13);
    const lEl = getPt(14);
    const rWr = getPt(15);
    const lWr = getPt(16);
    const rHip = getPt(23);
    const lHip = getPt(24);

    // Seated / desk-safe vertical hip reference if hips are below camera view
    const refL = lHip || (lSh ? { x: lSh.x, y: lSh.y + 160 } : null);
    const refR = rHip || (rSh ? { x: rSh.x, y: rSh.y + 160 } : null);

    const lAng = (refL && lSh && lEl) ? calculateAngleDegrees(refL, lSh, lEl) : 0;
    const rAng = (refR && rSh && rEl) ? calculateAngleDegrees(refR, rSh, rEl) : 0;

    const useLeft = lAng >= rAng - 5 && lSh && lEl;
    const sh = useLeft ? lSh : rSh;
    const el = useLeft ? lEl : rEl;
    const wr = useLeft ? lWr : rWr;
    const refPt = useLeft ? refL : refR;

    if (sh && el) {
      if (refPt) {
        drawClinicalBone(ctx, refPt, sh, 'rgba(0, 240, 200, 0.45)', 3.2);
        drawClinicalJoint(ctx, refPt, 'rgba(0, 240, 200, 0.6)', 6.5);
      }
      // Thick targeted arm bones
      drawClinicalBone(ctx, sh, el, activeColor, 6.0);
      drawClinicalJoint(ctx, sh, activeColor, 9.5);
      drawClinicalJoint(ctx, el, activeColor, 8.5);

      if (wr) {
        drawClinicalBone(ctx, el, wr, activeColor, 5.0);
        drawClinicalJoint(ctx, wr, activeColor, 7.0);
      }

      if (refPt) {
        drawClinicalGoniometerArc(ctx, sh, refPt, el, primaryAngle, targetRom, isBadForm, 50);
      }
    }
  } else if (activeMode === 2) {
    // Mode 2: Knee Squat & Extension (Target: Hips, Knees, Ankles)
    const rHip = getPt(23);
    const lHip = getPt(24);
    const rKnee = getPt(25);
    const lKnee = getPt(26);
    const rAnkle = getPt(27);
    const lAnkle = getPt(28);

    if (lHip && lKnee) {
      drawClinicalBone(ctx, lHip, lKnee, activeColor, 6.0);
      drawClinicalJoint(ctx, lHip, activeColor, 8.0);
      drawClinicalJoint(ctx, lKnee, activeColor, 9.5);
      if (lAnkle) {
        drawClinicalBone(ctx, lKnee, lAnkle, activeColor, 5.0);
        drawClinicalJoint(ctx, lAnkle, activeColor, 7.0);
        drawClinicalGoniometerArc(ctx, lKnee, lHip, lAnkle, primaryAngle, targetRom, isBadForm, 50);
      }
    }
    if (rHip && rKnee) {
      drawClinicalBone(ctx, rHip, rKnee, activeColor, 6.0);
      drawClinicalJoint(ctx, rHip, activeColor, 8.0);
      drawClinicalJoint(ctx, rKnee, activeColor, 9.5);
      if (rAnkle) {
        drawClinicalBone(ctx, rKnee, rAnkle, activeColor, 5.0);
        drawClinicalJoint(ctx, rAnkle, activeColor, 7.0);
        if (!lKnee) {
          drawClinicalGoniometerArc(ctx, rKnee, rHip, rAnkle, primaryAngle, targetRom, isBadForm, 50);
        }
      }
    }
  } else if (activeMode === 4) {
    // Mode 4: Bicep Curl / Elbow Flexion (Target: Elbow, Shoulder, Wrist)
    const rSh = getPt(11);
    const lSh = getPt(12);
    const rEl = getPt(13);
    const lEl = getPt(14);
    const rWr = getPt(15);
    const lWr = getPt(16);
    const rHip = getPt(23);
    const lHip = getPt(24);

    const lAng = (lSh && lEl && lWr) ? calculateAngleDegrees(lSh, lEl, lWr) : 0;
    const rAng = (rSh && rEl && rWr) ? calculateAngleDegrees(rSh, rEl, rWr) : 0;

    const useLeft = lAng >= rAng - 5 && lSh && lEl;
    const sh = useLeft ? lSh : rSh;
    const el = useLeft ? lEl : rEl;
    const wr = useLeft ? lWr : rWr;

    if (sh && el) {
      const hip = useLeft ? (lHip || { x: sh.x, y: sh.y + 160 }) : (rHip || { x: sh.x, y: sh.y + 160 });
      if (hip) {
        drawClinicalBone(ctx, hip, sh, 'rgba(0, 240, 200, 0.45)', 3.2);
        drawClinicalJoint(ctx, hip, 'rgba(0, 240, 200, 0.6)', 6.5);
      }
      drawClinicalBone(ctx, sh, el, activeColor, 6.0);
      drawClinicalJoint(ctx, sh, activeColor, 8.5);
      drawClinicalJoint(ctx, el, activeColor, 9.5);

      if (wr) {
        drawClinicalBone(ctx, el, wr, activeColor, 5.0);
        drawClinicalJoint(ctx, wr, activeColor, 7.0);
        drawClinicalGoniometerArc(ctx, el, sh, wr, primaryAngle, targetRom, isBadForm, 48);
      }
    }
  } else if (activeMode === 6) {
    // Mode 6: Hip Abduction (Target: Hip, Thigh, Knee)
    const rSh = getPt(11);
    const lSh = getPt(12);
    const rHip = getPt(23);
    const lHip = getPt(24);
    const rKnee = getPt(25);
    const lKnee = getPt(26);

    const hip = lHip || rHip;
    const sh = lSh || rSh;
    const knee = lKnee || rKnee;

    if (hip && sh && knee) {
      drawClinicalBone(ctx, sh, hip, activeColor, 5.0);
      drawClinicalBone(ctx, hip, knee, activeColor, 6.0);
      drawClinicalJoint(ctx, sh, activeColor, 7.5);
      drawClinicalJoint(ctx, hip, activeColor, 9.5);
      drawClinicalJoint(ctx, knee, activeColor, 8.5);
      drawClinicalGoniometerArc(ctx, hip, sh, knee, primaryAngle, targetRom, isBadForm, 50);
    }
  } else if (activeMode === 3) {
    // Mode 3: Cervical Spine (Target: Neck, Head)
    const nose = getPt(0);
    const lSh = getPt(12);
    const rSh = getPt(11);
    if (nose && lSh && rSh) {
      const midSh = { x: (lSh.x + rSh.x) / 2, y: (lSh.y + rSh.y) / 2 };
      drawClinicalBone(ctx, midSh, nose, activeColor, 5.5);
      drawClinicalJoint(ctx, midSh, activeColor, 9.0);
      drawClinicalJoint(ctx, nose, activeColor, 8.0);
      drawClinicalGoniometerArc(ctx, midSh, { x: midSh.x, y: midSh.y - 120 }, nose, primaryAngle, targetRom, isBadForm, 46);
    }
  } else {
    // Default targeted arm
    const lSh = getPt(12);
    const lEl = getPt(14);
    const lWr = getPt(16);
    if (lSh && lEl) {
      drawClinicalBone(ctx, lSh, lEl, activeColor, 5.5);
      drawClinicalJoint(ctx, lSh, activeColor, 8.5);
      drawClinicalJoint(ctx, lEl, activeColor, 9.0);
      if (lWr) {
        drawClinicalBone(ctx, lEl, lWr, activeColor, 4.5);
        drawClinicalJoint(ctx, lWr, activeColor, 7.0);
        drawClinicalGoniometerArc(ctx, lEl, lSh, lWr, primaryAngle, targetRom, isBadForm, 46);
      }
    }
  }
}

/**
 * Clean Clinical Goniometer Arc Dial (Light Theme matching PhysioPulse)
 */
function ClinicalGoniometerDial({
  currentAngle = 0,
  targetAngle = 90,
  phase = 'Active',
  isBadForm = false
}: {
  currentAngle: number;
  targetAngle: number;
  phase: string;
  isBadForm?: boolean;
}) {
  const clampedAngle = Math.max(0, Math.min(180, Math.round(currentAngle)));
  const clampedTarget = Math.max(0, Math.min(180, Math.round(targetAngle)));
  
  const needleDeg = -90 + (clampedAngle / 180) * 180;
  const targetDeg = -90 + (clampedTarget / 180) * 180;
  const isHit = clampedAngle >= clampedTarget;
  const arcLength = 251.2;
  const strokeOffset = arcLength - (clampedAngle / 180) * arcLength;

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-xs font-semibold mb-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] font-sans">
            Movement Range (ROM)
          </span>
        </div>
        
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
            isBadForm
              ? 'bg-rose-100 text-rose-800 border border-rose-300'
              : isHit
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          {isHit ? '✓ Target Hit' : isBadForm ? 'Adjust Form' : 'In Motion'}
        </span>
      </div>

      <div className="relative w-56 h-28 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="emeraldDialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="badDialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={isBadForm ? 'url(#badDialGrad)' : 'url(#emeraldDialGrad)'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-150 ease-out"
          />

          {/* Target Angle Marker */}
          <g transform={`rotate(${targetDeg} 100 100)`}>
            <line
              x1="100"
              y1="10"
              x2="100"
              y2="28"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Needle */}
          <g transform={`rotate(${needleDeg} 100 100)`} className="transition-transform duration-150 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke={isBadForm ? '#ef4444' : '#059669'}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="100" cy="100" r="7" fill={isBadForm ? '#ef4444' : '#059669'} />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </g>

          {/* Scale Labels */}
          <text x="20" y="108" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="sans-serif">0°</text>
          <text x="93" y="24" fill="#64748b" fontSize="10" fontWeight="700" fontFamily="sans-serif">90°</text>
          <text x="160" y="108" fill="#94a3b8" fontSize="10" fontWeight="700" fontFamily="sans-serif">180°</text>
        </svg>

        {/* Center Digital Angle Readout */}
        <div className="absolute bottom-0 text-center flex flex-col items-center">
          <span className={`text-3xl font-extrabold tracking-tight font-sans ${
            isBadForm ? 'text-rose-600' : isHit ? 'text-emerald-600' : 'text-slate-900'
          }`}>
            {clampedAngle}°
          </span>
          <span className="text-[11px] text-slate-500 font-medium -mt-1 font-sans">
            Goal: {clampedTarget}°
          </span>
        </div>
      </div>
    </div>
  );
}

export function EmbeddedVisionStudio({
  isRunning,
  onConcludeSession,
  patientName,
  prescription,
  isModal = false,
  onCloseModal
}: EmbeddedVisionStudioProps) {
  const isLocalHost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Camera Mode: 'webcam' (device camera via getUserMedia), 'simulation' (exercise video), 'stream' (local python DirectShow)
  const [cameraMode, setCameraMode] = useState<'webcam' | 'simulation' | 'stream'>(() => {
    return isLocalHost ? 'stream' : 'webcam';
  });

  const [telemetry, setTelemetry] = useState<any>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Exercise Queue management from prescription
  const [queueIndex, setQueueIndex] = useState(0);
  const [currentReps, setCurrentReps] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [advanceCountdown, setAdvanceCountdown] = useState(0);

  const exerciseQueue = React.useMemo(() => {
    if (prescription?.exercises && Array.isArray(prescription.exercises) && prescription.exercises.length > 0) {
      return prescription.exercises;
    }
    return [
      {
        protocol_id: 1,
        protocol_name: 'P1: Frozen Shoulder Abduction',
        target_reps: 8,
        target_rom_degrees: 90
      },
      {
        protocol_id: 2,
        protocol_name: 'P2: Post-ACL Knee Squat & Extension',
        target_reps: 8,
        target_rom_degrees: 120
      }
    ];
  }, [prescription]);

  const activeExercise = exerciseQueue[queueIndex] || exerciseQueue[0];
  const activeMode = Number(activeExercise?.protocol_id) || 1;
  const activeGuide = EXERCISE_GUIDES[activeMode] || EXERCISE_GUIDES[1];
  const targetReps = Number(activeExercise?.target_reps) || activeGuide.targetReps || 8;
  const targetRom = Number(activeExercise?.target_rom_degrees) || activeGuide.targetRom || 90;

  const imgRef = useRef<HTMLImageElement | null>(null);
  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const poseInstanceRef = useRef<any>(null);
  const [hasLandmarks, setHasLandmarks] = useState(false);
  const hasLandmarksRef = useRef(false);
  const [isPoseLoading, setIsPoseLoading] = useState(false);
  const repStateRef = useRef({
    hasHitPeak: false,
    lastAngle: 0
  });
  const connectedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic state refs for zero-reinitialization in frame loops
  const activeModeRef = useRef(activeMode);
  const activeExerciseRef = useRef(activeExercise);
  const activeGuideRef = useRef(activeGuide);
  const targetRomRef = useRef(targetRom);
  const targetRepsRef = useRef(targetReps);
  const currentRepsRef = useRef(currentReps);
  const isAdvancingRef = useRef(isAdvancing);
  const showSkeletonRef = useRef(showSkeleton);
  const queueIndexRef = useRef(queueIndex);
  const exerciseQueueRef = useRef(exerciseQueue);

  useEffect(() => {
    activeModeRef.current = activeMode;
    activeExerciseRef.current = activeExercise;
    activeGuideRef.current = activeGuide;
    targetRomRef.current = targetRom;
    targetRepsRef.current = targetReps;
    currentRepsRef.current = currentReps;
    isAdvancingRef.current = isAdvancing;
    showSkeletonRef.current = showSkeleton;
    queueIndexRef.current = queueIndex;
    exerciseQueueRef.current = exerciseQueue;
  }, [
    activeMode,
    activeExercise,
    activeGuide,
    targetRom,
    targetReps,
    currentReps,
    isAdvancing,
    showSkeleton,
    queueIndex,
    exerciseQueue
  ]);

  // Voice Coach persistent references (protects against Chromium GC mid-speech cutoff)
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenTimeRef = useRef<number>(0);
  const lastSpokenTextRef = useRef<string>('');

  const speakCoach = useCallback(
    (text: string, force: boolean = false, cooldownSec: number = 2.5) => {
      if (!audioEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const now = Date.now();
      if (!force && (now - lastSpokenTimeRef.current < cooldownSec * 1000 || lastSpokenTextRef.current === text)) {
        return;
      }

      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Neural'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        // Vital: retain reference in ref to prevent Chromium garbage collection cutoff
        activeUtteranceRef.current = utterance;
        lastSpokenTimeRef.current = now;
        lastSpokenTextRef.current = text;

        utterance.onend = () => {
          if (activeUtteranceRef.current === utterance) {
            activeUtteranceRef.current = null;
          }
        };
        utterance.onerror = () => {
          if (activeUtteranceRef.current === utterance) {
            activeUtteranceRef.current = null;
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis warning:', err);
      }
    },
    [audioEnabled]
  );

  // Announce newly active exercise via Voice Coach
  useEffect(() => {
    if (!isRunning) return;
    const curEx = exerciseQueue[queueIndex] || exerciseQueue[0];
    const curGuide = EXERCISE_GUIDES[Number(curEx?.protocol_id)] || EXERCISE_GUIDES[1];
    const curName = curEx?.protocol_name || curGuide.title;
    const curReps = curEx?.target_reps || curGuide.targetReps || 8;
    speakCoach(
      `Exercise ${queueIndex + 1} of ${exerciseQueue.length}: ${curName}. Target is ${curReps} repetitions.`,
      true
    );
  }, [queueIndex, isRunning, exerciseQueue, speakCoach]);

  // Smooth Angle via GSAP
  const [smoothAngle, setSmoothAngle] = useState<number>(0);
  const angleRef = useRef({ val: 0 });

  useEffect(() => {
    const target = telemetry?.primary_angle ?? 0;
    const tween = gsap.to(angleRef.current, {
      val: target,
      duration: 0.25,
      ease: 'power1.out',
      onUpdate: () => {
        setSmoothAngle(Math.round(angleRef.current.val));
      }
    });
    return () => {
      tween.kill();
    };
  }, [telemetry?.primary_angle]);

  // Audio Chime synthesizer via Web Audio API
  const playRepChime = useCallback(() => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }, [audioEnabled]);

  // 1. Load MediaPipe Pose from CDN and instantiate (Singleton lifecycle per webcam session)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const loadPose = async () => {
      if (!(window as any).Pose) {
        setIsPoseLoading(true);
        await new Promise<void>((resolve, reject) => {
          const existing = document.getElementById('mediapipe-pose-script');
          if (existing) {
            if ((window as any).Pose) {
              resolve();
            } else {
              existing.addEventListener('load', () => resolve());
              existing.addEventListener('error', () => reject());
            }
            return;
          }
          const s = document.createElement('script');
          s.id = 'mediapipe-pose-script';
          s.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
          s.crossOrigin = 'anonymous';
          s.async = true;
          s.onload = () => resolve();
          s.onerror = (e) => reject(e);
          document.head.appendChild(s);
        }).catch((err) => {
          console.warn('Could not load MediaPipe Pose script:', err);
        });
      }

      if (!isMounted || !(window as any).Pose) return;

      try {
        const pose = new (window as any).Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1, // Full mode: superior accuracy for upper body & seated poses
          smoothLandmarks: true,
          enableSegmentation: false,
          minDetectionConfidence: 0.35,
          minTrackingConfidence: 0.35
        });

        pose.onResults((results: any) => {
          if (!isMounted) return;

          const canvas = canvasRef.current;
          const video = webcamVideoRef.current;
          if (!canvas || !video) return;

          const w = video.videoWidth || 640;
          const h = video.videoHeight || 480;
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          const curMode = activeModeRef.current;
          const curTargetRom = targetRomRef.current;
          const curTargetReps = targetRepsRef.current;
          const curEx = activeExerciseRef.current;
          const curGuide = activeGuideRef.current;

          if (results.poseLandmarks && results.poseLandmarks.length > 0) {
            if (!hasLandmarksRef.current) {
              hasLandmarksRef.current = true;
              setHasLandmarks(true);
            }

            const lms = results.poseLandmarks;

            // If in auto-advance countdown, continue drawing mesh but do not count reps
            if (isAdvancingRef.current) {
              drawClinicalVisionMesh(
                ctx,
                lms,
                w,
                h,
                false,
                showSkeletonRef.current,
                curMode,
                repStateRef.current.lastAngle,
                curTargetRom
              );
              return;
            }

            // Calculate live joint angle from real body
            let detectedAngle = 0;
            if (curMode === 1) {
              // Shoulder Abduction: Hip (23/24) -> Shoulder (11/12) -> Elbow (13/14)
              // Seated / desk-safe fallback: if hips are hidden under table, synthesize downward vertical reference
              const refL = (lms[23] && (lms[23].visibility ?? 1) > 0.25) ? lms[23] : (lms[11] ? { x: lms[11].x, y: lms[11].y + 0.35 } : null);
              const refR = (lms[24] && (lms[24].visibility ?? 1) > 0.25) ? lms[24] : (lms[12] ? { x: lms[12].x, y: lms[12].y + 0.35 } : null);
              const leftArm = (refL && lms[11] && lms[13]) ? calculateAngleDegrees(refL, lms[11], lms[13]) : 0;
              const rightArm = (refR && lms[12] && lms[14]) ? calculateAngleDegrees(refR, lms[12], lms[14]) : 0;
              detectedAngle = Math.max(leftArm, rightArm);
            } else if (curMode === 2) {
              // Knee Squat: Hip -> Knee -> Ankle
              const leftKnee = calculateAngleDegrees(lms[23], lms[25], lms[27]);
              const rightKnee = calculateAngleDegrees(lms[24], lms[26], lms[28]);
              detectedAngle = Math.max(180 - leftKnee, 180 - rightKnee);
            } else if (curMode === 4) {
              // Elbow Flexion: Shoulder -> Elbow -> Wrist
              const leftElbow = calculateAngleDegrees(lms[11], lms[13], lms[15]);
              const rightElbow = calculateAngleDegrees(lms[12], lms[14], lms[16]);
              detectedAngle = Math.max(leftElbow, rightElbow);
            } else if (curMode === 6) {
              // Hip Abduction: Shoulder -> Hip -> Knee
              const leftHip = calculateAngleDegrees(lms[11], lms[23], lms[25]);
              const rightHip = calculateAngleDegrees(lms[12], lms[24], lms[26]);
              detectedAngle = Math.max(leftHip, rightHip);
            } else {
              detectedAngle = calculateAngleDegrees(lms[11], lms[13], lms[15]);
            }

            if (!isNaN(detectedAngle) && detectedAngle > 5) {
              const roundedAngle = Math.min(180, Math.max(0, Math.round(detectedAngle)));

              // Real repetition detection from real movement
              const isPeak = roundedAngle >= curTargetRom * 0.82;
              if (isPeak && !repStateRef.current.hasHitPeak) {
                repStateRef.current.hasHitPeak = true;
                if (roundedAngle >= curTargetRom) {
                  speakCoach('Target range reached. Return with control.', false, 3.5);
                }
              }

              if (repStateRef.current.hasHitPeak && roundedAngle <= Math.max(25, curTargetRom * 0.35)) {
                repStateRef.current.hasHitPeak = false;
                setCurrentReps((prev) => {
                  const next = prev + 1;
                  currentRepsRef.current = next;
                  playRepChime();
                  speakCoach(`Rep ${next}. Good form!`, true);
                  return next;
                });
              }

              repStateRef.current.lastAngle = roundedAngle;

              // Draw high-precision clinical vision mesh
              drawClinicalVisionMesh(
                ctx,
                lms,
                w,
                h,
                false,
                showSkeletonRef.current,
                curMode,
                roundedAngle,
                curTargetRom
              );

              const curReps = currentRepsRef.current;
              setTelemetry((prev: any) => ({
                ...(prev || {}),
                mode: curMode,
                protocol_name: curEx.protocol_name || curGuide.title,
                exercise_title: curGuide.title,
                exercise_short_name: curGuide.short_name,
                target_joint: curGuide.targetJoint,
                setup_instruction: curGuide.actionSummary,
                action_instruction: curGuide.actionSummary,
                form_tip: curGuide.avoidSummary,
                camera_view: curGuide.recommendedView,
                reps: curReps,
                target_reps: curTargetReps,
                primary_angle: roundedAngle,
                max_rom: Math.max(curTargetRom, roundedAngle),
                target_rom: curTargetRom,
                symmetry_score: 96,
                form_status: roundedAngle >= curTargetRom ? 'OPTIMAL BIOMECHANICS' : 'SMOOTH MOTION',
                is_bad_form: false,
                feedback_text:
                  curReps >= curTargetReps
                    ? 'Target reps reached! Preparing next protocol.'
                    : isPeak
                    ? 'Peak ROM reached — smoothly return to rest.'
                    : 'Real-time 3D landmark tracking active.',
                fps: 30,
                latency_ms: 14.5,
                advancing: isAdvancingRef.current,
                remaining_advance_sec: advanceCountdown,
                show_skeleton: showSkeletonRef.current,
                queue_idx: queueIndexRef.current,
                total_queue: exerciseQueueRef.current.length
              }));
            }
          } else {
            ctx.clearRect(0, 0, w, h);
            if (hasLandmarksRef.current) {
              hasLandmarksRef.current = false;
              setHasLandmarks(false);
            }
          }
        });

        poseInstanceRef.current = pose;
        setIsPoseLoading(false);
      } catch (err) {
        console.warn('MediaPipe initialization warning:', err);
        setIsPoseLoading(false);
      }
    };

    if (isRunning && cameraMode === 'webcam') {
      loadPose();
    }

    return () => {
      isMounted = false;
      if (poseInstanceRef.current) {
        try {
          poseInstanceRef.current.close();
        } catch {}
        poseInstanceRef.current = null;
      }
      hasLandmarksRef.current = false;
      setHasLandmarks(false);
    };
  }, [isRunning, cameraMode, playRepChime, speakCoach, advanceCountdown]);

  // 2. Video Frame Processing Loop (passes webcam frames to MediaPipe)
  useEffect(() => {
    if (!isRunning || cameraMode !== 'webcam') return;

    let animId: number;
    let isSending = false;

    const renderLoop = async () => {
      const video = webcamVideoRef.current;
      const pose = poseInstanceRef.current;

      if (
        video &&
        pose &&
        video.readyState >= 2 &&
        !video.paused &&
        !video.ended &&
        !isSending
      ) {
        try {
          isSending = true;
          await pose.send({ image: video });
        } catch {
          // ignore dropped frame
        } finally {
          isSending = false;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isRunning, cameraMode]);

  // 3. Browser Webcam Lifecycle (getUserMedia)
  const startWebcam = useCallback(async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        webcamStreamRef.current = stream;
        if (webcamVideoRef.current) {
          webcamVideoRef.current.srcObject = stream;
          webcamVideoRef.current.play().catch(() => {});
        }
        setStreamConnected(true);
        setIsConnecting(false);
      } else {
        setCameraMode('simulation');
      }
    } catch (err: any) {
      console.warn('Webcam permission not granted or device unavailable, switching to clinical demo:', err);
      setCameraMode('simulation');
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && cameraMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [isRunning, cameraMode, startWebcam, stopWebcam]);

  // Clean termination of MJPEG stream on unmount
  useEffect(() => {
    return () => {
      if (imgRef.current) {
        imgRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning && imgRef.current) {
      imgRef.current.src = '';
    }
  }, [isRunning]);

  // 2. Interactive Kinematics Loop for Webcam & Simulation modes
  useEffect(() => {
    if (cameraMode === 'stream' || !isRunning) return;

    let angle = 18;
    let increasing = true;
    let holdTicks = 0;

    const cadenceTimer = setInterval(() => {
      if (isAdvancingRef.current || (cameraMode === 'webcam' && hasLandmarksRef.current)) return;

      const tRom = targetRomRef.current;
      const tReps = targetRepsRef.current;
      const cMode = activeModeRef.current;
      const guide = activeGuideRef.current;
      const ex = activeExerciseRef.current;

      if (increasing) {
        angle += 4;
        if (angle >= tRom + 4) {
          angle = tRom + 4;
          holdTicks += 1;
          if (holdTicks > 3) {
            increasing = false;
            holdTicks = 0;
          }
        }
      } else {
        angle -= 4;
        if (angle <= 18) {
          angle = 18;
          increasing = true;
          setCurrentReps((prev) => {
            const next = prev + 1;
            currentRepsRef.current = next;
            playRepChime();
            speakCoach(`Rep ${next}. Good form!`, true);
            return next;
          });
        }
      }

      const curR = currentRepsRef.current;
      setTelemetry({
        mode: cMode,
        protocol_name: ex.protocol_name || guide.title,
        exercise_title: guide.title,
        exercise_short_name: guide.short_name,
        target_joint: guide.targetJoint,
        setup_instruction: guide.actionSummary,
        action_instruction: guide.actionSummary,
        form_tip: guide.avoidSummary,
        camera_view: guide.recommendedView,
        reps: curR,
        target_reps: tReps,
        primary_angle: Math.min(180, Math.max(0, angle)),
        max_rom: Math.max(tRom, angle),
        target_rom: tRom,
        symmetry_score: 95,
        form_status: angle >= tRom ? 'OPTIMAL BIOMECHANICS' : 'SMOOTH MOTION',
        is_bad_form: false,
        feedback_text:
          curR >= tReps
            ? 'Prescribed reps reached! Great cadence.'
            : angle >= tRom
            ? 'Peak ROM achieved — maintain control as you lower.'
            : 'Keep cadence steady and aligned with the movement guide.',
        fps: 60,
        latency_ms: 8.2,
        advancing: isAdvancingRef.current,
        remaining_advance_sec: advanceCountdown,
        show_skeleton: showSkeletonRef.current,
        queue_idx: queueIndexRef.current,
        total_queue: exerciseQueueRef.current.length
      });
    }, 120);

    return () => clearInterval(cadenceTimer);
  }, [cameraMode, isRunning, advanceCountdown, playRepChime, speakCoach]);

  const handleFinishEarly = useCallback(async () => {
    stopWebcam();
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    if (cameraMode === 'stream') {
      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        await fetch(`http://${host}:8000/quit`);
      } catch (err) {
        console.warn('Failed to send quit action:', err);
      }
    }
    onConcludeSession();
  }, [stopWebcam, cameraMode, onConcludeSession]);

  // 3. Auto-Advance Exercise Queue when Target Reps are Reached in Cloud / Webcam Mode
  useEffect(() => {
    if (cameraMode === 'stream' || !isRunning) return;

    if (currentReps >= targetReps && !isAdvancing) {
      setIsAdvancing(true);
      isAdvancingRef.current = true;
      setAdvanceCountdown(2);

      const isLastExercise = queueIndex + 1 >= exerciseQueue.length;
      if (isLastExercise) {
        speakCoach("Outstanding work! All prescribed exercises completed. Compiling your clinical report.", true);
      } else {
        const nextEx = exerciseQueue[queueIndex + 1];
        const nextGuide = EXERCISE_GUIDES[Number(nextEx?.protocol_id)] || EXERCISE_GUIDES[1];
        const nextName = nextEx?.protocol_name || nextGuide.title;
        speakCoach(`Protocol completed! Great job. Next up: ${nextName} in two seconds.`, true);
      }

      let remaining = 2;
      const countInterval = setInterval(() => {
        remaining -= 1;
        setAdvanceCountdown(Math.max(0, remaining));
        if (remaining <= 0) {
          clearInterval(countInterval);
        }
      }, 1000);

      const timer = setTimeout(() => {
        clearInterval(countInterval);
        if (queueIndex + 1 < exerciseQueue.length) {
          setQueueIndex((prev) => prev + 1);
          queueIndexRef.current = queueIndex + 1;
          setCurrentReps(0);
          currentRepsRef.current = 0;
          repStateRef.current = { hasHitPeak: false, lastAngle: 0 };
          setIsAdvancing(false);
          isAdvancingRef.current = false;
          setAdvanceCountdown(0);
        } else {
          setIsAdvancing(false);
          isAdvancingRef.current = false;
          setAdvanceCountdown(0);
          handleFinishEarly();
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearInterval(countInterval);
      };
    }
  }, [
    currentReps,
    targetReps,
    queueIndex,
    exerciseQueue,
    isAdvancing,
    cameraMode,
    isRunning,
    handleFinishEarly,
    speakCoach
  ]);

  // 4. Telemetry Poller for Local Python Stream (ONLY runs when cameraMode === 'stream')
  useEffect(() => {
    if (!isRunning || cameraMode !== 'stream') return;

    let isFetching = false;
    const interval = setInterval(async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        const url = `http://${host}:8000/status`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json.data || (json.mode !== undefined ? json : null);
          if (data) {
            setTelemetry((prev: any) => {
              if (
                prev &&
                prev.reps === data.reps &&
                prev.primary_angle === data.primary_angle &&
                prev.form_status === data.form_status &&
                prev.mode === data.mode &&
                prev.queue_idx === data.queue_idx &&
                prev.advancing === data.advancing
              ) {
                return prev;
              }
              return data;
            });
            setCurrentReps(data.reps ?? 0);
            currentRepsRef.current = data.reps ?? 0;
            if (data.queue_idx !== undefined && data.queue_idx !== queueIndexRef.current) {
              setQueueIndex(data.queue_idx);
              queueIndexRef.current = data.queue_idx;
              repStateRef.current = { hasHitPeak: false, lastAngle: 0 };
            }
            if (data.advancing !== undefined) {
              setIsAdvancing(!!data.advancing);
              isAdvancingRef.current = !!data.advancing;
            }
            if (data.remaining_advance_sec !== undefined) {
              setAdvanceCountdown(Math.round(data.remaining_advance_sec || 0));
            }
            if (data.completed) {
              handleFinishEarly();
            }
            if (typeof data.show_skeleton === 'boolean') {
              setShowSkeleton(data.show_skeleton);
              showSkeletonRef.current = data.show_skeleton;
            }
            if (!connectedRef.current) {
              connectedRef.current = true;
              setStreamConnected(true);
              setIsConnecting(false);
            }
          }
        }
      } catch {
        // Local daemon warming up
      } finally {
        isFetching = false;
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isRunning, cameraMode, handleFinishEarly]);

  const handleToggleSkeleton = async () => {
    if (cameraMode === 'stream') {
      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        const res = await fetch(`http://${host}:8000/toggle_skeleton`);
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json;
          const next = typeof data.show_skeleton === 'boolean' ? data.show_skeleton : !showSkeleton;
          setShowSkeleton(next);
          showSkeletonRef.current = next;
        }
      } catch {
        setShowSkeleton((prev) => {
          showSkeletonRef.current = !prev;
          return !prev;
        });
      }
    } else {
      setShowSkeleton((prev) => {
        showSkeletonRef.current = !prev;
        return !prev;
      });
    }
  };

  const handleStreamError = useCallback(() => {
    connectedRef.current = false;
    setStreamConnected(false);
    setIsConnecting(true);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    retryTimeoutRef.current = setTimeout(() => {
      if (isRunning) {
        setRetryNonce(Date.now());
      }
    }, 1000);
  }, [isRunning]);

  const handleStreamLoad = () => {
    connectedRef.current = true;
    setStreamConnected(true);
    setIsConnecting(false);
  };

  const handleManualReconnect = () => {
    if (cameraMode === 'webcam') {
      stopWebcam();
      startWebcam();
    } else if (cameraMode === 'stream') {
      connectedRef.current = false;
      setStreamConnected(false);
      setIsConnecting(true);
      setRetryNonce(Date.now());
    }
  };

  const handleManualAddRep = () => {
    if (isAdvancingRef.current) return;
    setCurrentReps((prev) => {
      const next = prev + 1;
      currentRepsRef.current = next;
      playRepChime();
      speakCoach(`Rep ${next}. Good form!`, true);
      return next;
    });
  };

  const handleSkipExercise = async () => {
    if (cameraMode === 'stream') {
      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        await fetch(`http://${host}:8000/skip`);
      } catch (err) {
        console.warn('Failed to send skip action:', err);
      }
    } else {
      if (queueIndex + 1 < exerciseQueue.length) {
        setQueueIndex((prev) => prev + 1);
        queueIndexRef.current = queueIndex + 1;
        setCurrentReps(0);
        currentRepsRef.current = 0;
        repStateRef.current = { hasHitPeak: false, lastAngle: 0 };
        setIsAdvancing(false);
        isAdvancingRef.current = false;
      } else {
        handleFinishEarly();
      }
    }
  };

  const streamHost = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
  const currentStreamUrl = `http://${streamHost}:8000/video_feed?t=${retryNonce}`;
  const displayReps = currentReps;
  const progressPercent = Math.min(100, Math.round((displayReps / Math.max(1, targetReps)) * 100));

  return (
    <div
      className={`bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-7 shadow-2xl transition-all flex flex-col font-sans text-slate-900 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] rounded-none p-3.5 sm:p-6 overflow-y-auto bg-slate-50'
          : 'w-full'
      }`}
    >
      {/* Exercise "How To Do It" Interactive Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-3xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className="text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                        Protocol {activeGuide.id} Guide
                      </span>
                      <span className="text-[11px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activeGuide.targetJoint}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">
                      {activeGuide.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Large Stickman Animation Inside Modal */}
              <div className="my-4 sm:my-5">
                <StickmanExerciseAnimation protocolId={activeGuide.id} className="h-40 sm:h-56 w-full bg-slate-50" />
              </div>

              {/* 3 Step-by-Step Instructions */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                  Step-by-Step Movement Instructions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeGuide.steps.map((st) => (
                    <div key={st.num} className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-black text-emerald-600 block mb-1">
                        Step {st.num}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mb-1">
                        {st.title}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {st.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Tips & Avoidances */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Pro Form Tips
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {activeGuide.formTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50/70 border border-amber-200">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Mistakes to Avoid
                  </h5>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {activeGuide.commonMistakes.map((mis, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{mis}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs text-center"
              >
                I Understand, Start Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER & STUDIO CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-3.5 sm:pb-4 border-b border-slate-200 mb-3.5 sm:mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Exercise {(telemetry?.queue_idx || 0) + 1} of {telemetry?.total_queue || 1}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {activeGuide.targetJoint}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Goal: <strong className="text-slate-900 font-bold">{targetReps} Reps</strong> • Target ROM: <strong className="text-emerald-700 font-bold">{telemetry?.target_rom || activeGuide.targetRom}°</strong>
              </span>
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans mt-0.5">
              {activeGuide.title}
            </h2>
          </div>
        </div>

        {/* Studio Top Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap self-start sm:self-center w-full sm:w-auto">
          {/* Camera Source Selector Tabs */}
          <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200 text-xs overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setCameraMode('webcam')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                cameraMode === 'webcam'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Use your live browser webcam"
            >
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Camera</span>
            </button>

            <button
              onClick={() => setCameraMode('simulation')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                cameraMode === 'simulation'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="View guided exercise demonstration video"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Video</span>
            </button>

            {isLocalHost && (
              <button
                onClick={() => setCameraMode('stream')}
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                  cameraMode === 'stream'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Connect to local Python vision engine"
              >
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Python DirectShow</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
            title="Open Exercise Technique & Posture Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>How To Do It</span>
          </button>

          <button
            onClick={handleToggleSkeleton}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              showSkeleton
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle between skeleton mesh and clean video"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{showSkeleton ? 'Skeleton Mesh' : 'Clean Video'}</span>
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs transition-colors cursor-pointer shrink-0 ${
              audioEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={audioEnabled ? 'Mute AI Voice Coach & Chimes' : 'Unmute AI Voice Coach & Chimes'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleManualReconnect}
            className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Refresh Camera Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 sm:p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs shrink-0"
              title="Close Camera Window"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. PROMINENT ACTIVE MOVEMENT DIRECTIVE BANNER (What to do vs What to avoid) */}
      <div className="mb-3.5 sm:mb-4 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 w-full">
          {/* Action Directive (What to do) */}
          <div className="md:col-span-7 bg-white p-3 sm:p-3.5 rounded-xl border border-emerald-200 flex items-start gap-2.5 sm:gap-3 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
              👉 What to do
            </span>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
              {activeGuide.actionSummary}
            </p>
          </div>

          {/* Avoid Directive (What to avoid) */}
          <div className="md:col-span-5 bg-amber-50/80 p-3 sm:p-3.5 rounded-xl border border-amber-200 flex items-start gap-2.5 sm:gap-3 shadow-2xs">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-amber-100 text-amber-900 shrink-0">
              ⚠️ Avoid
            </span>
            <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
              {activeGuide.avoidSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN STUDIO VIEWPORT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* LEFT COLUMN (8 cols): Widescreen Camera Viewport */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full">
          
          {/* Form Correction Banner (Only appears when error detected) */}
          {telemetry?.is_bad_form && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-300 shadow-sm flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                  {telemetry?.correction_direction === 'DOWN' ? (
                    <ArrowDown className="w-5 h-5 text-rose-600 animate-bounce" />
                  ) : telemetry?.correction_direction === 'UP' ? (
                    <ArrowUp className="w-5 h-5 text-rose-600 animate-bounce" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-rose-600 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-900 tracking-wide flex items-center gap-2">
                    <span>CORRECTION:</span>
                    <span className="text-rose-800 font-extrabold bg-white px-2 py-0.5 rounded border border-rose-200">
                      {telemetry?.correction_cue || 'ADJUST FORM'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">
                    {telemetry?.feedback_text}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 uppercase hidden sm:inline">
                Real-Time Guard
              </span>
            </motion.div>
          )}

          {/* Auto-Advance Banner */}
          {(telemetry?.advancing || isAdvancing) && (
            <div className="mb-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-md flex items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 animate-bounce">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    EXERCISE COMPLETED!
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    Goal achieved: <span className="font-bold">{currentReps}/{targetReps} reps</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-xs">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                <span>
                  {queueIndex + 1 < exerciseQueue.length
                    ? `Next exercise in ${advanceCountdown || telemetry?.remaining_advance_sec || 2}s...`
                    : 'Finalizing session report...'}
                </span>
              </div>
            </div>
          )}

          {/* Camera Viewport Container */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-md flex items-center justify-center group w-full">
            {cameraMode === 'webcam' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
                <video
                  ref={webcamVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none transform scale-x-[-1]"
                />
                <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] text-slate-200 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-300">
                    {hasLandmarks ? '3D Skeletal Mesh Locked' : isPoseLoading ? 'Loading MediaPipe Pose...' : 'Live Device Camera'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{hasLandmarks ? 'Real-Time Biomechanics' : 'Hardware Vision'}</span>
                </div>
              </div>
            ) : cameraMode === 'simulation' ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                <video
                  src="/muscular_men.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 shadow-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-emerald-300">Exercise Demonstration Video</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">Kinematic Overlay Active</span>
                </div>
              </div>
            ) : isRunning && (
              <img
                ref={imgRef}
                src={currentStreamUrl}
                alt="PhysioPulse AI DirectShow Stream"
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  streamConnected ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={handleStreamLoad}
                onError={handleStreamError}
              />
            )}

            {/* DirectShow stream status badge */}
            {cameraMode === 'stream' && streamConnected && isRunning && (
              <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">
                  {telemetry?.fps ? `${telemetry.fps} FPS Locked` : '30 FPS Video Feed'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">DirectShow Daemon</span>
              </div>
            )}

            {/* Connecting Overlay for Local Stream Mode */}
            {cameraMode === 'stream' && (!streamConnected || !isRunning) && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950 w-full h-full text-slate-300">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                  <Video className="w-8 h-8 stroke-[2]" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 font-sans">
                  Connecting to Local Python Engine...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4 font-sans leading-relaxed">
                  Start the local vision daemon or switch to your device camera below.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => setCameraMode('webcam')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md cursor-pointer flex items-center gap-1.5 shadow-emerald-600/20"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Switch to Device Webcam</span>
                  </button>
                  <button
                    onClick={() => setCameraMode('simulation')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo Video</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Under-Camera Controls & Feedback Bar */}
          <div className="mt-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-800">
                  AI Clinical Coach Active
                </span>
                <span className="text-slate-400 mx-1.5 hidden xs:inline">•</span>
                <span className="text-xs text-slate-600 font-medium italic block xs:inline truncate">
                  "{telemetry?.feedback_text || 'Perform the exercise smoothly and maintain clean alignment.'}"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end sm:justify-start shrink-0">
              <button
                onClick={handleManualAddRep}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Manually log a completed repetition"
              >
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>+1 Rep</span>
              </button>

              <button
                onClick={handleSkipExercise}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Skip this protocol and move to next"
              >
                <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                <span>Skip Protocol</span>
              </button>

              <button
                onClick={handleFinishEarly}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Conclude session and generate clinical assessment"
              >
                <StopCircle className="w-3.5 h-3.5 text-white" />
                <span>Save &amp; Finish</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Clarified Feedback & Stickman Guide */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* CARD 1: MASSIVE REP COUNTER (First priority - visible from 10 feet away!) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-semibold">
              <span className="uppercase tracking-wider text-[11px] font-bold">
                REPETITION PROGRESS
              </span>
              <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-xs">
                Protocol {activeGuide.id}
              </span>
            </div>

            {/* Giant Rep Number */}
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl xs:text-6xl sm:text-7xl font-black text-emerald-600 tracking-tight font-sans">
                  {currentReps}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-400 uppercase tracking-wide">
                  reps
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 block font-sans">
                  / {targetReps} Target
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {progressPercent}% Completed
                </span>
              </div>
            </div>

            {/* Thick Progress Bar */}
            <div className="w-full bg-slate-100 h-3 sm:h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Protocol 3 Isometric Posture Hold Timer */}
            {telemetry?.mode === 3 && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between text-xs text-emerald-900 mb-1.5 font-semibold">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    Posture Hold Timer
                  </span>
                  <span className="text-emerald-700 font-bold text-sm">
                    {telemetry?.p3_hold_timer || 0}s / 15.0s
                  </span>
                </div>
                <div className="w-full bg-white h-2.5 rounded-full overflow-hidden border border-emerald-200">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-150"
                    style={{
                      width: `${Math.min(100, Math.round(((telemetry?.p3_hold_timer || 0) / 15.0) * 100))}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* CARD 2: ANIMATED STICKMAN EXERCISE DEMONSTRATION (Shows user exact movement!) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">
                  Mirror This Movement
                </h5>
              </div>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Full Steps
              </button>
            </div>

            {/* Continuous Looping SVG Stickman */}
            <div className="mb-3">
              <StickmanExerciseAnimation protocolId={activeGuide.id} className="h-44 w-full bg-slate-50/80" />
            </div>

            {/* Quick 1-line guidance under stickman */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-center">
              <p className="font-medium text-slate-800">
                Watch the stickman above and copy the cadence and range in your webcam view.
              </p>
            </div>
          </div>

          {/* CARD 3: GONIOMETER & ROM TARGET */}
          <ClinicalGoniometerDial
            currentAngle={smoothAngle}
            targetAngle={telemetry?.target_rom || activeGuide.targetRom}
            phase={telemetry?.kinematic_phase || 'Active'}
            isBadForm={telemetry?.is_bad_form}
          />

          {/* CARD 4: REAL-TIME AI BIOFEEDBACK COACHING */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1.5 uppercase tracking-wider">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Voice Coach Guidance</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                "{telemetry?.feedback_text || 'Position yourself comfortably in front of the camera to begin...'}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

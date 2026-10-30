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
  onConcludeSession: () => void;
  patientName: string;
  isModal?: boolean;
  onCloseModal?: () => void;
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
  isModal = false,
  onCloseModal
}: EmbeddedVisionStudioProps) {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [useDirectFeed, setUseDirectFeed] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const activeMode = telemetry?.mode || 1;
  const activeGuide = EXERCISE_GUIDES[activeMode] || EXERCISE_GUIDES[1];
  const imgRef = useRef<HTMLImageElement | null>(null);
  const connectedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const handleToggleSkeleton = async () => {
    try {
      const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
      const url = useDirectFeed
        ? `http://${host}:8000/toggle_skeleton`
        : '/api/vision-control?action=toggle_skeleton';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (typeof data.show_skeleton === 'boolean') {
          setShowSkeleton(data.show_skeleton);
        } else {
          setShowSkeleton((prev) => !prev);
        }
      }
    } catch (err) {
      console.warn('Failed to toggle skeleton:', err);
      setShowSkeleton((prev) => !prev);
    }
  };

  // Telemetry Poller (280ms cadence)
  useEffect(() => {
    if (!isRunning) return;

    let isFetching = false;
    const interval = setInterval(async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        const url = useDirectFeed
          ? `http://${host}:8000/status`
          : '/api/vision-control?action=status';

        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          const data = json.data || (json.mode !== undefined ? json : null);
          if (data) {
            setTelemetry(data);
            if (typeof data.show_skeleton === 'boolean') {
              setShowSkeleton(data.show_skeleton);
            }
            if (!connectedRef.current) {
              connectedRef.current = true;
              setStreamConnected(true);
              setIsConnecting(false);
            }
          }
        }
      } catch {
        // Stream server warming up
      } finally {
        isFetching = false;
      }
    }, 280);

    return () => clearInterval(interval);
  }, [isRunning, useDirectFeed]);

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
    connectedRef.current = false;
    setStreamConnected(false);
    setIsConnecting(true);
    setRetryNonce(Date.now());
  };

  const handleSkipExercise = async () => {
    try {
      const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
      const url = useDirectFeed ? `http://${host}:8000/skip` : '/api/vision-control?action=skip';
      await fetch(url);
    } catch (err) {
      console.warn('Failed to send skip action:', err);
    }
  };

  const handleFinishEarly = async () => {
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    try {
      const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
      const url = useDirectFeed ? `http://${host}:8000/quit` : '/api/vision-control?action=quit';
      await fetch(url);
      onConcludeSession();
    } catch (err) {
      console.warn('Failed to send quit action:', err);
      onConcludeSession();
    }
  };

  const streamHost = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
  const currentStreamUrl = useDirectFeed
    ? `http://${streamHost}:8000/video_feed?t=${retryNonce}`
    : `/api/video-feed?t=${retryNonce}`;

  const currentReps = telemetry?.reps ?? 0;
  const targetReps = telemetry?.target_reps || activeGuide.targetReps || 10;
  const progressPercent = Math.min(100, Math.round((currentReps / Math.max(1, targetReps)) * 100));

  return (
    <div
      className={`bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl transition-all flex flex-col font-sans text-slate-900 ${
        isFullscreen
          ? 'fixed inset-0 z-[100] rounded-none p-5 sm:p-7 overflow-y-auto bg-slate-50'
          : 'w-full'
      }`}
    >
      {/* Exercise "How To Do It" Interactive Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-xs">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                        Protocol {activeGuide.id} Guide
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {activeGuide.targetJoint}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 font-sans">
                      {activeGuide.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Large Stickman Animation Inside Modal */}
              <div className="my-5">
                <StickmanExerciseAnimation protocolId={activeGuide.id} className="h-56 w-full bg-slate-50" />
              </div>

              {/* 3 Step-by-Step Instructions */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                  Step-by-Step Movement Instructions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeGuide.steps.map((st) => (
                    <div key={st.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
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

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
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

            <div className="pt-6 mt-6 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                I Understand, Start Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER & STUDIO CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Exercise {(telemetry?.queue_idx || 0) + 1} of {telemetry?.total_queue || 1}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {activeGuide.targetJoint}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Goal: <strong className="text-slate-900 font-bold">{targetReps} Reps</strong> • Target ROM: <strong className="text-emerald-700 font-bold">{telemetry?.target_rom || activeGuide.targetRom}°</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans mt-0.5">
              {activeGuide.title}
            </h2>
          </div>
        </div>

        {/* Studio Top Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Open Exercise Technique & Posture Guide"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>How To Do It</span>
          </button>

          <button
            onClick={handleToggleSkeleton}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
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
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={audioEnabled ? 'Mute Kinetic Chimes' : 'Unmute Kinetic Chimes'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleManualReconnect}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs"
            title="Refresh Camera Feed"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 rounded-xl bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs"
              title="Close Camera Window"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. PROMINENT ACTIVE MOVEMENT DIRECTIVE BANNER (What to do vs What to avoid) */}
      <div className="mb-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
          {/* Action Directive (What to do) */}
          <div className="md:col-span-7 bg-white p-3.5 rounded-xl border border-emerald-200 flex items-start gap-3 shadow-2xs">
            <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 shrink-0">
              👉 What to do
            </span>
            <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
              {activeGuide.actionSummary}
            </p>
          </div>

          {/* Avoid Directive (What to avoid) */}
          <div className="md:col-span-5 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 flex items-start gap-3 shadow-2xs">
            <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 shrink-0">
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
          {telemetry?.advancing && (
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
                <span>Next exercise in {telemetry?.remaining_advance_sec || 3}s...</span>
              </div>
            </div>
          )}

          {/* Camera Viewport Container */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video shadow-md flex items-center justify-center group w-full">
            {/* Live Native Video Stream */}
            {isRunning && (
              <img
                ref={imgRef}
                src={currentStreamUrl}
                alt="PhysioPulse AI Clinical Vision Feed"
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  streamConnected ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={handleStreamLoad}
                onError={handleStreamError}
              />
            )}

            {/* Clean bottom status indicator on camera (Doesn't cover patient head!) */}
            {streamConnected && isRunning && (
              <div className="absolute bottom-3 left-3 pointer-events-none z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">
                  {telemetry?.fps ? `${telemetry.fps} FPS Locked` : '30 FPS Video Feed'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">Zero-Lag Stream</span>
              </div>
            )}

            {/* Connecting / Loading Overlay */}
            {(!streamConnected || !isRunning) && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950 w-full h-full text-slate-300">
                <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
                  <Video className="w-8 h-8 stroke-[2]" />
                </div>
                <h4 className="text-base font-bold text-white mb-1 font-sans">
                  Starting 3D Biomechanical Camera...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4 font-sans leading-relaxed">
                  Initializing MediaPipe skeletal tracking at 30+ FPS. Position yourself 6–8 feet in front of your webcam.
                </p>
                <button
                  onClick={handleManualReconnect}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Reconnect Camera</span>
                </button>
              </div>
            )}
          </div>

          {/* Under-Camera Controls & Feedback Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-slate-800">
                AI Clinical Coach Active
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-600 font-medium italic">
                "{telemetry?.feedback_text || 'Perform the exercise smoothly and maintain clean alignment.'}"
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipExercise}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Skip this protocol and move to next"
              >
                <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                <span>Skip Protocol</span>
              </button>

              <button
                onClick={handleFinishEarly}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Conclude session and generate clinical assessment"
              >
                <StopCircle className="w-3.5 h-3.5 text-white" />
                <span>Save &amp; Finish Session</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Clarified Feedback & Stickman Guide */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* CARD 1: MASSIVE REP COUNTER (First priority - visible from 10 feet away!) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
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
                <span className="text-7xl font-black text-emerald-600 tracking-tight font-sans">
                  {currentReps}
                </span>
                <span className="text-base font-bold text-slate-400 uppercase tracking-wide">
                  reps
                </span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block font-sans">
                  / {targetReps} Target
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {progressPercent}% Completed
                </span>
              </div>
            </div>

            {/* Thick Progress Bar */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
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

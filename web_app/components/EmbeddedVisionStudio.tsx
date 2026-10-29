'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Radio,
  Eye,
  EyeOff,
  BookOpen,
  HelpCircle,
  Info,
  Check,
  Compass,
  ArrowDown,
  ArrowUp,
  ArrowRight
} from 'lucide-react';

export interface ExerciseGuide {
  id: number;
  title: string;
  short_name: string;
  subtitle: string;
  targetJoint: string;
  recommendedView: string;
  targetRom: number;
  targetReps: number;
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
    title: 'Frozen Shoulder Lateral Abduction',
    short_name: 'Shoulder Abduction',
    subtitle: 'Glenohumeral Articulation & Scapulohumeral Elevation',
    targetJoint: 'Shoulder (Glenohumeral)',
    recommendedView: 'Front View (Face Camera 6–8 ft)',
    targetRom: 90,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Starting Stance',
        description: 'Stand or sit upright facing the camera. Relax your neck, drop shoulders down, and keep your arm resting at your side.'
      },
      {
        num: '02',
        title: 'Lateral Abduction',
        description: 'Slowly raise your arm out to the side until parallel to the floor (90°). Keep your elbow straight and palm facing down.'
      },
      {
        num: '03',
        title: 'Pause & Controlled Descent',
        description: 'Hold at the 90° target for 1 second, then lower your arm back to your side taking 2 seconds. Avoid dropping abruptly.'
      }
    ],
    formTips: [
      'Keep shoulder blades depressed — relax your upper trapezius.',
      'Inhale on the lift; exhale smoothly on the way down.'
    ],
    commonMistakes: [
      'Do not hike or shrug your shoulder toward your ear.',
      'Do not lean your torso sideways to cheat the angle.'
    ]
  },
  2: {
    id: 2,
    title: 'Post-ACL Knee Extension & Controlled Squat',
    short_name: 'Knee Squat & Extension',
    subtitle: 'Tibiofemoral & Patellofemoral Closed-Kinetic Mechanics',
    targetJoint: 'Knee & Quadriceps',
    recommendedView: 'Full Body View (Head-to-Toe in Frame)',
    targetRom: 90,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Stance & Alignment',
        description: 'Stand with feet shoulder-width apart, toes pointing forward or slightly out (5°). Ensure full body is visible in frame.'
      },
      {
        num: '02',
        title: 'Controlled Knee Flexion',
        description: 'Hinge hips backwards as if sitting into a chair. Bend knees down to 90° while keeping your chest proud and upright.'
      },
      {
        num: '03',
        title: 'Drive to Stand',
        description: 'Press evenly through your mid-foot and heels to drive back up to full standing extension.'
      }
    ],
    formTips: [
      'Track your knees directly over your second toes.',
      'Maintain an upright torso with natural lumbar curve.'
    ],
    commonMistakes: [
      'Do not let your knees cave inward (valgus collapse).',
      'Do not lift your heels off the ground or round your lower back.'
    ]
  },
  3: {
    id: 3,
    title: 'Cervical & Ergonomic Posture Retraction Guard',
    short_name: 'Cervical Posture Guard',
    subtitle: 'Deep Cervical Flexor & Craniovertebral Alignment',
    targetJoint: 'Cervical Spine & Neck Posture',
    recommendedView: 'Upper Body Front View (Chest to Head)',
    targetRom: 85,
    targetReps: 1,
    steps: [
      {
        num: '01',
        title: 'Neutral Sitting Stance',
        description: 'Sit tall directly facing the camera with shoulders relaxed and hands resting comfortably in your lap.'
      },
      {
        num: '02',
        title: 'Axial Chin Tuck',
        description: 'Gently glide your chin horizontally straight backward (make a subtle double chin) without bending head downward.'
      },
      {
        num: '03',
        title: 'Isometric Hold',
        description: 'Hold the neutral retracted position steadily for the 5-second countdown timer shown on screen.'
      }
    ],
    formTips: [
      'Keep eye level strictly horizontal — do not tilt head down.',
      'Focus on feeling elongation at the back of the neck.'
    ],
    commonMistakes: [
      'Do not nod your head down toward your chest.',
      'Do not tilt your head sideways toward either shoulder.'
    ]
  },
  4: {
    id: 4,
    title: 'Post-Fracture Elbow Flexion Rehabilitation',
    short_name: 'Elbow Flexion Curl',
    subtitle: 'Humeroulnar Joint Flexion & Soft-Tissue Remodeling',
    targetJoint: 'Elbow & Biceps (Humeroulnar)',
    recommendedView: 'Front or Diagonal View',
    targetRom: 125,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Upper Arm Anchor',
        description: 'Sit or stand tall. Pin your upper arm lightly against the side of your ribcage with arm fully extended.'
      },
      {
        num: '02',
        title: 'Flexion Curl',
        description: 'Bend your elbow smoothly, curling your palm upward toward your front shoulder until reaching 125°+.'
      },
      {
        num: '03',
        title: 'Eccentric Extension',
        description: 'Pause briefly at the top, then slowly lower hand back down to full elbow extension taking 2 seconds.'
      }
    ],
    formTips: [
      'Keep your upper arm completely still at your side.',
      'Ensure smooth cadence throughout the entire range.'
    ],
    commonMistakes: [
      'Do not swing your elbow forward or use body momentum.',
      'Do not flare your elbow outward away from your torso.'
    ]
  },
  5: {
    id: 5,
    title: 'Bilateral Overhead Wall-Slide Sync',
    short_name: 'Overhead Wall Slide',
    subtitle: 'Scapulothoracic & Bilateral Serratus Anterior Activation',
    targetJoint: 'Bilateral Shoulders & Scapulae',
    recommendedView: 'Front View (Both Arms in Frame)',
    targetRom: 120,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Goalpost Starting Setup',
        description: 'Stand facing the camera with both elbows bent at 90° at shoulder height in a goalpost alignment.'
      },
      {
        num: '02',
        title: 'Synchronous Slide',
        description: 'Simultaneously slide both arms upwards in a synchronized "V" pattern above your head reaching 120°+.'
      },
      {
        num: '03',
        title: 'Symmetric Return',
        description: 'Lower both arms back down at the exact same speed and height, maintaining bilateral symmetry above 80%.'
      }
    ],
    formTips: [
      'Keep core braced so your lower back does not arch.',
      'Focus on smooth upward rotation of both shoulder blades.'
    ],
    commonMistakes: [
      'Do not lift one arm higher or faster than the other.',
      'Do not shrug upper trapezius or lean head forward.'
    ]
  },
  6: {
    id: 6,
    title: 'Total Hip Replacement Lateral Side Abduction',
    short_name: 'Hip Side Abduction',
    subtitle: 'Coxofemoral Articulation & Gluteus Medius Activation',
    targetJoint: 'Hip & Gluteus Medius',
    recommendedView: 'Full Body Front View (Legs in Frame)',
    targetRom: 28,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Upright Support Stance',
        description: 'Stand tall holding a sturdy chair or counter for balance. Feet hip-width apart and toes facing forward.'
      },
      {
        num: '02',
        title: 'Lateral Abduction',
        description: 'Keeping your moving leg straight and knee facing forward, smoothly raise leg out to the side to 28°–35°.'
      },
      {
        num: '03',
        title: 'Smooth Descent',
        description: 'Hold for 1 second at peak abduction, then slowly lower foot to starting stance under control.'
      }
    ],
    formTips: [
      'Keep your pelvis level — imagine balancing a cup on your hips.',
      'Feel the muscle on the outside of your hip working.'
    ],
    commonMistakes: [
      'Do not lean your torso to the opposite side to cheat height.',
      'Do not rotate your foot or knee upward toward the ceiling.'
    ]
  },
  7: {
    id: 7,
    title: 'Lumbar Spine Flexion & Hip Hinge Rehab',
    short_name: 'Lumbar Hip Hinge',
    subtitle: 'Lumbopelvic Rhythm & Posterior Chain Mechanics',
    targetJoint: 'Lumbar Spine & Hip Hinge',
    recommendedView: 'Profile / Side View Preferred',
    targetRom: 25,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Stance & Soft Knees',
        description: 'Stand with feet hip-width apart. Keep knees slightly unlocked ("soft knees") throughout movement.'
      },
      {
        num: '02',
        title: 'Hip Hinge Flexion',
        description: 'Hinge forward at your hip crease, pushing your buttocks back while maintaining a flat, neutral spine (25°–35°).'
      },
      {
        num: '03',
        title: 'Glute Drive Return',
        description: 'Squeeze your glutes and hamstrings to stand back up tall into neutral vertical standing posture.'
      }
    ],
    formTips: [
      'Movement must originate at the hip joints, not the spine.',
      'Keep your neck in line with your spine (look slightly ahead).'
    ],
    commonMistakes: [
      'Do not round your upper or lower back (spinal flexion).',
      'Do not hyperextend your lower back backwards at the top.'
    ]
  },
  8: {
    id: 8,
    title: 'Carpal Tunnel Wrist & Forearm Extension',
    short_name: 'Wrist & Nerve Glide',
    subtitle: 'Radiocarpal Articulation & Median Nerve Mobilization',
    targetJoint: 'Wrist & Forearm (Radiocarpal)',
    recommendedView: 'Seated Forearm/Wrist View',
    targetRom: 24,
    targetReps: 5,
    steps: [
      {
        num: '01',
        title: 'Forearm Support',
        description: 'Sit with your forearm resting flat on a desk or armrest, with your wrist and fingers hanging over the edge.'
      },
      {
        num: '02',
        title: 'Active Extension',
        description: 'Slowly bend your wrist upward, raising your fingers toward the ceiling to reach 24°+ extension.'
      },
      {
        num: '03',
        title: 'Controlled Release',
        description: 'Pause at the top for 1 second, then slowly lower your wrist back down to neutral horizontal level.'
      }
    ],
    formTips: [
      'Keep your forearm resting completely flat on the surface.',
      'Keep fingers relaxed and lightly curved, not clenched.'
    ],
    commonMistakes: [
      'Do not shrug your shoulder or lean your body to lift hand.',
      'Do not twist or rotate your forearm side-to-side.'
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

function SvgGoniometerGauge({
  currentAngle = 0,
  targetAngle = 90,
  phase = 'Ready'
}: {
  currentAngle: number;
  targetAngle: number;
  phase: string;
}) {
  const clampedAngle = Math.max(0, Math.min(180, currentAngle));
  const clampedTarget = Math.max(0, Math.min(180, targetAngle));
  const needleDeg = -90 + (clampedAngle / 180) * 180;
  const targetDeg = -90 + (clampedTarget / 180) * 180;
  const isHit = clampedAngle >= clampedTarget;

  return (
    <div className="bg-[#09090b] p-3 rounded-2xl border border-zinc-800 flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono font-semibold mb-1">
        <span>Goniometer Excursion</span>
        <span
          className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
            isHit
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
          }`}
        >
          {isHit ? 'TARGET HIT' : phase}
        </span>
      </div>
      <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="60%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Arch Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#27272a"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Colored Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={isHit ? '#10b981' : 'url(#gaugeGrad)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (clampedAngle / 180) * 251.2}
            className="transition-all duration-150 ease-out"
            filter={isHit ? 'url(#gaugeGlow)' : undefined}
          />

          {/* Target ROM Tick Marker */}
          <g transform={`rotate(${targetDeg} 100 100)`}>
            <line x1="100" y1="14" x2="100" y2="28" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Rotating Needle */}
          <g transform={`rotate(${needleDeg} 100 100)`} className="transition-transform duration-150 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={isHit ? '#34d399' : '#14b8a6'}
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#gaugeGlow)"
            />
            <circle cx="100" cy="100" r="6" fill="#14b8a6" />
            <circle cx="100" cy="100" r="3" fill="#ffffff" />
          </g>

          {/* Degree labels */}
          <text x="22" y="108" fill="#71717a" fontSize="10" fontFamily="monospace">0°</text>
          <text x="94" y="24" fill="#a1a1aa" fontSize="10" fontFamily="monospace">90°</text>
          <text x="162" y="108" fill="#71717a" fontSize="10" fontFamily="monospace">180°</text>
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute bottom-0 text-center font-mono">
          <span className={`text-xl font-extrabold ${isHit ? 'text-emerald-400' : 'text-teal-300'}`}>
            {clampedAngle}°
          </span>
          <span className="text-[9px] text-zinc-500 block -mt-1 font-sans">
            / {clampedTarget}° Target
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
  const [useCanvasEngine, setUseCanvasEngine] = useState(true);
  const [useDirectFeed, setUseDirectFeed] = useState(true);
  const [retryNonce, setRetryNonce] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showHudOverlay, setShowHudOverlay] = useState(true);

  const activeMode = telemetry?.mode || 1;
  const activeGuide = EXERCISE_GUIDES[activeMode] || EXERCISE_GUIDES[1];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const connectedRef = useRef(false);
  const lastFrameTimeRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevRepsRef = useRef<number>(0);
  const prevHitRef = useRef<boolean>(false);

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

  // Zero-Lag Canvas Frame Pump (pulls instantaneous frame with 0 buffer accumulation & 30 FPS throttle)
  useEffect(() => {
    if (!isRunning || !useCanvasEngine) {
      connectedRef.current = false;
      return;
    }

    let active = true;
    let inFlight = false;
    let animId = 0;
    let consecutiveErrors = 0;

    async function pumpFrame() {
      if (!active || inFlight) return;

      // Throttle to ~33 FPS (30ms spacing) to match camera sensor rate & prevent CPU/socket thrashing
      const now = performance.now();
      if (now - lastFrameTimeRef.current < 30) {
        if (active) animId = requestAnimationFrame(pumpFrame);
        return;
      }

      inFlight = true;

      try {
        const host = typeof window !== 'undefined' ? (window.location.hostname || '127.0.0.1') : '127.0.0.1';
        const frameUrl = useDirectFeed
          ? `http://${host}:8000/frame.jpg`
          : '/api/video-feed?snapshot=1';

        const res = await fetch(frameUrl, {
          cache: 'no-store'
        });

        if (res.ok) {
          consecutiveErrors = 0;
          lastFrameTimeRef.current = performance.now();
          const blob = await res.blob();
          if (active && canvasRef.current) {
            const bitmap = await createImageBitmap(blob);
            const canvas = canvasRef.current;
            if (canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
              canvas.width = bitmap.width;
              canvas.height = bitmap.height;
            }
            const ctx = canvas.getContext('2d', { alpha: false });
            if (ctx) {
              ctx.drawImage(bitmap, 0, 0);
            }
            bitmap.close();

            // Only trigger state transition once to eliminate React re-render overhead
            if (!connectedRef.current) {
              connectedRef.current = true;
              setStreamConnected(true);
              setIsConnecting(false);
            }
          }
        } else {
          consecutiveErrors++;
        }
      } catch {
        consecutiveErrors++;
      } finally {
        inFlight = false;
        if (active) {
          // Graceful backoff during server startup / initialization
          if (consecutiveErrors > 3 && !connectedRef.current) {
            setTimeout(() => {
              if (active) animId = requestAnimationFrame(pumpFrame);
            }, 200);
          } else {
            animId = requestAnimationFrame(pumpFrame);
          }
        }
      }
    }

    animId = requestAnimationFrame(pumpFrame);

    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [isRunning, useCanvasEngine, useDirectFeed]);

  // Synthesized Web Audio Haptic Chimes (reusing single audio context to prevent Chrome audio leaks)
  const playChime = useCallback((type: 'rep' | 'target') => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (type === 'rep') {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(784, now);
        osc1.frequency.exponentialRampToValueAtTime(1046, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);
      } else if (type === 'target') {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1175, now);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch {
      // AudioContext unavailable
    }
  }, [audioEnabled]);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Track Reps and Target Hit for Audio Feedback
  useEffect(() => {
    if (!telemetry) return;
    const reps = telemetry.reps || 0;
    if (reps > prevRepsRef.current) {
      playChime('rep');
    }
    prevRepsRef.current = reps;

    const angle = telemetry.primary_angle || 0;
    const target = telemetry.target_rom || 90;
    const isHit = angle >= target;
    if (isHit && !prevHitRef.current) {
      playChime('target');
    }
    prevHitRef.current = isHit;
  }, [telemetry, playChime]);

  // Compute feed URL with cache-busting timestamp
  const getStreamUrl = useCallback(() => {
    if (typeof window === 'undefined') return '/api/video-feed';
    const host = window.location.hostname || '127.0.0.1';
    const base = useDirectFeed ? `http://${host}:8000/video_feed` : '/api/video-feed';
    return `${base}?t=${retryNonce}`;
  }, [useDirectFeed, retryNonce]);

  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');

  useEffect(() => {
    setCurrentStreamUrl(getStreamUrl());
  }, [getStreamUrl]);

  // Lock body scroll when in modal mode
  useEffect(() => {
    if (isModal || isFullscreen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isModal, isFullscreen]);

  // Poll live telemetry while session is active
  useEffect(() => {
    if (!isRunning) {
      connectedRef.current = false;
      setStreamConnected(false);
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);

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

  // Handle stream error with auto-reconnect retry loop
  const handleStreamError = useCallback(() => {
    connectedRef.current = false;
    setStreamConnected(false);
    setIsConnecting(true);

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Schedule next retry with cache busting
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
    setIsConnecting(true);
    setStreamConnected(false);
    setRetryNonce(Date.now());
  };

  const toggleFeedMode = () => {
    connectedRef.current = false;
    setIsConnecting(true);
    setStreamConnected(false);
    setUseDirectFeed((prev) => !prev);
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

  return (
    <div
      className={`bg-[#121215] border border-zinc-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl transition-all flex flex-col justify-between ${
        isFullscreen
          ? 'fixed inset-0 z-[100] rounded-none p-4 sm:p-6 overflow-y-auto bg-[#09090b]'
          : 'w-full'
      }`}
    >
      {/* Exercise "How To Do It" Interactive Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-teal-500/40 rounded-3xl p-5 sm:p-7 max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold uppercase">
                        Protocol {activeGuide.id} Technique Guide
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                        {activeGuide.targetJoint}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                      {activeGuide.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans mt-0.5">
                      {activeGuide.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGuideOpen(false)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Camera Setup Badge */}
              <div className="my-4 p-3 rounded-2xl bg-teal-950/30 border border-teal-500/30 flex items-center gap-3 text-xs text-teal-200 font-mono">
                <Compass className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="font-bold text-teal-300">Recommended Camera Position: </span>
                  <span>{activeGuide.recommendedView}</span> • <span>Target: {activeGuide.targetRom}° ROM</span>
                </div>
              </div>

              {/* Step Cards */}
              <div className="space-y-3 my-4">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Step-by-Step Movement Instructions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeGuide.steps.map((st) => (
                    <div
                      key={st.num}
                      className="p-3.5 rounded-2xl bg-[#09090b] border border-zinc-800 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-black font-mono text-teal-400 block mb-1">
                          Step {st.num}
                        </span>
                        <h5 className="text-sm font-bold text-zinc-100 mb-1.5">
                          {st.title}
                        </h5>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          {st.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Guard & Common Mistakes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                {/* Form Tips */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CLINICAL FORM DIRECTIVES (DO)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-emerald-200/90 font-sans">
                    {activeGuide.formTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>COMMON COMPENSATION MISTAKES (AVOID)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-rose-200/90 font-sans">
                    {activeGuide.commonMistakes.map((mst, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{mst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs font-mono transition-colors cursor-pointer"
              >
                Got It, Resume Exercise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800/80 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-sm flex-shrink-0">
            <Video className="w-5 h-5 animate-pulse stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-zinc-100 font-mono tracking-tight">
                Embedded Markerless MoCap Studio
              </h3>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 border transition-all ${
                  streamConnected
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    streamConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400 animate-pulse'
                  }`}
                />
                {streamConnected
                  ? telemetry?.fps
                    ? `${telemetry.fps} FPS • ${telemetry.latency_ms ?? 18}ms (0-LAG)`
                    : '30 FPS REAL-TIME (0-LAG)'
                  : 'CONNECTING OPTICS...'}
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-teal-400 border border-teal-500/30 font-mono">
                {useCanvasEngine ? '⚡ 0-Lag Canvas Core' : useDirectFeed ? 'Direct Loopback :8000' : 'Proxy Pipe Route'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              MediaPipe Tasks 33-point metric 3D skeleton tracking on local camera for{' '}
              <span className="text-teal-400 font-medium">{patientName || 'Patient'}</span>
            </p>
          </div>
        </div>

        {/* Studio Top Control Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
            title="Open Exercise Technique & Posture Guide"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button
            onClick={() => setShowHudOverlay(!showHudOverlay)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              showHudOverlay
                ? 'bg-teal-950/60 text-teal-300 border-teal-500/40'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
            }`}
            title="Toggle on-screen instruction HUD overlay"
          >
            {showHudOverlay ? <Eye className="w-3.5 h-3.5 text-teal-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
            <span className="hidden sm:inline">HUD</span>
          </button>

          <button
            onClick={handleToggleSkeleton}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              showSkeleton
                ? 'bg-teal-950/60 text-teal-300 border-teal-500/40'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
            }`}
            title="Toggle between 3D MoCap skeleton tracking and pure clean camera feed"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{showSkeleton ? 'MoCap Mesh' : 'Pure Camera'}</span>
          </button>

          <button
            onClick={() => setUseCanvasEngine(!useCanvasEngine)}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
              useCanvasEngine
                ? 'bg-teal-950/60 text-teal-300 border-teal-500/40'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
            title="Toggle between 0-Lag Canvas Engine and MJPEG Stream"
          >
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{useCanvasEngine ? '0-Lag Canvas' : 'MJPEG Stream'}</span>
          </button>
          <button
            onClick={toggleFeedMode}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5"
            title="Switch between direct port 8000 and proxy stream"
          >
            <Radio className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">{useDirectFeed ? 'Switch to Proxy' : 'Switch to Direct'}</span>
          </button>

          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              audioEnabled
                ? 'bg-zinc-900 hover:bg-zinc-800 text-teal-400 border-zinc-800'
                : 'bg-zinc-900/60 text-zinc-500 border-zinc-800/60'
            }`}
            title={audioEnabled ? 'Mute Kinetic Audio Chimes' : 'Unmute Kinetic Audio Chimes'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleManualReconnect}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors cursor-pointer"
            title="Reconnect Camera Stream"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-950/60 hover:text-rose-300 text-zinc-400 border border-zinc-800 text-xs transition-colors cursor-pointer"
              title="Minimize Camera Window"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* Left: Embedded Video Stream Viewport */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full">
          {/* Active Exercise Identification & Real-Time Technique Guide */}
          <div className="mb-3 p-4 rounded-2xl bg-[#09090b] border border-zinc-800 font-mono shadow-xl flex flex-col gap-3">
            {/* Top Row: Exercise Name, Anatomy, Stepper, and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-teal-400 animate-ping shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/40 font-bold uppercase tracking-wider">
                      Exercise {((telemetry?.queue_idx || 0) + 1)} of {(telemetry?.total_queue || 1)}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {activeGuide.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-sans mt-1 flex-wrap">
                    <span className="text-zinc-300 font-medium">
                      🎯 Target: <span className="text-teal-400 font-mono font-bold">{telemetry?.target_reps || activeGuide.targetReps} reps</span>
                    </span>
                    <span>•</span>
                    <span className="text-zinc-300 font-medium">
                      📐 Target ROM: <span className="text-teal-400 font-mono font-bold">{telemetry?.target_rom || activeGuide.targetRom}°</span>
                    </span>
                    <span>•</span>
                    <span className="text-teal-300 font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                      {activeGuide.targetJoint}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Open visual step-by-step movement guide"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                  <span>How To Do It</span>
                </button>

                <span
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold shadow-md flex items-center gap-1.5 transition-all ${
                    telemetry?.is_bad_form
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {telemetry?.is_bad_form ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span>{telemetry?.form_status || 'OPTIMAL FORM'}</span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Exact Live "How to do it" Step Callout */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-start sm:items-center gap-2 text-zinc-200 min-w-0">
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold text-[10px] uppercase shrink-0 border border-teal-500/30">
                  ACTION DIRECTIVE
                </span>
                <span className="font-sans text-xs text-zinc-100 font-medium">
                  {activeGuide.steps[1].description}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 font-sans text-[11px] shrink-0 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
                <span className="text-amber-400 font-bold font-mono">AVOID:</span>
                <span>{activeGuide.commonMistakes[0]}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Biomechanical Form Correction Alert Banner (Rendered by UI outside the video) */}
          {telemetry?.is_bad_form && (
            <div className="mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-zinc-950 border border-rose-500/50 shadow-lg shadow-rose-950/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 flex-shrink-0">
                  {telemetry?.correction_direction === 'DOWN' ? (
                    <ArrowDown className="w-5 h-5 text-rose-400 animate-bounce" />
                  ) : telemetry?.correction_direction === 'UP' ? (
                    <ArrowUp className="w-5 h-5 text-rose-400 animate-bounce" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-rose-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-200 font-mono tracking-wide flex items-center gap-2">
                    <span>CORRECTION:</span>
                    <span className="text-white font-extrabold bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/30">
                      {telemetry?.correction_cue || 'ADJUST FORM'}
                    </span>
                  </div>
                  <p className="text-xs text-rose-100 font-sans mt-0.5">
                    {telemetry?.feedback_text}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-300 bg-black/40 px-2.5 py-1 rounded-lg border border-rose-500/30 uppercase font-semibold hidden md:inline">
                Kinetic Guard Active
              </span>
            </div>
          )}

          {/* Auto-Advance Celebration Banner (Rendered in UI without covering the camera) */}
          {telemetry?.advancing && (
            <div className="mb-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-zinc-950 border border-emerald-500/60 shadow-xl flex items-center justify-between gap-4 animate-in fade-in zoom-in-95 duration-200 font-mono">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 flex-shrink-0 animate-bounce">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white tracking-tight">
                    EXERCISE COMPLETED!
                  </h4>
                  <p className="text-xs text-emerald-200 font-sans">
                    Goal met: <span className="font-bold text-white">{telemetry?.reps}/{telemetry?.target_reps} reps</span> • Peak ROM: <span className="font-bold text-white">{telemetry?.max_rom}°</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-black/50 px-3.5 py-1.5 rounded-xl border border-emerald-500/40">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Advancing in {telemetry?.remaining_advance_sec || 3}s...</span>
              </div>
            </div>
          )}

          {/* Video Viewport with Optional HUD Instruction Overlay */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black aspect-video shadow-2xl flex items-center justify-center group w-full">
            {/* On-Camera High-Contrast Heads-Up Display (HUD) */}
            {showHudOverlay && isRunning && streamConnected && (
              <div className="absolute inset-x-0 top-0 p-3 pointer-events-none flex items-start justify-between z-20 animate-in fade-in duration-200">
                <div className="bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-teal-500/40 text-white font-mono shadow-xl max-w-lg">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shrink-0" />
                    <span className="font-bold text-teal-300 tracking-tight">
                      P{activeGuide.id}: {activeGuide.short_name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans hidden sm:inline">
                      ({activeGuide.targetJoint})
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-200 font-sans mt-0.5 leading-snug">
                    👉 {activeGuide.steps[1].description}
                  </p>
                </div>

                <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-right font-mono shadow-xl">
                  <span className="text-xs font-bold text-teal-300 block">
                    {telemetry?.primary_angle || 0}° / {telemetry?.target_rom || activeGuide.targetRom}°
                  </span>
                  <span className="text-[9px] text-zinc-400 uppercase">
                    Reps: {telemetry?.reps || 0}/{telemetry?.target_reps || activeGuide.targetReps}
                  </span>
                </div>
              </div>
            )}

            {/* The Live Video Stream Canvas (Zero-Lag Engine) */}
            {isRunning && useCanvasEngine && (
              <canvas
                ref={canvasRef}
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  streamConnected ? 'opacity-100' : 'opacity-0 absolute'
                }`}
              />
            )}

            {/* Fallback MJPEG Image Stream */}
            {isRunning && !useCanvasEngine && (
              <img
                src={currentStreamUrl}
                alt="PhysioPulse AI Vision Stream"
                className={`w-full h-full object-contain transition-opacity duration-300 ${
                  streamConnected ? 'opacity-100' : 'opacity-0 absolute'
                }`}
                onLoad={handleStreamLoad}
                onError={handleStreamError}
              />
            )}

            {/* Connecting & Optical Calibration Overlay */}
            {(!streamConnected || !isRunning) && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-[#09090b] w-full h-full font-mono">
                <div className="relative w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-teal-400 mb-4 shadow-xl overflow-hidden">
                  <div className="absolute inset-0 bg-teal-500/10 animate-pulse" />
                  <Video className="w-9 h-9 stroke-[2] relative z-10" />
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent animate-scan" />
                </div>
                <h4 className="text-base font-bold text-zinc-100 mb-1 font-mono tracking-wide">
                  Calibrating 3D Kinematic Optical Stream...
                </h4>
                <p className="text-xs text-zinc-400 max-w-md mb-5 font-sans leading-relaxed">
                  Initializing MediaPipe Tasks 3D world pose landmarks and DirectShow camera capture.
                  Position your full body in the camera frame.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-teal-300 bg-teal-950/70 px-4 py-2 rounded-xl border border-teal-800/60 font-mono">
                    <Activity className="w-4 h-4 animate-spin text-teal-400" />
                    <span>Synchronizing 60Hz video feed...</span>
                  </div>
                  <button
                    onClick={handleManualReconnect}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                    <span>Retry Camera Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive On-Screen Control Bar */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#09090b] p-3 rounded-2xl border border-zinc-800 font-mono text-xs">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-sans text-xs">
                AI Voice Coach active (non-blocking kinetic feedback)
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <button
                onClick={handleSkipExercise}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                title="Skip this protocol and move to next"
              >
                <SkipForward className="w-3.5 h-3.5 text-teal-400" />
                <span>Skip Protocol [N]</span>
              </button>

              <button
                onClick={handleFinishEarly}
                className="px-4 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/70 transition-colors flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
                title="Conclude session and generate clinical assessment"
              >
                <StopCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Save & Generate Report [Q]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Biomechanics & Telemetry HUD */}
        <div className="lg:col-span-4 space-y-3 font-mono">
          {/* Active Reps & Queue Progress */}
          <div className="bg-[#09090b] p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
              <span className="uppercase text-[10px] tracking-wider font-bold">Queue Progress</span>
              <span className="text-teal-400 font-bold bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30 text-[10px]">
                Exercise {(telemetry?.queue_idx || 0) + 1} of {telemetry?.total_queue || 1}
              </span>
            </div>

            {/* Rep Counter */}
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-zinc-100 font-mono tracking-tight">
                  {telemetry?.reps || 0}
                </span>
                <span className="text-xs text-zinc-500 font-mono">reps</span>
              </div>
              <span className="text-xs text-zinc-400 font-medium font-sans">
                / {telemetry?.target_reps || 5} Target
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-teal-500/40"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      ((telemetry?.reps || 0) / Math.max(1, telemetry?.target_reps || 5)) * 100
                    )
                  )}%`
                }}
              />
            </div>
          </div>

          {/* Isometric Hold Gauge Card (When in Mode 3) */}
          {telemetry?.mode === 3 && (
            <div className="bg-[#09090b] p-3.5 rounded-2xl border border-teal-500/40 bg-teal-950/20 font-mono">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                <span className="uppercase text-[10px] tracking-wider font-bold flex items-center gap-1.5 text-teal-300">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Isometric Posture Hold
                </span>
                <span className="text-teal-400 font-bold font-mono text-xs">
                  {telemetry?.p3_hold_timer || 0}s / 15.0s
                </span>
              </div>
              <div className="w-full bg-zinc-800/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-zinc-700/50">
                <div
                  className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${Math.min(100, Math.round(((telemetry?.p3_hold_timer || 0) / 15.0) * 100))}%`
                  }}
                />
              </div>
            </div>
          )}

          {/* Interactive SVG Goniometer Gauge */}
          <SvgGoniometerGauge
            currentAngle={telemetry?.primary_angle || 0}
            targetAngle={telemetry?.target_rom || 90}
            phase={telemetry?.kinematic_phase || 'Ready'}
          />

          {/* Goniometric Live Angle & Peak ROM */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-semibold tracking-wider">
                Live Angle
              </span>
              <span className="text-2xl font-extrabold text-teal-400 tracking-tight">
                {telemetry?.primary_angle || 0}°
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5 font-sans">
                Target: {telemetry?.target_rom || 90}°
              </span>
            </div>

            <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1 font-semibold tracking-wider">
                Peak ROM
              </span>
              <span className="text-2xl font-extrabold text-zinc-100 tracking-tight">
                {telemetry?.max_rom || 0}°
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5 font-sans">Session Peak</span>
            </div>
          </div>

          {/* Kinematic Velocity & Motor Control Phase */}
          <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold tracking-wider">
                Kinematic Velocity
              </span>
              <span className="text-sm font-bold text-teal-300 font-mono flex items-center gap-1.5 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                {telemetry?.angular_velocity || 0} deg/s
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold tracking-wider">
                Motor Phase
              </span>
              <span className="text-xs font-bold text-zinc-200 font-mono uppercase bg-zinc-900 px-2.5 py-0.5 rounded-lg border border-zinc-800 inline-block mt-0.5">
                {telemetry?.kinematic_phase || 'Ready'}
              </span>
            </div>
          </div>

          {/* Bilateral Symmetry Score */}
          <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold font-mono tracking-wider">
                Bilateral Symmetry
              </span>
              <span
                className={`text-lg font-bold font-mono ${
                  (telemetry?.symmetry_score || 100) >= 80 ? 'text-teal-400' : 'text-rose-400'
                }`}
              >
                {telemetry?.symmetry_score || 100}% Symmetrical
              </span>
            </div>
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${
                (telemetry?.symmetry_score || 100) >= 80
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-400'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
              }`}
            >
              {(telemetry?.symmetry_score || 100) >= 80 ? 'OK' : 'VAR'}
            </div>
          </div>

          {/* Active Exercise Movement Directives Card */}
          <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800 font-mono">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-zinc-800/80">
              <span className="text-[10px] text-teal-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                Movement Checklist
              </span>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="text-[10px] text-teal-300 hover:text-teal-200 underline cursor-pointer"
              >
                Technique Guide
              </button>
            </div>

            <div className="space-y-1.5 text-xs font-sans">
              <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <span className="font-mono text-[9px] font-bold text-teal-400 uppercase block">1. Setup</span>
                <p className="text-zinc-300 text-[11px] leading-tight mt-0.5">{activeGuide.steps[0].description}</p>
              </div>
              <div className="p-2 rounded-xl bg-teal-950/20 border border-teal-500/30">
                <span className="font-mono text-[9px] font-bold text-teal-300 uppercase block">2. Movement Action</span>
                <p className="text-zinc-100 text-[11px] leading-tight mt-0.5 font-medium">{activeGuide.steps[1].description}</p>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900/70 border border-zinc-800">
                <span className="font-mono text-[9px] font-bold text-teal-400 uppercase block">3. Return Cadence</span>
                <p className="text-zinc-300 text-[11px] leading-tight mt-0.5">{activeGuide.steps[2].description}</p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-start gap-1.5 text-[11px] text-rose-300 font-sans">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span><strong className="font-mono text-rose-400 font-bold">Avoid: </strong>{activeGuide.commonMistakes[0]}</span>
            </div>
          </div>

          {/* AI Coach Audio Feedback Transcript */}
          <div className="bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-1.5 text-xs text-teal-400 font-bold mb-1 font-mono">
              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-Time Clinical Biofeedback</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans italic">
              "{telemetry?.feedback_text || 'Position yourself in front of camera to begin exercise...'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

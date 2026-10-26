'use client';

import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Sparkles,
  StopCircle
} from 'lucide-react';

export interface EmbeddedVisionStudioProps {
  isRunning: boolean;
  onConcludeSession: () => void;
  patientName: string;
}

export function EmbeddedVisionStudio({
  isRunning,
  onConcludeSession,
  patientName
}: EmbeddedVisionStudioProps) {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [streamError, setStreamError] = useState(false);
  const [streamSource, setStreamSource] = useState('/api/video-feed');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Poll live telemetry while session is active
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/vision-control?action=status');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setTelemetry(json.data);
            setStreamError(false);
          }
        }
      } catch {
        // Stream warming up
      }
    }, 350);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Fallback to direct localhost port if proxy has delay
  const handleStreamError = () => {
    if (streamSource === '/api/video-feed') {
      setStreamSource('http://127.0.0.1:8000/video_feed');
    } else {
      setStreamError(true);
    }
  };

  const handleSkipExercise = async () => {
    try {
      await fetch('/api/vision-control?action=skip');
    } catch (err) {
      console.warn('Failed to send skip action:', err);
    }
  };

  const handleFinishEarly = async () => {
    try {
      await fetch('/api/vision-control?action=quit');
      onConcludeSession();
    } catch (err) {
      console.warn('Failed to send quit action:', err);
    }
  };

  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm transition-all theme-card ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-auto bg-white/98' : ''
      }`}
    >
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
            <Video className="w-4 h-4 animate-pulse stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Embedded Computer Vision Studio
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                ACTIVE CAMERA FEED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              MediaPipe 33-landmark pose tracking running on-device for {patientName || 'Patient'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Embedded Video Stream Viewport */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video shadow-xs flex items-center justify-center group">
            {isRunning && !streamError ? (
              <img
                src={streamSource}
                alt="PhysioPulse AI Vision Stream"
                className="w-full h-full object-contain"
                onError={handleStreamError}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900 w-full h-full font-mono text-slate-300">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3 animate-pulse">
                  <Video className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-100 mb-1 font-sans">
                  Vision Engine Connecting...
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4 font-sans">
                  Webcam stream initializing with MediaPipe Tasks precision model. Ensure your camera is connected and illuminated.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-800/50">
                  <Activity className="w-3.5 h-3.5 animate-spin" />
                  <span>Mounting embedded video feed...</span>
                </div>
              </div>
            )}

            {/* In-Viewport Live Overlay Top Bar */}
            {telemetry && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-white font-bold shadow-md">
                  {telemetry.protocol_name || 'Protocol Active'}
                </span>

                <span
                  className={`px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-mono font-bold shadow-md ${
                    telemetry.is_bad_form
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
                  }`}
                >
                  {telemetry.form_status || 'OPTIMAL FORM'}
                </span>
              </div>
            )}

            {/* Advancing Celebration Modal Overlay */}
            {telemetry && telemetry.advancing && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200 font-mono">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-1">
                  EXERCISE COMPLETED!
                </h3>
                <p className="text-sm text-slate-300 mb-3 font-sans">
                  Target Reps Achieved ({telemetry.reps}/{telemetry.target_reps}) | Peak ROM: {telemetry.max_rom}°
                </p>
                <span className="text-xs text-emerald-400 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
                  Advancing to next protocol in queue...
                </span>
              </div>
            )}
          </div>

          {/* Interactive On-Screen Control Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 font-sans text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-sans font-medium">Voice Coach active (non-blocking kinematic audio)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipExercise}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer font-semibold font-sans"
              >
                <SkipForward className="w-3.5 h-3.5 text-blue-600" />
                <span>Skip Exercise</span>
              </button>

              <button
                onClick={handleFinishEarly}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer font-bold font-sans shadow-xs"
              >
                <StopCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Finish & Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry & Biomechanics HUD */}
        <div className="lg:col-span-4 space-y-3.5 font-sans">
          {/* Active Reps & Queue Progress */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
              <span className="uppercase text-[10px] tracking-wider font-bold">Queue Progress</span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 text-[10px]">
                Exercise {(telemetry?.queue_idx || 0) + 1} of {telemetry?.total_queue || 1}
              </span>
            </div>

            {/* Rep Counter */}
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {telemetry?.reps || 0}
              </span>
              <span className="text-xs text-slate-500 font-medium font-sans">
                / {telemetry?.target_reps || 5} Target Reps
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((telemetry?.reps || 0) / Math.max(1, telemetry?.target_reps || 5)) * 100)
                  )}%`
                }}
              />
            </div>
          </div>

          {/* Goniometric Angle & Peak ROM */}
          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block mb-1 font-semibold font-sans">Live Angle</span>
              <span className="text-2xl font-extrabold text-blue-600">
                {telemetry?.primary_angle || 0}°
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                Target: {telemetry?.target_rom || 90}°
              </span>
            </div>

            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase block mb-1 font-semibold font-sans">Peak ROM</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {telemetry?.max_rom || 0}°
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-sans">
                Session Peak
              </span>
            </div>
          </div>

          {/* Symmetry Score */}
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold font-mono">Bilateral Symmetry</span>
              <span
                className={`text-lg font-bold font-mono ${
                  (telemetry?.symmetry_score || 100) >= 80 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {telemetry?.symmetry_score || 100}% Score
              </span>
            </div>
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs ${
                (telemetry?.symmetry_score || 100) >= 80
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {(telemetry?.symmetry_score || 100) >= 80 ? 'OK' : 'VAR'}
            </div>
          </div>

          {/* AI Coach Audio Feedback Transcript */}
          <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold mb-1.5 font-sans">
              <Volume2 className="w-3.5 h-3.5" />
              <span>AI Coach Feedback</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              "{telemetry?.feedback_text || 'Position yourself in camera view to begin...'}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

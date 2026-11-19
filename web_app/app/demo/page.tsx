'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Video, Volume2, ShieldCheck } from 'lucide-react';
import { PhysioPulsePromo } from '@/remotion/PhysioPulsePromo';
import type { PlayerRef } from '@remotion/player';

// Dynamically import Remotion Player to ensure zero SSR hydration issues
const Player = dynamic(
  () => import('@remotion/player').then((mod) => mod.Player),
  { ssr: false }
);

export default function RemotionDemoPage() {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleJumpTo = (frameNumber: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frameNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#090E1A] text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="h-18 px-6 sm:px-12 border-b border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
              PhysioPulse AI
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                Remotion 1080p
              </span>
            </h1>
          </div>
        </div>

        {/* Concept Animation Pill Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Concept Animation • 20s @ 30 FPS</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
        {/* Video Player Card */}
        <div className="w-full max-w-5xl rounded-3xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl relative aspect-video flex items-center justify-center">
          <Player
            ref={playerRef}
            component={PhysioPulsePromo}
            durationInFrames={600}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            controls
            autoPlay
            loop
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '16/9'
            }}
          />
        </div>

        {/* Quick Chapter Scrubber Controls */}
        <div className="w-full max-w-5xl mt-6 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mr-2">
              Jump To Milestone:
            </span>
            <button
              onClick={() => handleJumpTo(0)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition-all cursor-pointer"
            >
              0s: Rx Ingest
            </button>
            <button
              onClick={() => handleJumpTo(75)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition-all cursor-pointer"
            >
              2.5s: AI Plan
            </button>
            <button
              onClick={() => handleJumpTo(140)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition-all cursor-pointer"
            >
              4.5s: Vision Studio
            </button>
            <button
              onClick={() => handleJumpTo(240)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              8s: ⚠️ Shrug Detected
            </button>
            <button
              onClick={() => handleJumpTo(390)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition-all cursor-pointer"
            >
              13s: 128° Peak ROM
            </button>
            <button
              onClick={() => handleJumpTo(495)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-black text-xs font-semibold transition-all cursor-pointer"
            >
              16.5s: Team Outro
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-mono text-emerald-400 font-bold">1920 × 1080</span>
            <span>•</span>
            <span className="font-mono">30 FPS (600 frames)</span>
          </div>
        </div>

        {/* Technical Specification Ribbon */}
        <div className="w-full max-w-5xl mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              useCurrentFrame Kinematics
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Goniometer sweeps smoothly from 0° to 128° with bar filling proportionately, zero jitter or dropped frames.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wide">
              Frame 240 (8.0s) Shrug Trigger
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Flashes the red warning banner, pulses the vector, and triggers VoiceCoach caption: &ldquo;Avoid shoulder shrug!&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
              Team Ctrl Alt Elite Outro
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Morphs from clinical telemetry to the emerald PhysioPulse logo, Aarambhathon track, and team credits.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

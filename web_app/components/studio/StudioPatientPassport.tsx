'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Heart, Activity, QrCode } from 'lucide-react';

export function StudioPatientPassport() {
  const ecgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bpCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live ECG & Blood Pressure Canvas wave animations
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;

      // Render ECG Wave
      const ecgCanvas = ecgCanvasRef.current;
      if (ecgCanvas) {
        const ctx = ecgCanvas.getContext('2d');
        if (ctx) {
          const w = ecgCanvas.width;
          const h = ecgCanvas.height;
          ctx.clearRect(0, 0, w, h);

          ctx.strokeStyle = '#1865F2';
          ctx.lineWidth = 1.75;
          ctx.lineCap = 'round';
          ctx.beginPath();

          for (let x = 0; x < w; x++) {
            const phase = (x / w) * 6 + t;
            const cycle = phase % 2;
            let yOffset = 0;

            if (cycle > 0.4 && cycle < 0.45) {
              yOffset = -12; // P wave
            } else if (cycle > 0.48 && cycle < 0.5) {
              yOffset = 4; // Q dip
            } else if (cycle >= 0.5 && cycle < 0.54) {
              yOffset = -22; // R peak
            } else if (cycle >= 0.54 && cycle < 0.57) {
              yOffset = 8; // S dip
            } else if (cycle > 0.65 && cycle < 0.73) {
              yOffset = -8; // T wave
            }

            const y = h / 2 + yOffset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // Render Arterial Blood Pressure Wave
      const bpCanvas = bpCanvasRef.current;
      if (bpCanvas) {
        const ctx = bpCanvas.getContext('2d');
        if (ctx) {
          const w = bpCanvas.width;
          const h = bpCanvas.height;
          ctx.clearRect(0, 0, w, h);

          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1.75;
          ctx.lineCap = 'round';
          ctx.beginPath();

          for (let x = 0; x < w; x++) {
            const phase = (x / w) * 5 + t * 0.9;
            const cycle = phase % 2;
            let yOffset = 0;

            if (cycle < 0.3) {
              yOffset = -16 * Math.sin((cycle / 0.3) * Math.PI); // Systolic peak
            } else if (cycle >= 0.3 && cycle < 0.45) {
              yOffset = -5 * Math.sin(((cycle - 0.3) / 0.15) * Math.PI); // Dicrotic notch
            } else {
              yOffset = 2; // Diastolic runoff
            }

            const y = h / 2 + yOffset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full lg:w-[280px] shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm relative z-10 flex flex-col justify-between theme-card">
      {/* Top Patient Avatar & Status */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/patient_curtis.png"
                alt="Curtis Valk"
                width={52}
                height={52}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight font-sans">
                Curtis Valk
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                PID #HLX-88214
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Patient QR Token: HLX-CURTIS-88214-VERIFIED')}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            title="Scan Patient QR"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center font-mono">
          <div className="bg-slate-50/70 rounded-xl p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Age</span>
            <span className="font-bold text-slate-800 text-xs">34</span>
          </div>
          <div className="bg-slate-50/70 rounded-xl p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Height</span>
            <span className="font-bold text-slate-800 text-xs">182 cm</span>
          </div>
          <div className="bg-slate-50/70 rounded-xl p-2 border border-slate-100">
            <span className="text-[10px] text-slate-400 block font-sans">Weight</span>
            <span className="font-bold text-slate-800 text-xs">78 kg</span>
          </div>
        </div>

        {/* Live Kinematic Waveform Monitors */}
        <div className="mt-4 space-y-3">
          {/* ECG Waveform Card */}
          <div className="bg-slate-50/60 rounded-2xl p-3 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span className="text-[11px] font-sans">Heart Rate (ECG)</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-xs">
                72 <span className="text-[10px] text-slate-400 font-normal">BPM</span>
              </span>
            </div>
            <div className="h-10 w-full bg-white rounded-xl border border-slate-100 overflow-hidden relative">
              <canvas
                ref={ecgCanvasRef}
                width={240}
                height={40}
                className="w-full h-full block"
              />
            </div>
          </div>

          {/* Blood Pressure Waveform Card */}
          <div className="bg-slate-50/60 rounded-2xl p-3 border border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span className="text-[11px] font-sans">Arterial BP</span>
              </div>
              <span className="font-mono font-bold text-slate-900 text-xs">
                120/75 <span className="text-[10px] text-slate-400 font-normal">mmHg</span>
              </span>
            </div>
            <div className="h-10 w-full bg-white rounded-xl border border-slate-100 overflow-hidden relative">
              <canvas
                ref={bpCanvasRef}
                width={240}
                height={40}
                className="w-full h-full block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Plan Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-slate-400 text-[10px] uppercase font-mono">Plan Status</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
            Day 14 Active
          </span>
        </div>
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[10px] text-slate-400 block font-mono">Diagnosis</span>
          <p className="text-[11px] font-semibold text-slate-800 leading-snug mt-0.5">
            Rotator Cuff Impingement & Cervical Posture Guard
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

export function TimeTrackerCard() {
  const [seconds, setSeconds] = useState<number>(5048); // Initialized to 01:24:08
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F3523] via-[#14422C] to-[#184E34] text-white p-5.5 shadow-2xs flex flex-col justify-between h-full min-h-[220px]">
      {/* Background flowing wave contours */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full object-cover">
          <path
            d="M 0 50 Q 50 100 100 50 T 200 50 L 200 200 L 0 200 Z"
            fill="none"
            stroke="#48BA80"
            strokeWidth="3"
          />
          <path
            d="M 0 80 Q 50 130 100 80 T 200 80"
            fill="none"
            stroke="#86EFAC"
            strokeWidth="1.5"
          />
          <path
            d="M 0 110 Q 50 160 100 110 T 200 110"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
          />
          <path
            d="M 0 140 Q 50 190 100 140 T 200 140"
            fill="none"
            stroke="#059669"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <span className="text-sm font-semibold text-emerald-100/90 tracking-tight">
          Time Tracker
        </span>
      </div>

      {/* Large Digital Clock readout */}
      <div className="relative z-10 my-auto text-center py-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-widest font-mono text-white drop-shadow-sm">
          {formatTime(seconds)}
        </span>
      </div>

      {/* Media Controls */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        {/* Pause / Play Button */}
        <button
          type="button"
          onClick={toggleTimer}
          className="w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          title={isRunning ? 'Pause Timer' : 'Resume Timer'}
        >
          {isRunning ? (
            <Pause className="w-4 h-4 fill-slate-900" />
          ) : (
            <Play className="w-4 h-4 fill-slate-900 ml-0.5" />
          )}
        </button>

        {/* Stop / Reset Button */}
        <button
          type="button"
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer"
          title="Stop & Reset Timer"
        >
          <Square className="w-3.5 h-3.5 fill-white" />
        </button>
      </div>
    </div>
  );
}

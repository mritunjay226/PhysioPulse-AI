'use client';

import React from 'react';

interface ProgressCardProps {
  percentage?: number;
  label?: string;
}

export function ProjectProgressCard({
  percentage = 41,
  label = 'Project Ended',
}: ProgressCardProps) {
  // Semi-circle SVG coordinates calculation
  // Radius = 70, Stroke = 18, Center = (100, 95)
  // Arc path from (25, 95) to (175, 95)
  // Circumference of semi-circle = Math.PI * r = 3.14159 * 70 = ~220
  const circumference = Math.PI * 70;
  const completedStroke = (percentage / 100) * circumference;

  return (
    <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-base tracking-tight font-sans">
          Project Progress
        </h3>
      </div>

      {/* Semi-circular gauge graphic */}
      <div className="relative flex flex-col items-center justify-center my-1">
        <svg className="w-56 h-32 overflow-visible" viewBox="0 0 200 110">
          <defs>
            <pattern
              id="gaugeHatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="6" stroke="#CBD5E1" strokeWidth="2" />
            </pattern>
          </defs>

          {/* Background / Pending track (grey hatched) */}
          <path
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="url(#gaugeHatch)"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* In-Progress Track (Forest Green) */}
          <path
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="#184E34"
            strokeWidth="20"
            strokeDasharray={`${circumference * 0.7} ${circumference}`}
            strokeDashoffset="0"
          />

          {/* Completed Track (Mint Green) */}
          <path
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="#48BA80"
            strokeWidth="20"
            strokeDasharray={`${completedStroke} ${circumference}`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute top-12 flex flex-col items-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {percentage}%
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {label}
          </span>
        </div>
      </div>

      {/* Legend below gauge */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-600 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#48BA80]" />
          <span className="text-[11px]">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#184E34]" />
          <span className="text-[11px]">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-[11px]">Pending</span>
        </div>
      </div>
    </div>
  );
}

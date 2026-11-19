'use client';

import React, { useState } from 'react';

export function ProjectAnalyticsCard() {
  const [activeDay, setActiveDay] = useState<string>('T');

  const days = [
    { label: 'S', height: 60, type: 'hatched', value: '45%' },
    { label: 'M', height: 85, type: 'dark-solid', value: '88%' },
    { label: 'T', height: 70, type: 'mint-solid', value: '76%', showBadge: true },
    { label: 'W', height: 100, type: 'forest-solid', value: '95%' },
    { label: 'T', height: 75, type: 'hatched', value: '62%' },
    { label: 'F', height: 50, type: 'hatched', value: '40%' },
    { label: 'S', height: 65, type: 'hatched', value: '55%' },
  ];

  return (
    <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base tracking-tight font-sans">
          Project Analytics
        </h3>
      </div>

      {/* Bar Chart Container */}
      <div className="relative flex items-end justify-between h-48 px-2 pt-8 pb-2">
        {/* SVG Definition for diagonal stripes */}
        <svg className="absolute w-0 h-0">
          <defs>
            <pattern
              id="diagonalHatch"
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#A8BDB2"
                strokeWidth="2"
              />
            </pattern>
          </defs>
        </svg>

        {days.map((item, idx) => {
          const isSelected = activeDay === item.label && idx === 2;

          return (
            <div
              key={`${item.label}-${idx}`}
              className="flex flex-col items-center gap-2 group cursor-pointer relative"
              onClick={() => setActiveDay(item.label)}
            >
              {/* Tooltip Badge for Tuesday (76%) or hovered */}
              {item.showBadge && (
                <div className="absolute -top-7 flex flex-col items-center z-10 animate-bounce duration-1000">
                  <div className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold shadow-2xs border border-slate-200">
                    {item.value}
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-200 rotate-45 -mt-0.5" />
                </div>
              )}

              {/* Capsule / Pill Column */}
              <div
                className="w-8 sm:w-9 rounded-full transition-all duration-300 group-hover:scale-105"
                style={{
                  height: `${item.height * 1.3}px`,
                  backgroundColor:
                    item.type === 'dark-solid'
                      ? '#184E34'
                      : item.type === 'mint-solid'
                      ? '#48BA80'
                      : item.type === 'forest-solid'
                      ? '#113E28'
                      : undefined,
                  backgroundImage:
                    item.type === 'hatched'
                      ? 'repeating-linear-gradient(45deg, #CFDCD4, #CFDCD4 2.5px, transparent 2.5px, transparent 6px)'
                      : undefined,
                  borderColor: item.type === 'hatched' ? '#B8CCC1' : 'transparent',
                  borderWidth: item.type === 'hatched' ? '1px' : '0px',
                }}
              />

              {/* Day Label */}
              <span
                className={`text-xs font-semibold ${
                  isSelected ? 'text-[#184E34]' : 'text-slate-400 group-hover:text-slate-700'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function DealDeckHabitsCard() {
  const [selectedDay, setSelectedDay] = useState('Thu');

  const chartData = [
    { day: 'Mon', greyHeight: 50, blueHeight: 65, greyVal: '80°', blueVal: '95°' },
    { day: 'Tue', greyHeight: 70, blueHeight: 85, greyVal: '90°', blueVal: '105°' },
    { day: 'Wed', greyHeight: 60, blueHeight: 75, greyVal: '85°', blueVal: '100°' },
    { day: 'Thu', greyHeight: 80, blueHeight: 100, greyVal: '108° Target', blueVal: '141° Peak ROM', hasTooltip: true },
    { day: 'Fri', greyHeight: 55, blueHeight: 70, greyVal: '85°', blueVal: '98°' },
    { day: 'Sat', greyHeight: 65, blueHeight: 80, greyVal: '90°', blueVal: '110°' },
    { day: 'Sun', greyHeight: 60, blueHeight: 75, greyVal: '85°', blueVal: '102°' },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-slate-900 text-base font-sans tracking-tight">
            Daily Movement Consistency
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Prescribed target degrees vs achieved range of motion
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span>This week</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-6 mt-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-slate-500">Prescribed Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3B66F5]" />
          <span className="text-slate-700 font-semibold">Achieved Motion</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex items-end justify-between h-56 pt-8 pb-4 px-2">
        {/* Y Axis Guide Lines */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[10px] text-slate-300 font-mono pr-2">
          <div className="border-b border-dashed border-slate-100 pb-1">150°</div>
          <div className="border-b border-dashed border-slate-100 pb-1">120°</div>
          <div className="border-b border-dashed border-slate-100 pb-1">90°</div>
          <div className="border-b border-dashed border-slate-100 pb-1">45°</div>
          <div className="pb-1">0°</div>
        </div>

        {/* Grouped Bars */}
        <div className="relative z-10 w-full flex items-end justify-around pl-8">
          {chartData.map((item) => (
            <div
              key={item.day}
              className="relative flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => setSelectedDay(item.day)}
            >
              {/* Floating Tooltip (shown on Thursday or hovered) */}
              {(item.hasTooltip || selectedDay === item.day) && (
                <div className="absolute -top-16 z-20 bg-slate-900 text-white rounded-2xl py-2 px-3.5 shadow-xl text-[11px] whitespace-nowrap animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    <span>{item.greyVal}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#3B66F5]" />
                    <span className="text-blue-300">{item.blueVal}</span>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                </div>
              )}

              {/* Paired Bars Container */}
              <div className="flex items-end gap-1.5">
                {/* Grey Bar (Prescribed) */}
                <div
                  className="w-5 sm:w-6 bg-slate-200 group-hover:bg-slate-300 rounded-full transition-all duration-300"
                  style={{ height: `${item.greyHeight * 1.5}px` }}
                />
                {/* Blue Bar (Achieved) */}
                <div
                  className="w-5 sm:w-6 bg-[#3B66F5] group-hover:bg-[#254EDB] rounded-full transition-all duration-300"
                  style={{ height: `${item.blueHeight * 1.5}px` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

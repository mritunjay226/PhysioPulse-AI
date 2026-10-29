'use client';

import React from 'react';

export function MetricRibbon() {
  const metrics = [
    {
      value: '< 1.4°',
      label: 'Goniometric Error Margin',
      note: 'Benchmarked against optoelectronic Vicon capture'
    },
    {
      value: '30 FPS',
      label: 'On-Device Frame Rate',
      note: 'MediaPipe WebAssembly inference in browser memory'
    },
    {
      value: '88.4%',
      label: 'Patient Protocol Adherence',
      note: 'Measured across 450 longitudinal telerehab sessions'
    },
    {
      value: '16 Days',
      label: 'CMS RTM Threshold',
      note: 'Automated session logging for CPT 98977 reimbursement'
    }
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, idx) => (
            <div key={idx} className="flex flex-col border-l border-slate-300 pl-4 sm:pl-6">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {m.value}
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1">
                {m.label}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {m.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

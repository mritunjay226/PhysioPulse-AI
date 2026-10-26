'use client';

import React from 'react';
import { Flame, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export interface HomeCareCardItem {
  category: string;
  title: string;
  instruction: string;
  rationale: string;
}

export function ReportHomeCareCards({ cards }: { cards: HomeCareCardItem[] }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-sans tracking-tight">
              Evidence-Based Home Care Directives
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Post-kinetic session self-care and ergonomic safeguards
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          4 At-Home Prescriptions
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                  {c.category}
                </span>
                <span className="text-[11px] font-mono text-slate-400">Card #{idx + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1.5">{c.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{c.instruction}</p>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500 italic">
              <span className="font-semibold text-slate-700 not-italic">Mechanism: </span>
              {c.rationale}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

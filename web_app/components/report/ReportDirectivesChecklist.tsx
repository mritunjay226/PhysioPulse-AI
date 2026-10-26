'use client';

import React from 'react';
import { CheckCircle2, Copy, Check, Sparkles, FileText } from 'lucide-react';

export interface ClinicalDirectiveItem {
  category: string;
  title: string;
  instruction: string;
  rationale: string;
}

export interface ReportDirectivesChecklistProps {
  directives: ClinicalDirectiveItem[];
  checkedDirectives: Record<number, boolean>;
  onToggleDirective: (idx: number) => void;
  onCopyDirectives: () => void;
  copiedDirectives: boolean;
}

export function ReportDirectivesChecklist({
  directives,
  checkedDirectives,
  onToggleDirective,
  onCopyDirectives,
  copiedDirectives
}: ReportDirectivesChecklistProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-sans tracking-tight">
              Physiatrist Clinical Directives & Discharge Protocol
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              Interactive clinical checklist for patient home rehabilitation
            </p>
          </div>
        </div>

        <button
          onClick={onCopyDirectives}
          className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs"
        >
          {copiedDirectives ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Directives Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Instructions</span>
            </>
          )}
        </button>
      </div>

      {/* Directives Checklist */}
      <div className="space-y-3 font-sans">
        {directives.map((dir, idx) => {
          const isDone = !!checkedDirectives[idx];
          return (
            <div
              key={idx}
              onClick={() => onToggleDirective(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isDone
                  ? 'bg-slate-50/50 border-slate-200 opacity-70'
                  : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-300 shadow-xs'
              }`}
            >
              <div className="mt-0.5">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleDirective(idx)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold">
                    {dir.category}
                  </span>
                  <h4
                    className={`text-sm font-bold tracking-tight ${
                      isDone ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {dir.title}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                  {dir.instruction}
                </p>

                <div className="text-[11px] text-slate-500 font-sans italic bg-white/70 p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700 not-italic">Clinical Rationale: </span>
                  {dir.rationale}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

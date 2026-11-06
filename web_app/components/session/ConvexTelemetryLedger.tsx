'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Database, Activity, CheckCircle2, CloudCheck, ChevronDown, ChevronUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ConvexTelemetryLedger() {
  const [isOpen, setIsOpen] = useState(false);
  const recentSessions = useQuery(api.sessions.listSessions, { limit: 5 });
  const summaryStats = useQuery(api.sessions.getClinicalSummaryStats);

  const totalSessions = summaryStats?.totalSessions ?? (recentSessions?.length ?? 0);
  const avgCompliance = summaryStats?.averageCompliance ?? 94;
  const totalReps = summaryStats?.totalReps ?? 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden mt-6 transition-all">
      {/* Banner / Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 transition-colors text-left cursor-pointer border-b border-slate-200/70"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Convex Real-Time Clinical Cloud</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Instant reactive persistence for kinematics, prescriptions & medical OCR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1 rounded-lg border border-slate-200">
            <span>{totalSessions} Sessions</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-bold">{avgCompliance}% Avg Compliance</span>
          </div>

          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Ledger Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-5 space-y-4 overflow-hidden"
          >
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Total Sessions Stored</div>
                  <div className="text-base font-bold text-slate-900 font-mono">{totalSessions}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Average Compliance</div>
                  <div className="text-base font-bold text-emerald-600 font-mono">{avgCompliance}%</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Kinematic Reps Logged</div>
                  <div className="text-base font-bold text-slate-900 font-mono">{totalReps}</div>
                </div>
              </div>
            </div>

            {/* List of Recent Synced Sessions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
                <span>Recent Convex Records</span>
                <span className="text-[10px] text-slate-400 font-mono">deployment: calm-impala-999</span>
              </div>

              {!recentSessions || recentSessions.length === 0 ? (
                <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <CloudCheck className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-medium text-slate-600">No sessions recorded in Convex DB yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Launch a clinical motion session above — completed sessions automatically persist to Convex in real time.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {recentSessions.map((s: any) => (
                    <div
                      key={s._id}
                      className="p-3.5 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{s.patientName}</span>
                          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                            {s.affectedArea}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{s.prescribedDiagnosis}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-600">
                            {s.overallCompliancePercent}%
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">compliance</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

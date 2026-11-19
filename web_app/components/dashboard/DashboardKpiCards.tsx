'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface KpiCardsProps {
  totalSessions?: number;
  completedSessions?: number;
  runningSessions?: number;
  pendingSessions?: number;
}

export function DashboardKpiCards({
  totalSessions = 24,
  completedSessions = 10,
  runningSessions = 12,
  pendingSessions = 2,
}: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {/* 1. Featured Dark Forest Green Card: Total Projects / Sessions */}
      <div className="relative overflow-hidden rounded-3xl bg-[#184E34] text-white p-5.5 flex flex-col justify-between min-h-[160px] shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-emerald-100/90 tracking-tight">
            Total Projects
          </span>
          <Link
            href="/dashboard/sessions"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs flex items-center justify-center text-white transition-colors cursor-pointer"
            title="View all projects & sessions"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="my-2">
          <span className="text-4xl font-extrabold tracking-tight font-sans">
            {totalSessions}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#256345] text-emerald-200 text-xs font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-300" />
            <span>5 Increased from last month</span>
          </div>
        </div>
      </div>

      {/* 2. Ended Projects / Completed Sessions */}
      <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 flex flex-col justify-between min-h-[160px] shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 tracking-tight">
            Ended Projects
          </span>
          <Link
            href="/dashboard/sessions"
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="View completed sessions"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="my-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            {completedSessions}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Increased from last month</span>
          </div>
        </div>
      </div>

      {/* 3. Running Projects / Active Regimens */}
      <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 flex flex-col justify-between min-h-[160px] shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 tracking-tight">
            Running Projects
          </span>
          <Link
            href="/dashboard/progress"
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="View active recovery progress"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="my-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            {runningSessions}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Increased from last month</span>
          </div>
        </div>
      </div>

      {/* 4. Pending Project / Clinical Review */}
      <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 flex flex-col justify-between min-h-[160px] shadow-2xs transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 tracking-tight">
            Pending Project
          </span>
          <Link
            href="/dashboard/sessions"
            className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            title="View pending reviews"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="my-2">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-sans">
            {pendingSessions}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-slate-400 font-medium">
            On Discuss
          </span>
        </div>
      </div>
    </div>
  );
}

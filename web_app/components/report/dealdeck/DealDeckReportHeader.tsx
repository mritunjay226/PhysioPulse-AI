'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, Printer } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface DealDeckReportHeaderProps {
  title?: string;
  subtitleDate?: string;
}

export function DealDeckReportHeader({
  title = 'Recovery Report',
  subtitleDate,
}: DealDeckReportHeaderProps) {
  const { user } = useUser();
  const convexUser = useQuery(api.users.currentUser);

  // Format formatted date
  const displayDate =
    subtitleDate ||
    new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date());

  const displayName =
    convexUser?.name ||
    user?.fullName ||
    user?.firstName ||
    'Mritunjay Mishra';

  const avatarUrl =
    user?.imageUrl ||
    convexUser?.imageUrl ||
    '/patient_curtis.png';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">
          {displayDate}
        </p>
      </div>

      <div className="flex items-center gap-2.5 print:hidden">
        {/* Print Report Button */}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#184E34] hover:bg-[#123E28] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Print or Save PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>

        {/* Circular Search Icon */}
        <button
          type="button"
          onClick={() => {}}
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          title="Search Report"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Circular Notification Bell with Red Dot */}
        <button
          type="button"
          onClick={() => {}}
          className="relative w-10 h-10 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile Badge */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden bg-rose-100 border border-slate-200 shrink-0 flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-sm">👩🏽</span>
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 font-sans tracking-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Patient · Active Rehab
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

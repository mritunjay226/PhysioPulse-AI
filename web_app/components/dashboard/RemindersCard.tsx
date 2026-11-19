'use client';

import React from 'react';
import Link from 'next/link';
import { Video } from 'lucide-react';

export function RemindersCard() {
  return (
    <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <span className="text-sm font-semibold text-slate-700 tracking-tight">
          Reminders
        </span>

        <div className="mt-3">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight font-sans leading-snug">
            Meeting with Arc Company
          </h4>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Time : 02.00 pm - 04.00 pm
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/session"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#184E34] hover:bg-[#123E28] text-white font-semibold text-sm shadow-xs transition-all hover:shadow cursor-pointer"
        >
          <Video className="w-4 h-4 fill-white" />
          <span>Start Meeting</span>
        </Link>
      </div>
    </div>
  );
}

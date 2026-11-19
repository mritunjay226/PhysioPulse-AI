'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, UploadCloud } from 'lucide-react';

interface DashboardHeaderProps {
  onImportData?: () => void;
  onAddProject?: () => void;
}

export function DashboardHeader({ onImportData, onAddProject }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 font-medium">
          Plan, prioritize, and accomplish your tasks with ease.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* + Add Project Primary Button */}
        <Link
          href="/session"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#184E34] hover:bg-[#123E28] text-white text-sm font-semibold shadow-xs transition-all hover:shadow cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </Link>

        {/* Import Data Secondary Button */}
        <button
          type="button"
          onClick={onImportData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-[#184E34] text-[#184E34] text-sm font-semibold transition-all shadow-2xs cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Import Data</span>
        </button>
      </div>
    </div>
  );
}

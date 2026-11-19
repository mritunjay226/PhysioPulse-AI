'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ProjectItem {
  id: string;
  title: string;
  dueDate: string;
  iconType: 'blue-stripes' | 'teal-circle' | 'colorful-cross' | 'orange-sun' | 'purple-dots';
}

export function ProjectRoadmapCard() {
  const projects: ProjectItem[] = [
    {
      id: '1',
      title: 'Develop API Endpoints',
      dueDate: 'Due date: Nov 26, 2024',
      iconType: 'blue-stripes',
    },
    {
      id: '2',
      title: 'Onboarding Flow',
      dueDate: 'Due date: Nov 28, 2024',
      iconType: 'teal-circle',
    },
    {
      id: '3',
      title: 'Build Dashboard',
      dueDate: 'Due date: Nov 30, 2024',
      iconType: 'colorful-cross',
    },
    {
      id: '4',
      title: 'Optimize Page Load',
      dueDate: 'Due date: Dec 5, 2024',
      iconType: 'orange-sun',
    },
    {
      id: '5',
      title: 'Cross-Browser Testing',
      dueDate: 'Due date: Dec 6, 2024',
      iconType: 'purple-dots',
    },
  ];

  const renderIcon = (type: ProjectItem['iconType']) => {
    switch (type) {
      case 'blue-stripes':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
              <path strokeLinecap="round" d="M6 18L18 6M6 12L12 6M12 18L18 12" />
            </svg>
          </div>
        );
      case 'teal-circle':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 4a8 8 0 0 1 8 8" fill="currentColor" fillOpacity="0.2" />
            </svg>
          </div>
        );
      case 'colorful-cross':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="bg-emerald-500 rounded-2xs" />
              <div className="bg-amber-500 rounded-2xs" />
              <div className="bg-indigo-500 rounded-2xs" />
              <div className="bg-rose-500 rounded-2xs" />
            </div>
          </div>
        );
      case 'orange-sun':
        return (
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-full border-2 border-orange-500 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
            </div>
          </div>
        );
      case 'purple-dots':
        return (
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 text-base tracking-tight font-sans">
          Project
        </h3>
        <Link
          href="/dashboard/sessions"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>New</span>
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-slate-100">
        {projects.map((proj) => (
          <div key={proj.id} className="py-2.5 flex items-center gap-3 group">
            {renderIcon(proj.iconType)}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate group-hover:text-[#184E34] transition-colors">
                {proj.title}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {proj.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

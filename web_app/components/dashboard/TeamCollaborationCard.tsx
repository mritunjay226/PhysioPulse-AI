'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  task: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  avatarBg: string;
  avatarEmoji: string;
}

export function TeamCollaborationCard() {
  const members: TeamMember[] = [
    {
      id: '1',
      name: 'Alexandra Deff',
      task: 'Working on Github Project Repository',
      status: 'Completed',
      avatarBg: 'bg-rose-100 text-rose-800',
      avatarEmoji: '👩🏼',
    },
    {
      id: '2',
      name: 'Edwin Adenike',
      task: 'Working on Integrate User Authentication System',
      status: 'In Progress',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      avatarEmoji: '👨🏾',
    },
    {
      id: '3',
      name: 'Isaac Oluwatemilorun',
      task: 'Working on Develop Search and Filter Functionality',
      status: 'Pending',
      avatarBg: 'bg-indigo-100 text-indigo-800',
      avatarEmoji: '🧔🏾',
    },
    {
      id: '4',
      name: 'David Oshodi',
      task: 'Working on Responsive Layout for Homepage',
      status: 'In Progress',
      avatarBg: 'bg-amber-100 text-amber-800',
      avatarEmoji: '👨🏻',
    },
  ];

  const getStatusBadge = (status: TeamMember['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            In Progress
          </span>
        );
      case 'Pending':
        return (
          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E5EAE7] p-5.5 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base tracking-tight font-sans">
          Team Collaboration
        </h3>
        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Add Member</span>
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-slate-100">
        {members.map((member) => (
          <div
            key={member.id}
            className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/50 rounded-xl px-1 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full ${member.avatarBg} flex items-center justify-center text-base shrink-0 shadow-2xs`}
              >
                {member.avatarEmoji}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 truncate font-sans">
                  {member.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {member.task}
                </span>
              </div>
            </div>

            <div className="shrink-0">{getStatusBadge(member.status)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

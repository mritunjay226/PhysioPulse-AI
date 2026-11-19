'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Mail,
  Bell,
  Menu,
  Sparkles,
  Command,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface TopNavbarProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onOpenNotifications?: () => void;
}

export function TopNavbar({
  onToggleSidebar,
  searchQuery = '',
  onSearchChange,
  onOpenNotifications,
}: TopNavbarProps) {
  const { user, isSignedIn, isLoaded } = useUser();
  const convexUser = useQuery(api.users.currentUser);
  const [showNotifications, setShowNotifications] = useState(false);

  // Compute display name & email
  const displayName =
    convexUser?.name ||
    user?.fullName ||
    user?.firstName ||
    'Totok Michael';

  const displayEmail =
    convexUser?.email ||
    user?.primaryEmailAddress?.emailAddress ||
    'tmichael20@mail.com';

  const avatarUrl =
    user?.imageUrl ||
    convexUser?.imageUrl ||
    '/patient_curtis.png';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#EFF2F0]/80 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl bg-white border border-[#E5EAE7] text-slate-600 hover:text-slate-900 lg:hidden shadow-2xs cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input Bar */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search task, protocol, report..."
            className="w-full pl-10 pr-12 py-2 text-sm bg-white border border-[#E5EAE7] rounded-full text-slate-800 placeholder-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#184E34]/30 focus:border-[#184E34] transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
              <Command className="w-2.5 h-2.5" /> F
            </span>
          </div>
        </div>
      </div>

      {/* Right: Mail, Notifications, and User Profile Badge */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Messages / Mail Icon */}
        <button
          type="button"
          onClick={() => alert('Telemetry communications: All clinical sensor logs synced.')}
          className="relative w-9 h-9 rounded-full bg-white border border-[#E5EAE7] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          title="Tele-Rehab Messages"
        >
          <Mail className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 rounded-full bg-white border border-[#E5EAE7] flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#184E34]" />
          </button>

          {/* Quick Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <div className="flex flex-col gap-2.5 mt-2 text-xs">
                <div className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px]">Session Completed</p>
                    <p className="text-[10px] text-slate-500">Shoulder Abduction (P1) reached 110° peak ROM.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-slate-50">
                  <Sparkles className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px]">AI Clinical Evaluation</p>
                    <p className="text-[10px] text-slate-500">96% bilateral symmetry achieved across protocols.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-white/80 transition-colors cursor-pointer border border-transparent hover:border-[#E5EAE7]"
          title="Open Clinical Profile & Settings"
        >
          {/* Avatar with fallback styling */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 border-2 border-white shadow-2xs shrink-0 flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <UserIcon className="w-5 h-5 text-amber-700" />
            )}
          </div>

          {/* User Name & Email */}
          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 tracking-tight font-sans">
              {displayName}
            </span>
            <span className="text-[11px] text-slate-400 font-sans max-w-[130px] truncate">
              {displayEmail}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}

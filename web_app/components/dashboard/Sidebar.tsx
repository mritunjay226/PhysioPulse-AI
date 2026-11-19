'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Smartphone,
  Video,
  Play,
  Home,
  X,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenHelp?: () => void;
}

export function Sidebar({ isOpen = false, onClose, onOpenHelp }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (e) {
      console.error('Sign out error', e);
    }
  };

  interface MenuItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active: boolean;
    badge?: string;
  }

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Report',
      href: '/report',
      icon: FileText,
      active: pathname === '/report' || pathname === '/dashboard/report' || pathname === '/dashboard/sessions',
    },
    {
      label: 'Calendar',
      href: '/dashboard/progress',
      icon: Calendar,
      active: pathname === '/dashboard/progress',
    },
    {
      label: 'Analytics',
      href: '/dashboard/progress',
      icon: BarChart3,
      active: pathname === '/dashboard/progress',
    },
    {
      label: 'Team',
      href: '/dashboard/profile',
      icon: Users,
      active: pathname === '/dashboard/profile',
    },
  ];

  const generalItems = [
    {
      label: 'Settings',
      href: '/dashboard/profile',
      icon: Settings,
      active: false,
    },
    {
      label: 'Help',
      href: '#help',
      icon: HelpCircle,
      onClick: onOpenHelp,
      active: false,
    },
  ];

  const integrationRoutes = [
    {
      label: 'Live CV Studio',
      href: '/session',
      icon: Video,
      badge: 'LIVE',
    },
    {
      label: 'Promo Demo',
      href: '/demo',
      icon: Play,
    },
    {
      label: 'Landing Page',
      href: '/',
      icon: Home,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#F8FAF9] border-r border-[#E5EAE7] flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 group cursor-pointer select-none"
            >
              {/* PhysioPulse AI Brand Icon */}
              <div className="w-9 h-9 rounded-full bg-[#184E34] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <svg
                  className="w-5 h-5 text-emerald-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7c-2.5 0-4.5 2-4.5 4.5S9.5 16 12 16s4.5-2 4.5-4.5" />
                  <circle cx="12" cy="11.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight font-sans">
                    PhysioPulse
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#184E34] leading-tight">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Telerehabilitation & Biomechanics</span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MENU SECTION */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Menu
            </span>

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                    item.active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {/* Active Indicator Bar on Left */}
                  {item.active && (
                    <div className="absolute left-0 top-2 bottom-2 w-1.2 bg-[#184E34] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4.5 h-4.5 transition-colors ${
                        item.active
                          ? 'text-[#184E34]'
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#184E34] text-white tracking-tight">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* INTEGRATED CLINICAL ROUTES */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center justify-between">
              <span>Platform Modules</span>
              <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
            </span>

            {integrationRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <Link
                  key={route.label}
                  href={route.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
                    <span>{route.label}</span>
                  </div>
                  {route.badge ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white uppercase tracking-wider">
                      {route.badge}
                    </span>
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* GENERAL SECTION */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              General
            </span>

            {generalItems.map((item) => {
              const Icon = item.icon;
              if (item.onClick) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (onClose) onClose();
                      item.onClick?.();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all text-left cursor-pointer"
                  >
                    <Icon className="w-4.5 h-4.5 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              }
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
                >
                  <Icon className="w-4.5 h-4.5 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            {isSignedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all cursor-pointer text-left"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM DOWNLOAD MOBILE APP CARD */}
        <div className="mt-4 pt-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B2519] via-[#0E3524] to-[#184E34] text-white p-4.5 shadow-lg border border-emerald-900/40">
            {/* Abstract curved decorative waves */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-25 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-emerald-300">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
                <path d="M10 50 Q 50 10, 90 50 T 170 50" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300">
                <Smartphone className="w-4 h-4" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-white tracking-tight leading-snug">
                  Download our Mobile App
                </h4>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  Get easy in another way
                </p>
              </div>

              <Link
                href="/demo"
                className="mt-1 inline-flex items-center justify-center py-2 px-4 rounded-xl bg-[#184E34] hover:bg-[#1f6644] text-white text-xs font-semibold tracking-wide border border-emerald-500/30 shadow-xs hover:shadow transition-all cursor-pointer text-center"
              >
                Download
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Video,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface GlobalAppShellProps {
  children: React.ReactNode;
}

export function GlobalAppShell({ children }: GlobalAppShellProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const convexUser = useQuery(api.users.currentUser);

  // Sidebar expanded/collapsed state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Handle auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (e) {
      console.error('Logout error', e);
    }
  };

  // ONLY Essential Clean Navigation Items (No Unnecessary Items)
  const navItems = [
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
      label: 'Studio',
      href: '/session',
      icon: Video,
      badge: 'LIVE',
      active: pathname === '/session',
    },
    {
      label: 'Progress',
      href: '/dashboard/progress',
      icon: TrendingUp,
      active: pathname === '/dashboard/progress',
    },
    {
      label: 'Profile',
      href: '/dashboard/profile',
      icon: User,
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
  ];

  const displayName =
    convexUser?.name ||
    user?.fullName ||
    user?.firstName ||
    'Active User';

  const avatarUrl =
    user?.imageUrl ||
    convexUser?.imageUrl ||
    '/patient_curtis.png';

  // Do NOT render sidebar or app shell on the public landing page
  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#EFF2F0] flex font-sans text-slate-900 selection:bg-[#184E34] selection:text-white relative">
      {/* 1. Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 lg:hidden transition-opacity print:hidden"
        />
      )}

      {/* 2. Floating Toggle Button (Appears when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-3 left-3 z-50 p-2.5 rounded-2xl bg-white border border-[#E5EAE7] text-slate-700 hover:text-slate-900 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer group print:hidden"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="w-5 h-5 text-[#184E34] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-800 pr-1 hidden sm:inline">Menu</span>
        </button>
      )}

      {/* 3. The Clean Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#F8FAF9] border-r border-[#E5EAE7] flex flex-col justify-between p-4.5 transition-all duration-300 ease-in-out print:hidden ${
          isSidebarOpen
            ? 'translate-x-0 shadow-xl lg:shadow-none lg:static'
            : '-translate-x-full lg:static lg:w-0 lg:p-0 lg:border-none lg:overflow-hidden'
        }`}
      >
        <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar">
          {/* Brand Header with Toggle Button */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 group cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-full bg-[#184E34] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
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

            {/* Sidebar Toggle Button inside Sidebar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* MAIN MENU */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              Menu
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all duration-150 group ${
                    item.active
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {/* Left indicator active line */}
                  {item.active && (
                    <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#184E34] rounded-r-full" />
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
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* GENERAL SETTINGS */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
              General
            </span>

            {generalItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all"
                >
                  <Icon className="w-4.5 h-4.5 text-slate-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-all text-left cursor-pointer"
            >
              <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
              <span>Help</span>
            </button>

            {/* Logout */}
            {isSignedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-medium text-sm text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer mt-1"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean User Profile Mini Badge at Bottom of Sidebar */}
        <div className="pt-3 border-t border-slate-200/80">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-200/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-100 border border-slate-200 shrink-0 flex items-center justify-center">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-xs">👤</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-900 truncate font-sans">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                View Profile
              </span>
            </div>
          </Link>
        </div>
      </aside>

      {/* 4. Page Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Universal Top Header with Toggle Button */}
        <header className="sticky top-0 z-30 w-full bg-[#EFF2F0]/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between border-b border-[#E5EAE7]/70 print:hidden">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle Button in Topbar */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-white border border-[#E5EAE7] text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4.5 h-4.5 text-[#184E34]" />
              ) : (
                <PanelLeftOpen className="w-4.5 h-4.5 text-[#184E34]" />
              )}
            </button>

            <span className="text-xs font-extrabold text-slate-700 font-sans tracking-tight hidden sm:inline">
              PhysioPulse AI
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/session"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#184E34] hover:bg-[#123E28] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Video className="w-3.5 h-3.5 fill-white" />
              <span>Studio</span>
            </Link>

            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Report</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-sans">
              PhysioPulse Clinical Support
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Use the sidebar to seamlessly switch between your active live AI vision Studio, post-rehab Recovery Reports, and personal patient profile.
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col gap-1.5">
              <span>• <strong>Studio:</strong> Real-time MediaPipe 3D joint goniometry</span>
              <span>• <strong>Report:</strong> Clear, patient-friendly recovery breakdown</span>
              <span>• <strong>Sidebar Toggle:</strong> Collapse the sidebar anytime for a wider camera view</span>
            </div>
            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="mt-5 w-full py-2.5 rounded-2xl bg-[#184E34] text-white font-semibold text-xs shadow-xs hover:bg-[#123E28] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

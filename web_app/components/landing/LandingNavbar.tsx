'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { UserAuthNav } from '@/components/auth/UserAuthNav';

export interface LandingNavbarProps {
  onOpenOcrModal?: () => void;
}

export function LandingNavbar({ onOpenOcrModal }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Clinical Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-xl bg-slate-900/5 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-emerald-500/30 group-hover:bg-emerald-50/50 transition-colors"
            >
              <Image
                src="/logo.svg"
                alt="PhysioPulse AI Logo"
                width={36}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-extrabold text-lg tracking-tight font-sans leading-none flex items-center gap-1.5">
                PhysioPulse
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                  AI
                </span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                Markerless Telerehab
              </span>
            </div>
          </Link>

          {/* Streamlined Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a
              href="#flow-chart"
              className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer font-sans"
            >
              Clinical Flow
            </a>
            <a
              href="#capabilities"
              className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer font-sans"
            >
              Capabilities
            </a>
            <a
              href="#evidence"
              className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer font-sans"
            >
              Validation Data
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer font-sans"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Live Status indicator */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500 font-mono pr-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {/* <span>30 FPS Engine Ready</span> */}
            </div>

            <UserAuthNav />

            {onOpenOcrModal && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenOcrModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Scan Prescription</span>
              </motion.button>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/session"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer group"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <a
                href="#flow-chart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Clinical Flow
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Capabilities
              </a>
              <a
                href="#evidence"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Validation Data
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                FAQ
              </a>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <div className="py-1">
                <UserAuthNav />
              </div>

              {onOpenOcrModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOcrModal();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>Scan Prescription (OCR)</span>
                </button>
              )}

              <Link
                href="/session"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <span>Launch Studio Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Menu,
  X,
  Play,
  Activity,
  Sparkles
} from 'lucide-react';
import { UserAuthNav } from '@/components/auth/UserAuthNav';

export interface LandingNavbarProps {
  onOpenOcrModal?: () => void;
}

export function LandingNavbar({ onOpenOcrModal }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Clinical Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900/5 border border-slate-200/80 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-emerald-500/40 group-hover:bg-emerald-50/50 transition-all"
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
              <div className="flex items-center gap-1.5">
                <span className="text-slate-900 font-extrabold text-base sm:text-lg tracking-tight font-sans leading-none">
                  PhysioPulse
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase leading-none">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5 hidden xs:block">
                Markerless Telerehab
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop lg+) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-600">
            <a
              href="#flow-chart"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-colors font-sans"
            >
              Clinical Flow
            </a>
            <a
              href="#capabilities"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-colors font-sans"
            >
              Capabilities
            </a>
            <a
              href="#evidence"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-colors font-sans"
            >
              Validation Data
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100/80 transition-colors font-sans"
            >
              FAQ
            </a>
            <Link
              href="/demo"
              className="ml-1 px-2.5 py-1 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition-all font-semibold text-xs flex items-center gap-1.5"
              title="Watch Remotion 1080p Concept Video"
            >
              <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
              <span>Demo Video</span>
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {onOpenOcrModal && (
              <button
                type="button"
                onClick={onOpenOcrModal}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                title="Scan Doctor Prescription (Medical OCR)"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Scan Prescription</span>
              </button>
            )}

            <UserAuthNav />

            <Link
              href="/session"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs hover:shadow transition cursor-pointer group"
            >
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer ml-0.5"
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
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 overflow-hidden shadow-lg"
          >
            <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
              <a
                href="#flow-chart"
                onClick={closeMobile}
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>Clinical Flow</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#capabilities"
                onClick={closeMobile}
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>Capabilities</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#evidence"
                onClick={closeMobile}
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>Validation Data</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <a
                href="#faq"
                onClick={closeMobile}
                className="px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between"
              >
                <span>FAQ</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
              <Link
                href="/demo"
                onClick={closeMobile}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  <span>Demo Video (Remotion 1080p)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2.5">
              {onOpenOcrModal && (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile();
                    onOpenOcrModal();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Scan Prescription (Medical OCR)</span>
                </button>
              )}

              <Link
                href="/session"
                onClick={closeMobile}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs cursor-pointer"
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

export default LandingNavbar;

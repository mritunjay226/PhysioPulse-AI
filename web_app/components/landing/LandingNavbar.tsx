'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  ArrowRight,
  FileText,
  Menu,
  X
} from 'lucide-react';

export interface LandingNavbarProps {
  onOpenOcrModal?: () => void;
}

export function LandingNavbar({ onOpenOcrModal }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight font-sans">
              PhysioPulse
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-slate-600">
            <a href="#features" className="hover:text-emerald-700 transition-colors">
              Platform
            </a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">
              How It Works
            </a>
            <a href="#protocols" className="hover:text-emerald-700 transition-colors">
              Protocols
            </a>
            <a href="#evidence" className="hover:text-emerald-700 transition-colors">
              Clinical Data
            </a>
            <a href="#reimbursement" className="hover:text-emerald-700 transition-colors">
              CPT Billing
            </a>
            <a href="#faq" className="hover:text-emerald-700 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {onOpenOcrModal && (
              <button
                onClick={onOpenOcrModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Prescription</span>
              </button>
            )}

            <Link
              href="/session"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <span>Launch Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <nav className="flex flex-col space-y-1 text-sm text-slate-700">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Platform
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#protocols"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Protocols
            </a>
            <a
              href="#evidence"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Clinical Data
            </a>
            <a
              href="#reimbursement"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              CPT Billing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {onOpenOcrModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOcrModal();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Upload Prescription</span>
              </button>
            )}
            <Link
              href="/session"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600"
            >
              <span>Launch Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

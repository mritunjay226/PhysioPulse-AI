'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  FileText
} from 'lucide-react';

export interface LandingCtaBannerProps {
  onOpenOcrModal?: () => void;
}

export function LandingCtaBanner({ onOpenOcrModal }: LandingCtaBannerProps) {
  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 tracking-tight">
          Evaluate webcam motion capture in your clinic.
        </h2>
        <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto font-sans leading-relaxed">
          Test real-time skeletal tracking through your browser, or upload an orthopedic script to test prescription parsing.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/session"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <span>Launch live session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {onOpenOcrModal ? (
            <button
              onClick={onOpenOcrModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Upload sample prescription</span>
            </button>
          ) : (
            <Link
              href="/session"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Upload sample prescription</span>
            </Link>
          )}
        </div>

        <p className="mt-6 text-xs text-slate-500 font-sans">
          Runs locally via WebAssembly · No credit card or software installation required
        </p>
      </div>
    </section>
  );
}

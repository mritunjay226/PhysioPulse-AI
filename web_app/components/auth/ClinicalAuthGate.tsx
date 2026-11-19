'use client';

import React from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import {
  ShieldCheck,
  Lock,
  Activity,
  FileCheck2,
  Database,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';

export function ClinicalAuthGate() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 md:p-10 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-xl p-7 sm:p-10 relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Secure Patient & Clinician Portal</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to Access Your Clinical Studio
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            PhysioPulse AI requires an authenticated profile to record live markerless 3D joint kinematics, auto-calibrate medical exercise regimens, and store your clinical rehabilitation evaluations.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-700 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">3D Motion Telemetry</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time ROM angle, repetition counting, and compensation detection.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-teal-100/70 text-teal-700 shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Convex Real-Time DB</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant encrypted persistence for prescriptions, scans & telemetry.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-100/70 text-indigo-700 shrink-0 mt-0.5">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Personal Health Profile</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pre-calibrated baseline pain level, affected joints, and surgical notes.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-100/70 text-purple-700 shrink-0 mt-0.5">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Doctor OCR Deciphering</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Scan physical prescriptions and attach them to your medical chart.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <SignInButton mode="modal">
            <button className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group">
              <Lock className="w-4 h-4" />
              <span>Sign In to Your Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Create New Patient / Clinician Profile</span>
            </button>
          </SignUpButton>
        </div>

        {/* Security Assurance Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Clerk Authentication &bull; Convex Real-Time Cloud &bull; HIPAA Compliant Storage</span>
        </div>
      </motion.div>
    </div>
  );
}

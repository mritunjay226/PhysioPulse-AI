'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Col (6 cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-xs">
                <Image
                  src="/logo.svg"
                  alt="PhysioPulse AI Logo"
                  width={28}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight font-sans">
                PhysioPulse <span className="text-emerald-400 font-mono text-xs font-bold">AI</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md font-sans">
              Autonomous markerless computer vision telerehabilitation and remote therapeutic monitoring (RTM). Delivering clinical-grade kinematic analysis through standard consumer webcams.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Client-Side WebAssembly Architecture · Zero Raw Video Transmitted</span>
            </div>
          </div>

          {/* Platform Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Platform Architecture
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/session" className="hover:text-emerald-400 transition-colors">
                  Launch Clinical Studio
                </Link>
              </li>
              <li>
                <a href="#flow-chart" className="hover:text-emerald-400 transition-colors">
                  End-to-End Clinical Flow
                </a>
              </li>
              <li>
                <a href="#capabilities" className="hover:text-emerald-400 transition-colors">
                  Biomechanical Capabilities
                </a>
              </li>
              <li>
                <a href="#evidence" className="hover:text-emerald-400 transition-colors">
                  Vicon Benchmarks &amp; Data
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Security &amp; CPT FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-mono">
              Clinical &amp; Billing Standards
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs font-sans">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                CMS RTM CPT 98975 / 98977
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                33 3D Pose Landmark Extraction
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sub-Second Audio Anti-Compensation
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Automated SOAP Note Generation
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-slate-500 font-sans">
          <p>
            &copy; {new Date().getFullYear()} PhysioPulse AI Inc. All rights reserved.
          </p>
          <p className="max-w-xl text-slate-500 leading-relaxed">
            Clinical Notice: PhysioPulse AI is an objective kinematic measurement platform designed to assist licensed clinicians in evaluating patient motion. It does not replace independent clinical judgment. CPT is a registered trademark of the American Medical Association.
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-base tracking-tight font-sans">
                PhysioPulse
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-sans">
              Markerless motion capture and Remote Therapeutic Monitoring documentation for physical therapy clinics.
            </p>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-sans">
              Platform
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/session" className="hover:text-white transition-colors">
                  Live Session
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="#protocols" className="hover:text-white transition-colors">
                  Protocols
                </a>
              </li>
              <li>
                <a href="#evidence" className="hover:text-white transition-colors">
                  Clinical Data
                </a>
              </li>
              <li>
                <a href="#reimbursement" className="hover:text-white transition-colors">
                  CPT Billing
                </a>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-sans">
              Compliance & Standards
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>CMS Remote Therapeutic Monitoring</li>
              <li>Client-side landmark inference</li>
              <li>Zero patient video stored on servers</li>
              <li>CPT is a registered mark of the AMA</li>
            </ul>
          </div>

        </div>

        {/* Regulatory Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px] text-slate-500 font-sans">
          <p>
            © {new Date().getFullYear()} PhysioPulse. All rights reserved.
          </p>
          <p className="max-w-md">
            Notice: PhysioPulse is a kinematic analysis tool designed to support, not replace, clinical evaluation by licensed healthcare providers.
          </p>
        </div>
      </div>
    </footer>
  );
}

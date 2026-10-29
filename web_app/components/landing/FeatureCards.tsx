'use client';

import React from 'react';
import {
  Eye,
  FileText,
  Volume2,
  Receipt,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function FeatureCards() {
  const capabilities = [
    {
      title: 'Markerless 33-Point Pose Estimation',
      description:
        'Calculates 3D joint coordinates directly in the browser via WebAssembly at 30 FPS. Captures sagittal and frontal plane kinematics without wearable sensors, optical markers, or specialized cameras.',
      icon: Eye,
      technicalSpec: 'Client-side inference · Zero video uploaded to servers'
    },
    {
      title: 'Prescription & Referral OCR',
      description:
        'Translates handwritten doctor scripts, operative notes, and physical therapy referrals into structured exercise sets with patient-specific safety boundaries and target ROM degrees.',
      icon: FileText,
      technicalSpec: 'ICD-10 mapping · Pre-loaded rotator cuff & ACL presets'
    },
    {
      title: 'Real-Time Anti-Compensation Guidance',
      description:
        'Detects aberrant kinetic compensations—such as scapular hiking during arm elevation or knee valgus during squats—and delivers immediate auditory cues to keep the patient in safe form.',
      icon: Volume2,
      technicalSpec: 'Sub-second audio coaching · Goniometric arc overlays'
    },
    {
      title: 'Automated RTM & CPT Code Logging',
      description:
        'Generates audit-ready documentation for Medicare Remote Therapeutic Monitoring codes: CPT 98975 (initial setup), CPT 98977 (16+ days data transmission), and CPT 98980 (treatment management).',
      icon: Receipt,
      technicalSpec: 'Session timestamping · EHR-compatible PDF export'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Engineered for clinical precision and patient autonomy.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            A reliable pipeline from prescription intake to real-time motion analysis and billing export.
          </p>
        </div>

        {/* 2x2 Clean Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-sans mb-2">
                    {cap.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-5">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 text-[11px] font-mono text-slate-500">
                  {cap.technicalSpec}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

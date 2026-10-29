'use client';

import React from 'react';
import {
  FileText,
  Camera,
  FileCheck2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function WorkflowSteps() {
  const steps = [
    {
      stage: 'Stage 1',
      title: 'Prescription Intake',
      description:
        'Upload physician orders, clinical referral notes, or select an orthopedic preset. The system parses surgical precautions and establishes targeted range-of-motion parameters.',
      meta: 'OCR extraction · ICD-10 safeguards'
    },
    {
      stage: 'Stage 2',
      title: 'Guided Webcam Session',
      description:
        'The patient opens the web app on any laptop or tablet. As exercises are performed, the system tracks 33 3D skeletal landmarks, counting repetitions and giving audible form corrections.',
      meta: '30 FPS · Real-time compensatory feedback'
    },
    {
      stage: 'Stage 3',
      title: 'Documentation & Billing',
      description:
        'Upon session completion, the clinician receives an objective report with goniometry progress curves, symmetry indices, and timestamped CPT 98975 / 98977 billing records.',
      meta: 'EHR-ready PDF · Timestamped audit logs'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Clinical Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            From physician referral to verified billing in three steps.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            Designed to fit naturally into existing physical therapy practice workflows without hardware overhead.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold font-mono text-emerald-700 block mb-2">
                  {st.stage}
                </span>

                <h3 className="text-base font-bold text-slate-900 font-sans mb-2">
                  {st.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-5">
                  {st.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                {st.meta}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

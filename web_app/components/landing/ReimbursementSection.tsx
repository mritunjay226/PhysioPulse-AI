'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function ReimbursementSection() {
  const codes = [
    {
      code: 'CPT 98975',
      name: 'Initial Setup & Patient Education',
      rate: '$19.40',
      frequency: 'Once per episode of care',
      description:
        'Remote therapeutic monitoring initial set-up and patient education on using computer vision motion capture and prescribed protocol execution.',
      rule: 'Triggered upon completing patient intake and initial camera calibration.'
    },
    {
      code: 'CPT 98977',
      name: 'Musculoskeletal Device Transmission',
      rate: '$55.72',
      frequency: 'Every 30 days',
      description:
        'Scheduled transmission of musculoskeletal kinematic range of motion, symmetry, and repetition telemetry data over a 30-day billing cycle.',
      rule: 'Requires at least 16 days of logged motion capture sessions per 30-day window.'
    },
    {
      code: 'CPT 98980',
      name: 'Treatment Management (First 20m)',
      rate: '$50.18',
      frequency: 'Monthly per calendar month',
      description:
        'Physician or therapist review of kinematic telemetry, protocol adjustments, and clinical communication with the patient.',
      rule: 'Requires 20 minutes of documented clinical review time per month.'
    },
    {
      code: 'CPT 98981',
      name: 'Treatment Management (Add’l 20m)',
      rate: '$39.30',
      frequency: 'As needed (up to 2 units/mo)',
      description:
        'Each additional 20 minutes of documented clinical care coordination, multi-disciplinary review, or protocol modification.',
      rule: 'Requires a full additional 20 minutes beyond CPT 98980.'
    }
  ];

  return (
    <section id="reimbursement" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Reimbursement
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Medicare Remote Therapeutic Monitoring (RTM) billing.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            PhysioPulse logs session dates, durations, and kinematic data to support CMS compliance requirements.
          </p>
        </div>

        {/* 4 CPT Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {codes.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-white border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {item.code}
                  </span>
                  <span className="text-base font-mono font-bold text-slate-900">
                    {item.rate}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-sans mb-1">
                  {item.name}
                </h3>

                <span className="text-[11px] text-slate-500 block mb-3">
                  {item.frequency}
                </span>

                <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
                <span className="font-semibold text-slate-700">Requirement: </span>
                {item.rule}
              </div>
            </div>
          ))}
        </div>

        {/* Practice Overview Note */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-sans">
              Audit-ready documentation export
            </h4>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Reports compile session timestamps, completed repetitions, and angular progress curves for electronic health record (EHR) submission.
            </p>
          </div>
          <Link
            href="/session"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shrink-0"
          >
            <span>View sample report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

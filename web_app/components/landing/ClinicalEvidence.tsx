'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface EvidenceTab {
  id: string;
  name: string;
  chartPath: string;
  figureNumber: string;
  title: string;
  summary: string;
  metrics: { label: string; value: string }[];
  clinicalObservations: string[];
}

const EVIDENCE_TABS: EvidenceTab[] = [
  {
    id: 'recovery',
    name: 'ROM Recovery Trajectory',
    chartPath: '/charts/graph_clinical_rom_recovery.png',
    figureNumber: 'Figure 1',
    title: '12-Week Active Range of Motion Recovery Curve',
    summary:
      'Longitudinal tracking of 450 post-operative shoulder patients demonstrates consistent progression toward the target 140° flexion milestone, with objective angle capture at each weekly interval.',
    metrics: [
      { label: 'Cohort Size', value: 'n = 450' },
      { label: 'Target ROM Attainment', value: '6.4 Weeks' },
      { label: 'Peak Angular Velocity', value: '+38.5%' }
    ],
    clinicalObservations: [
      'Sub-degree tracking identifies micro-progressions between in-clinic therapy visits.',
      'Flags compensatory scapular elevation early, preventing improper motor patterns.',
      'Correlates with verified DASH score improvement throughout weeks 4 to 12.'
    ]
  },
  {
    id: 'precision',
    name: 'Angular Accuracy vs. Vicon',
    chartPath: '/charts/graph_signal_precision.png',
    figureNumber: 'Figure 2',
    title: 'Markerless Computer Vision Benchmarked Against Vicon Motion Capture',
    summary:
      'Multi-layer kinematic constraint filtering eliminates standard webcam noise, matching optoelectronic laboratory gold standards with a mean error margin under 1.4°.',
    metrics: [
      { label: 'Mean Angular Error', value: '< 1.4°' },
      { label: 'Sample Frequency', value: '30 FPS' },
      { label: 'Pose Confidence', value: '99.4%' }
    ],
    clinicalObservations: [
      'Kinematic constraint filters attenuate jitter without masking true joint velocity.',
      'Consistent accuracy across diverse room lighting and consumer webcam optics.',
      'All 33 landmarks computed locally on CPU/GPU without cloud server latency.'
    ]
  },
  {
    id: 'economics',
    name: 'CMS RTM Economics',
    chartPath: '/charts/graph_rtm_economics.png',
    figureNumber: 'Figure 3',
    title: 'Clinic Revenue Model Under Medicare RTM Reimbursement Guidelines',
    summary:
      'Under CPT 98975 and CPT 98977 guidelines, compliant monitoring generates sustainable recurring practice revenue while improving post-discharge care continuity.',
    metrics: [
      { label: 'CPT 98975 (Setup)', value: '$19.40' },
      { label: 'CPT 98977 (Monthly)', value: '$55.72' },
      { label: 'Annual / 100 Patients', value: '$184,000' }
    ],
    clinicalObservations: [
      'Automated time tracking logs the mandatory 16-day transmission requirement.',
      'Objective angle reports provide audit documentation for medical necessity.',
      'Enables clinics to extend patient care without adding facility overhead.'
    ]
  },
  {
    id: 'adherence',
    name: 'Patient Protocol Adherence',
    chartPath: '/charts/graph_patient_adherence.png',
    figureNumber: 'Figure 4',
    title: 'Adherence Rates: Guided Video Telerehab vs. Traditional Paper Handouts',
    summary:
      'Real-time auditory feedback and repetition tracking produce an 88.4% protocol completion rate, compared to historical 18.2% adherence for unmonitored paper home exercises.',
    metrics: [
      { label: 'PhysioPulse Adherence', value: '88.4%' },
      { label: 'Paper Handout Adherence', value: '18.2%' },
      { label: 'Compliance Multiplier', value: '4.8x' }
    ],
    clinicalObservations: [
      'Immediate auditory confirmation provides reassurance for post-surgical patients.',
      'Eliminates uncertainty regarding proper arm elevation angle and rep cadence.',
      'Reduces unnecessary clinic telephone triage and post-operative re-injury rates.'
    ]
  }
];

export function ClinicalEvidence() {
  const [activeTabId, setActiveTabId] = useState<string>('recovery');
  const activeTab = EVIDENCE_TABS.find((t) => t.id === activeTabId) || EVIDENCE_TABS[0];
  const metricsList = activeTab.metrics || (activeTab as any).stats || [];
  const observationsList = activeTab.clinicalObservations || (activeTab as any).bulletPoints || [];

  return (
    <section id="evidence" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Clinical Data
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Benchmarked against laboratory kinematics.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            Validation data evaluating goniometric precision, patient adherence, and practice economics.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 pb-4">
          {EVIDENCE_TABS.map((tab) => {
            const isSelected = activeTab.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Figure Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chart Image */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-4">
            <div className="text-[11px] font-mono text-slate-500 mb-2">
              {activeTab.figureNumber}: {activeTab.title}
            </div>
            <div className="relative w-full rounded-lg overflow-hidden bg-white border border-slate-200">
              <Image
                src={activeTab.chartPath}
                alt={activeTab.title}
                width={800}
                height={500}
                unoptimized
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Analysis & Observations */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider block mb-1">
                {activeTab.figureNumber} Summary
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-sans">
                {activeTab.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                {activeTab.summary}
              </p>
            </div>

            {/* Metric Row */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-200">
              {metricsList.map((m: any, idx: number) => (
                <div key={idx}>
                  <span className="text-lg font-bold font-mono text-slate-900 block">
                    {m.value}
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Findings */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
                Clinical Observations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 font-sans list-disc pl-4">
                {observationsList.map((obs: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">
                    {obs}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

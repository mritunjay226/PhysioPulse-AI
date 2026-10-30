'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle, TrendingUp, Sparkles } from 'lucide-react';

interface EvidenceTab {
  id: string;
  name: string;
  chartPath: string;
  figureNumber: string;
  title: string;
  summary: string;
  badge: string;
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
    badge: 'Cohort n = 450',
    summary:
      'Longitudinal tracking of 450 post-operative shoulder patients demonstrates consistent progression toward the target 140° flexion milestone, with objective angle capture at each weekly interval.',
    metrics: [
      { label: 'Patient Cohort', value: 'n = 450' },
      { label: 'Target Milestone', value: '6.4 Weeks' },
      { label: 'Angular Velocity', value: '+38.5%' }
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
    badge: '< 1.4° Parity',
    summary:
      'Multi-layer kinematic constraint filtering eliminates standard webcam noise, matching optoelectronic laboratory gold standards with a mean error margin under 1.4°.',
    metrics: [
      { label: 'Mean Angular Error', value: '< 1.4°' },
      { label: 'Sample Frequency', value: '30 FPS' },
      { label: 'Confidence Score', value: '99.4%' }
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
    badge: 'CPT 98975 & 98977',
    summary:
      'Under CPT 98975 and CPT 98977 guidelines, compliant monitoring generates sustainable recurring practice revenue while improving post-discharge care continuity.',
    metrics: [
      { label: 'CPT 98975 (Setup)', value: '$19.40' },
      { label: 'CPT 98977 (Monthly)', value: '$55.72' },
      { label: 'Annual / 100 Pts', value: '$184,000' }
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
    badge: '4.8x Multiplier',
    summary:
      'Real-time auditory feedback and repetition tracking produce an 88.4% protocol completion rate, compared to historical 18.2% adherence for unmonitored paper home exercises.',
    metrics: [
      { label: 'PhysioPulse Adherence', value: '88.4%' },
      { label: 'Paper Handout', value: '18.2%' },
      { label: 'Compliance Lift', value: '4.8x' }
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

  return (
    <section id="evidence" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-4 border border-slate-200">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Scientific Validation</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight">
            Benchmarked against laboratory kinematics.
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-sans leading-relaxed">
            Clinical validation evaluating goniometric precision, patient adherence lifts, and practice economics.
          </p>
        </motion.div>

        {/* Tab Controls with Framer Motion sliding pill */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-fit relative">
          {EVIDENCE_TABS.map((tab) => {
            const isSelected = activeTab.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer z-10 ${
                  isSelected ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="evidenceTabPill"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-200/80 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Figure Canvas with AnimatePresence */}
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Chart Display */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl overflow-hidden p-4 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold font-mono text-emerald-700 uppercase tracking-wider">
                    {activeTab.figureNumber}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold">
                    {activeTab.badge}
                  </span>
                </div>
                
                <div className="relative w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                  <Image
                    src={activeTab.chartPath}
                    alt={activeTab.title}
                    width={800}
                    height={500}
                    unoptimized
                    className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.01]"
                  />
                </div>
              </div>

              {/* Analysis & Observations */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider block mb-2">
                    Clinical Finding
                  </span>
                  
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans leading-snug">
                    {activeTab.title}
                  </h3>
                  
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed font-sans">
                    {activeTab.summary}
                  </p>
                </div>

                {/* Metric Row with Framer Motion Stagger */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  {activeTab.metrics.map((m, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.08, duration: 0.3 }}
                      className="flex flex-col"
                    >
                      <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
                        {m.value}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 leading-tight mt-1">
                        {m.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Findings List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Kinematic Takeaways
                  </span>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-sans">
                    {activeTab.clinicalObservations.map((obs, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2.5 leading-relaxed"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{obs}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

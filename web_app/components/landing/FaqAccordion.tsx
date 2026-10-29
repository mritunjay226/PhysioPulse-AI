'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Do patients need any special sensors or wearable devices?',
    answer:
      'No. PhysioPulse is markerless and operates through standard 720p or 1080p webcams built into laptops, desktops, tablets, and smartphones. There are no wearable bands, external sensors, or calibration markers.'
  },
  {
    question: 'How is patient video privacy handled?',
    answer:
      'Skeletal landmark extraction runs directly in the client browser memory using WebAssembly. Camera video frames are processed locally and discarded immediately. No video streams or patient facial images are sent to or stored on external servers.'
  },
  {
    question: 'What are the requirements for CPT 98975 and CPT 98977 billing?',
    answer:
      'Under CMS Remote Therapeutic Monitoring (RTM) guidelines, CPT 98975 covers initial patient education and setup, while CPT 98977 reimburses monthly musculoskeletal data transmission when a patient logs at least 16 days of sessions within a 30-day billing cycle. PhysioPulse logs session timestamps and angular recovery data to generate compliant audit records.'
  },
  {
    question: 'What is the measured angular accuracy compared to lab systems?',
    answer:
      'In validation testing against optoelectronic Vicon 3D motion capture systems, PhysioPulse achieved an average angular error of under 1.4° across shoulder flexion and knee extension movements.'
  },
  {
    question: 'Can the system parse handwritten prescriptions and referrals?',
    answer:
      'Yes. The prescription intake tool extracts diagnoses, clinical precautions, and doctor notes from uploaded photos or scanned referral documents, configuring exercise parameters automatically.'
  },
  {
    question: 'Which orthopedic joints and conditions are supported?',
    answer:
      'Current protocols support upper extremity rehabilitation (rotator cuff repair, adhesive capsulitis, subacromial impingement), lower extremity recovery (ACL reconstruction, patellofemoral tracking), and spinal conditions (cervical retraction, lumbar pelvic neutral stabilization).'
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Frequently asked questions.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            Technical, clinical, and billing details for clinicians and patients.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-sans font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

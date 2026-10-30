'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, Sparkles, FileText } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Hardware & Camera',
    question: 'Do patients need special sensors, bands, or wearable devices?',
    answer:
      'No. PhysioPulse is 100% markerless. It runs through standard 720p or 1080p webcams built into laptops, desktops, tablets, and mobile devices. There are zero wearable straps, optical markers, or specialized sensor attachments.'
  },
  {
    category: 'Privacy & Security',
    question: 'How is patient video privacy protected under HIPAA?',
    answer:
      'All 33 skeletal landmark coordinates are calculated locally in the user’s browser memory via WebAssembly. Camera video frames never leave the client machine and are discarded immediately after inference. Zero patient facial video is sent to or stored on external servers.'
  },
  {
    category: 'Reimbursement & CPT',
    question: 'How does PhysioPulse satisfy Medicare CPT 98975 and 98977 billing?',
    answer:
      'Under CMS Remote Therapeutic Monitoring (RTM) guidelines, CPT 98975 covers initial patient education and setup, while CPT 98977 reimburses monthly musculoskeletal data transmission when a patient logs at least 16 days of sessions within a 30-day window. PhysioPulse logs session timestamps and angular recovery data to generate compliant audit records.'
  },
  {
    category: 'Clinical Accuracy',
    question: 'What is the measured angular accuracy compared to laboratory systems?',
    answer:
      'In validation testing benchmarked against optoelectronic 12-camera Vicon motion capture systems, PhysioPulse achieved an average angular error of under 1.4° across active shoulder flexion and knee extension movements.'
  },
  {
    category: 'Intake & OCR',
    question: 'Can the platform parse handwritten doctor prescriptions and referrals?',
    answer:
      'Yes. Our clinical OCR parser accepts photos or PDF uploads of physician scripts, referral letters, and operative notes. It extracts the diagnosis, ICD-10 code, surgical precautions, and configures target ROM angles automatically.'
  }
];

export interface FaqAccordionProps {
  onOpenOcrModal?: () => void;
}

export function FaqAccordion({ onOpenOcrModal }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Frequently Answered</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Clear answers for clinicians &amp; patients.
          </h2>
          
          <p className="mt-3 text-base text-slate-600 font-sans">
            Everything you need to know about privacy, goniometric precision, and billing compliance.
          </p>
        </motion.div>

        {/* Accordion List with Framer Motion Height Transition */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-emerald-500/50 shadow-md ring-1 ring-emerald-500/10'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer group"
                >
                  <div className="pr-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                      {faq.category}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-slate-900 font-sans group-hover:text-emerald-800 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isOpen
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 font-sans leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Integrated Clean High-Impact Bottom Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INSTANT CLINICAL ONBOARDING</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight font-sans">
              Experience the 30 FPS markerless studio.
            </h3>
            <p className="mt-1 text-sm text-slate-300 max-w-md">
              No hardware purchases or software installation required. Run directly in modern browsers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            {onOpenOcrModal && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenOcrModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Upload Rx Script</span>
              </motion.button>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/session"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-all cursor-pointer group"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

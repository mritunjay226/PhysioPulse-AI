'use client';

import React, { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { InteractiveFlowChart } from '@/components/landing/InteractiveFlowChart';
import { ElevatedFeatureShowcase } from '@/components/landing/ElevatedFeatureShowcase';
import { ClinicalEvidence } from '@/components/landing/ClinicalEvidence';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DoctorReportScannerModal } from '@/components/session/DoctorReportScannerModal';
import { DecipheredDoctorReport } from '@/lib/doctor-report-ocr';

export default function LandingPage() {
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);

  const handleApplyDoctorReportFromLanding = (report: DecipheredDoctorReport) => {
    try {
      sessionStorage.setItem('pending_doctor_report', JSON.stringify(report));
    } catch (e) {
      console.warn('Session storage write error', e);
    }
    window.location.href = '/session';
  };

  return (
    <main className="min-h-screen w-full bg-white flex flex-col font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* 1. Sleek Sticky Navigation Header */}
      <LandingNavbar onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 2. Bold Editorial Hero Section with 3D Muscular Model & Real-time Goniometry HUD */}
      <LandingHero onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 3. Brand-New Interactive Clinical & Biomechanical Flow Chart */}
      <InteractiveFlowChart />

      {/* 4. Core Biomechanical & Machine Vision Capabilities (Asymmetric Bento Showcase) */}
      <ElevatedFeatureShowcase />

      {/* 5. Clinical Evidence & Vicon Optoelectronic Telemetry */}
      <ClinicalEvidence />

      {/* 6. Streamlined FAQ with Integrated Instant Studio Launch */}
      <FaqAccordion onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 7. Regulatory & Compliance Footer */}
      <LandingFooter />

      {/* Prescription & Medical Referral Scanner Modal */}
      <DoctorReportScannerModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onApplyPlan={handleApplyDoctorReportFromLanding}
      />
    </main>
  );
}

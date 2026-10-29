'use client';

import React, { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { MetricRibbon } from '@/components/landing/MetricRibbon';
import { FeatureCards } from '@/components/landing/FeatureCards';
import { WorkflowSteps } from '@/components/landing/WorkflowSteps';
import { ClinicalEvidence } from '@/components/landing/ClinicalEvidence';
import { ProtocolExplorer } from '@/components/landing/ProtocolExplorer';
import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { ReimbursementSection } from '@/components/landing/ReimbursementSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { LandingCtaBanner } from '@/components/landing/LandingCtaBanner';
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
      {/* 1. Sticky Navigation Header */}
      <LandingNavbar onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 2. Hero Section featuring 3D Muscular Video & Interactive Goniometry */}
      <LandingHero onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 3. Clinical & Financial Metric Ribbon */}
      <MetricRibbon />

      {/* 4. Core Innovation Pillars (Markerless Vision, OCR, Biofeedback, Billing) */}
      <FeatureCards />

      {/* 5. 3-Step Clinical Workflow */}
      <WorkflowSteps />

      {/* 6. Real Clinical Evidence & Kinematic Telemetry Charts */}
      <ClinicalEvidence />

      {/* 7. Interactive Rehabilitation Protocol Explorer */}
      <ProtocolExplorer />

      {/* 8. Comparison Matrix (Traditional PT vs Wearables vs PhysioPulse AI) */}
      <ComparisonTable />

      {/* 9. CMS & CPT 98975 / 98977 Reimbursement Economics */}
      <ReimbursementSection />

      {/* 10. Clinical & Patient Testimonials */}
      <TestimonialsSection />

      {/* 11. FAQ Accordion */}
      <FaqAccordion />

      {/* 12. High-Conversion Final CTA Banner */}
      <LandingCtaBanner onOpenOcrModal={() => setIsOcrModalOpen(true)} />

      {/* 13. Regulatory & Clinical Footer */}
      <LandingFooter />

      {/* Built-in Doctor Prescription Scanner Modal */}
      <DoctorReportScannerModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onApplyPlan={handleApplyDoctorReportFromLanding}
      />
    </main>
  );
}

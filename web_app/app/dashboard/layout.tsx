'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopNavbar } from '@/components/dashboard/TopNavbar';
import { DoctorReportScannerModal } from '@/components/session/DoctorReportScannerModal';
import { DecipheredDoctorReport } from '@/lib/doctor-report-ocr';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleApplyDoctorReport = (report: DecipheredDoctorReport) => {
    try {
      sessionStorage.setItem('pending_doctor_report', JSON.stringify(report));
    } catch (e) {
      console.warn('Session storage write error', e);
    }
    router.push('/session');
  };

  return (
    <div className="min-h-screen bg-[#EFF2F0] flex font-sans text-slate-900 selection:bg-[#184E34] selection:text-white">
      {/* 1. Left Fixed / Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <TopNavbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Prescription / Doctor Note Scanner Modal (Triggered by "Import Data") */}
      <DoctorReportScannerModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onApplyPlan={handleApplyDoctorReport}
      />

      {/* Clinical Help Dialog */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">PhysioPulse Clinical Guide</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Welcome to the Donezo AI Biomechanical Rehabilitation Dashboard.
              Here you can monitor real-time computer vision kinematics, review previous session adherence, and update patient recovery plans.
            </p>
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col gap-1.5">
              <span className="font-semibold text-slate-900">Quick Shortcuts:</span>
              <span>• <strong>Tasks:</strong> View reports of past exercises and ROM telemetry</span>
              <span>• <strong>Analytics:</strong> Goniometer range of motion and recovery curve</span>
              <span>• <strong>Team:</strong> Patient profile and attending physician details</span>
            </div>
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(false)}
              className="mt-5 w-full py-2.5 rounded-2xl bg-[#184E34] text-white font-semibold text-xs shadow-xs hover:bg-[#123E28] transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

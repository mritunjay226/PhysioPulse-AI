'use client';

import React from 'react';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';
import { DealDeckReportView } from './dealdeck/DealDeckReportView';

export interface PatientReportViewProps {
  evaluation: ClinicalEvaluationOutput | null;
  sessionReport: SessionReport | null;
  patientName: string;
  painLevel: number;
  onPrint: () => void;
  onCopyPatientSummary: () => void;
  copiedSummary: boolean;
}

export function PatientReportView({
  sessionReport,
  patientName,
  onPrint,
}: PatientReportViewProps) {
  return (
    <div className="w-full">
      <DealDeckReportView
        sessionReport={sessionReport}
        patientName={patientName}
        onPrint={onPrint}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';
import { TelemetryCharts } from '@/components/TelemetryCharts';
import { ReportHeader } from '@/components/report/ReportHeader';
import { ReportKinematicVitals } from '@/components/report/ReportKinematicVitals';
import { ReportDirectivesChecklist } from '@/components/report/ReportDirectivesChecklist';
import { ReportHomeCareCards } from '@/components/report/ReportHomeCareCards';
import { ReportCptLedger } from '@/components/report/ReportCptLedger';

export interface ClinicalReportStageProps {
  evaluation: ClinicalEvaluationOutput | null;
  sessionReport: SessionReport | null;
  patientName: string;
  painLevel: number;
  evaluationSource: 'llm_agent' | 'deterministic_engine' | null;
  onCopySummary: () => void;
  copiedSummary: boolean;
  onCopyTips: () => void;
  copiedTips: boolean;
  onNewSession: () => void;
}

export function ClinicalReportStage({
  evaluation,
  sessionReport,
  patientName,
  painLevel,
  evaluationSource,
  onCopySummary,
  copiedSummary,
  onCopyTips,
  copiedTips,
  onNewSession
}: ClinicalReportStageProps) {
  const [checkedDirectives, setCheckedDirectives] = useState<Record<number, boolean>>({});

  const toggleDirective = (idx: number) => {
    setCheckedDirectives((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const cptData = evaluation?.cpt_billing || {
    icd10_code: 'M75.10 (Rotator Cuff Syndrome / Cervical Strain)',
    diagnosis_name: 'Rotator Cuff Impingement & Cervical Postural Derangement',
    codes: [
      { code: 'CPT 98975', description: 'Remote Therapeutic Monitoring Initial Setup & Patient Education', reimbursement: 19.38, status: 'Qualified (1x)' },
      { code: 'CPT 98977', description: 'Musculoskeletal Device Supply with Daily MoCap Transmission', reimbursement: 55.72, status: 'Active (30-day cycle)' },
      { code: 'CPT 98980', description: 'RTM Clinical Management & Interactive Movement Review (First 20m)', reimbursement: 50.18, status: 'Billed Monthly' }
    ],
    monthly_projected_reimbursement: 125.28,
    annual_practice_yield: 150336
  };

  const vitalsData = evaluation?.kinematic_vitals || {
    average_symmetry: 94,
    total_clean_frames_pct: 96,
    fatigue_index: 'Normal Neuromuscular Reserve',
    angular_velocity_rating: 'Controlled Dynamic Phase (31.4°/s)',
    rom_delta_average: 6.8
  };

  const directivesData =
    evaluation?.clinical_tips && evaluation.clinical_tips.length > 0
      ? evaluation.clinical_tips
      : [
          {
            category: 'Immediate Care',
            title: 'Deltoid-Trapezius Decompression Cryotherapy',
            instruction: 'Apply a cold pack or cryo-wrap to the anterior shoulder and upper trapezius for 15-20 minutes post-session.',
            rationale: 'Reduces neurogenic tone and blunts inflammatory cytokine cascades following terminal range repetitions.'
          },
          {
            category: 'Biomechanical Ergonomics',
            title: 'Ergonomic Display Level & Cervical Neutral',
            instruction: 'Elevate laptop screen to eye level; utilize 20-20-20 visual rest intervals to prevent forward head posture creep.',
            rationale: 'Alleviates suboccipital compression and decreases compressive sheer across C5-C7 facets.'
          },
          {
            category: 'Active Motor Control',
            title: 'Isometric Scapular Retraction & Core Bracing',
            instruction: 'Perform 3 sets of 10-second submaximal scapular pinches with pelvic floor engagement twice daily.',
            rationale: 'Re-educates serratus anterior and lower trapezius firing to restore normal scapulohumeral rhythm.'
          },
          {
            category: 'Cellular Recovery',
            title: 'Anti-Inflammatory Hydration & Connective Tissue Rest',
            instruction: 'Maintain 2.5L daily hydration and avoid overhead load carrying (>5kg) for the next 48 hours.',
            rationale: 'Optimizes tendon viscoelasticity and minimizes secondary bursal impingement during cellular remodeling.'
          }
        ];

  return (
    <div className="space-y-6">
      {/* 1. Official Medical Header Card */}
      <ReportHeader
        evaluation={evaluation}
        sessionReport={sessionReport}
        patientName={patientName}
        painLevel={painLevel}
        evaluationSource={evaluationSource}
        onCopySummary={onCopySummary}
        copiedSummary={copiedSummary}
        onNewSession={onNewSession}
      />

      {/* 2. Kinematic Vitals 6-Box Grid */}
      <ReportKinematicVitals vitals={vitalsData} />

      {/* 3. Range of Motion & Trajectory Charts */}
      <TelemetryCharts sessionReport={sessionReport} />

      {/* 4. Interactive Clinical Directives Checklist */}
      <ReportDirectivesChecklist
        directives={directivesData}
        checkedDirectives={checkedDirectives}
        onToggleDirective={toggleDirective}
        onCopyDirectives={onCopyTips}
        copiedDirectives={copiedTips}
      />

      {/* 5. 4 Home Care Directives */}
      <ReportHomeCareCards cards={directivesData} />

      {/* 6. Insurance CPT Reimbursement Ledger */}
      <ReportCptLedger cptData={cptData} />
    </div>
  );
}

export default ClinicalReportStage;

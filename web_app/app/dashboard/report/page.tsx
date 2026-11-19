'use client';

import React, { useState, useEffect } from 'react';
import { DealDeckReportView } from '@/components/report/dealdeck/DealDeckReportView';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { SessionReport } from '@/lib/clinical-engine';

export default function PatientReportPage() {
  const [localReport, setLocalReport] = useState<SessionReport | null>(null);
  const convexSessions = useQuery(api.sessions.listSessions, { limit: 1 });

  useEffect(() => {
    async function fetchLocal() {
      try {
        const res = await fetch('/api/session-status');
        if (res.ok) {
          const data = await res.json();
          if (data.report) {
            setLocalReport(data.report);
          }
        }
      } catch (e) {
        console.warn('Notice: session-status fetch error', e);
      }
    }
    fetchLocal();
  }, []);

  const activeReport = localReport || (convexSessions && convexSessions.length > 0
    ? {
        session_id: convexSessions[0].sessionId || 'sess_1',
        timestamp: new Date(convexSessions[0].createdAt).toISOString(),
        patient_name: convexSessions[0].patientName,
        prescribed_diagnosis: convexSessions[0].prescribedDiagnosis,
        overall_compliance_percent: convexSessions[0].overallCompliancePercent,
        exercises_performed: convexSessions[0].exercisesPerformed,
      }
    : null);

  return (
    <div className="w-full">
      <DealDeckReportView
        sessionReport={activeReport}
        patientName={activeReport?.patient_name}
      />
    </div>
  );
}

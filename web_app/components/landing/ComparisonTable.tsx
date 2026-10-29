'use client';

import React from 'react';

export function ComparisonTable() {
  const comparisons = [
    {
      dimension: 'Hardware Requirements',
      paper: 'None (paper handouts)',
      wearable: 'Proprietary IMU sensor straps',
      physiopulse: 'Standard laptop or mobile webcam'
    },
    {
      dimension: 'Goniometric Precision',
      paper: 'Unmonitored / self-reported',
      wearable: '±3° to 5° (subject to sensor drift)',
      physiopulse: '< 1.4° vs optoelectronic gold standard'
    },
    {
      dimension: 'Form Guidance & Anti-Compensation',
      paper: 'None between appointments',
      wearable: 'Haptic vibration only',
      physiopulse: 'Real-time audio cues and angle arc overlays'
    },
    {
      dimension: 'Prescription Ingestion',
      paper: 'Manual clinician transcription',
      wearable: 'Manual protocol setup',
      physiopulse: 'OCR extraction from doctor scripts and notes'
    },
    {
      dimension: 'Medicare RTM Compliance',
      paper: 'Ineligible for RTM codes',
      wearable: 'Manual log compilation required',
      physiopulse: 'Automated 16-day transmission ledger'
    },
    {
      dimension: 'Patient Privacy Architecture',
      paper: 'Physical paper files',
      wearable: 'Telemetry sent to vendor cloud',
      physiopulse: 'Client-side inference; zero raw video stored'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Technical Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Implementation approach comparison.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            How markerless browser computer vision compares to legacy paper handouts and wearable sensor hardware.
          </p>
        </div>

        {/* Clean Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3.5 px-5">Dimension</th>
                  <th className="py-3.5 px-5">Paper Handouts</th>
                  <th className="py-3.5 px-5">Wearable Sensors</th>
                  <th className="py-3.5 px-5 bg-emerald-50/70 text-emerald-900 font-bold">PhysioPulse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-5 font-medium text-slate-900">
                      {row.dimension}
                    </td>
                    <td className="py-3.5 px-5">
                      {row.paper}
                    </td>
                    <td className="py-3.5 px-5">
                      {row.wearable}
                    </td>
                    <td className="py-3.5 px-5 bg-emerald-50/30 font-medium text-slate-900">
                      {row.physiopulse}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}

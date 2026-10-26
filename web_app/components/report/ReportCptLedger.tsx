'use client';

import React from 'react';
import { DollarSign, ShieldCheck } from 'lucide-react';

export interface CptCodeItem {
  code: string;
  description: string;
  reimbursement: number;
  status: string;
}

export interface ReportCptLedgerProps {
  cptData: {
    icd10_code: string;
    diagnosis_name: string;
    codes: CptCodeItem[];
    monthly_projected_reimbursement: number;
    annual_practice_yield: number;
  };
}

export function ReportCptLedger({ cptData }: ReportCptLedgerProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-sm theme-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <DollarSign className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-sans tracking-tight">
              Insurance Coding & Clinical Reimbursement Ledger
            </h3>
            <p className="text-[11px] text-slate-500 font-sans">
              CMS Remote Therapeutic Monitoring (RTM) compliant CPT coding
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
            Medicare / Commercial RTM Qualified
          </span>
        </div>
      </div>

      {/* ICD-10 Diagnosis Summary */}
      <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 mb-4 font-sans text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Primary Clinical ICD-10 Indication</span>
          <span className="font-bold text-slate-800 text-sm mt-0.5 block">{cptData.diagnosis_name}</span>
        </div>
        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 text-xs self-start sm:self-auto">
          {cptData.icd10_code}
        </span>
      </div>

      {/* CPT Codes Ledger Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden font-sans">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[10px] uppercase">
            <tr>
              <th className="py-2.5 px-4 font-bold">CPT Code</th>
              <th className="py-2.5 px-4 font-bold">Service Description</th>
              <th className="py-2.5 px-4 font-bold">Status</th>
              <th className="py-2.5 px-4 font-bold text-right">Reimbursement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cptData.codes.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-600">{item.code}</td>
                <td className="py-3 px-4 text-slate-700 leading-snug">{item.description}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right">
                  ${item.reimbursement.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Yield Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-1 font-sans">
        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Monthly Projected Patient Yield</span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              ${cptData.monthly_projected_reimbursement.toFixed(2)} / patient
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Active Cycle
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">100-Patient Annual Practice Yield</span>
            <span className="text-lg font-bold font-mono text-blue-600 mt-0.5 block">
              ${cptData.annual_practice_yield.toLocaleString()} / year
            </span>
          </div>
          <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            RTM Scale
          </span>
        </div>
      </div>
    </div>
  );
}

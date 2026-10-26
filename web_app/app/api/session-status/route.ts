import { NextResponse } from 'next/server';
import fs from 'fs';
import { getPrescriptionPath, getReportPath } from '@/lib/paths';



export async function GET() {
  let prescription = null;
  let report = null;

  if (fs.existsSync(getPrescriptionPath())) {
    try {
      prescription = JSON.parse(fs.readFileSync(getPrescriptionPath(), 'utf-8'));
    } catch {}
  }

  if (fs.existsSync(getReportPath())) {
    try {
      report = JSON.parse(fs.readFileSync(getReportPath(), 'utf-8'));
    } catch {}
  }

  return NextResponse.json({
    hasPrescription: !!prescription,
    hasReport: !!report,
    prescription,
    report
  });
}

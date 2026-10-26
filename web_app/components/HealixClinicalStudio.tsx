'use client';

import React, { useState } from 'react';
import { StudioWindowHeader } from './studio/StudioWindowHeader';
import { StudioSubnav } from './studio/StudioSubnav';
import { StudioLeftToolbar } from './studio/StudioLeftToolbar';
import { StudioPatientPassport } from './studio/StudioPatientPassport';
import { StudioAnatomicalHero, HotspotJoint } from './studio/StudioAnatomicalHero';
import { StudioDiagnosticDrawer, DiagnosticScan } from './studio/StudioDiagnosticDrawer';

const HOTSPOT_JOINTS: HotspotJoint[] = [
  {
    id: 'left_shoulder',
    name: 'Left Glenohumeral Joint',
    category: 'Upper Extremity',
    protocolId: 1,
    xPct: 35,
    yPct: 24,
    romTarget: '140°',
    romCurrent: '112°',
    romProgressPct: 80,
    symmetryPct: 92,
    status: 'recovering',
    description: 'Post-operative rotator cuff supraspinatus repair at 4 weeks.'
  },
  {
    id: 'cervical_spine',
    name: 'Cervical Spine (C4-C7)',
    category: 'Spine & Posture',
    protocolId: 3,
    xPct: 50,
    yPct: 15,
    romTarget: '45° Ext',
    romCurrent: '38° Ext',
    romProgressPct: 84,
    symmetryPct: 96,
    status: 'optimal',
    description: 'Forward-head ergonomic strain management.'
  },
  {
    id: 'right_shoulder',
    name: 'Right Shoulder Girdle',
    category: 'Upper Extremity',
    protocolId: 1,
    xPct: 65,
    yPct: 24,
    romTarget: '150°',
    romCurrent: '148°',
    romProgressPct: 98,
    symmetryPct: 98,
    status: 'optimal',
    description: 'Contralateral baseline limb; full pain-free ROM.'
  },
  {
    id: 'left_knee',
    name: 'Left Patellofemoral Complex',
    category: 'Lower Extremity',
    protocolId: 2,
    xPct: 42,
    yPct: 68,
    romTarget: '125°',
    romCurrent: '110°',
    romProgressPct: 88,
    symmetryPct: 91,
    status: 'recovering',
    description: 'Patellar tracking alignment and closed-kinetic-chain squatting.'
  },
  {
    id: 'lumbar_spine',
    name: 'Lumbar Spine (L4-S1)',
    category: 'Spine & Core',
    protocolId: 7,
    xPct: 50,
    yPct: 44,
    romTarget: '60° Flex',
    romCurrent: '52° Flex',
    romProgressPct: 86,
    symmetryPct: 94,
    status: 'recovering',
    description: 'Core pelvic bracing and lumbar neutral control.'
  }
];

const DIAGNOSTIC_SCANS: DiagnosticScan[] = [
  {
    id: 'scan-1',
    name: 'Shoulder MRI Sagittal',
    type: 'MRI T2-Weighted',
    date: 'Sep 12, 2026',
    image: '/scan_shoulder_mri.png',
    aspect: 'Sagittal'
  },
  {
    id: 'scan-2',
    name: 'Chest & Clavicle AP',
    type: 'Radiograph AP',
    date: 'Sep 14, 2026',
    image: '/scan_chest_xray.png',
    aspect: 'AP'
  },
  {
    id: 'scan-3',
    name: 'Knee Weight-Bearing',
    type: 'Radiograph Bilateral',
    date: 'Aug 28, 2026',
    image: '/scan_knee_xray.png',
    aspect: 'AP'
  },
  {
    id: 'scan-4',
    name: 'Cervical Sagittal MRI',
    type: 'MRI High-Res',
    date: 'Sep 02, 2026',
    image: '/scan_spine_sagittal.png',
    aspect: 'Sagittal'
  }
];

export function HealixClinicalStudio({ onStartLiveSession }: { onStartLiveSession?: () => void }) {
  const [selectedJoint, setSelectedJoint] = useState<HotspotJoint>(HOTSPOT_JOINTS[0]);
  const [rotationAngle, setRotationAngle] = useState(15);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeTool, setActiveTool] = useState<'pointer' | 'zoom' | 'pan' | 'layers'>('pointer');

  return (
    <div className="w-full max-w-[1580px] mx-auto select-none">
      {/* Outer Window Chrome Container */}
      <div className="relative w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col theme-window">
        {/* 1. Window Browser Chrome Header */}
        <StudioWindowHeader />

        {/* 2. Studio Subnav */}
        <StudioSubnav />

        {/* 3. Main Workbench Canvas */}
        <div className="relative bg-[#EFF2F6] bg-clinical-grid p-4 sm:p-6 lg:p-8 min-h-[660px] flex flex-col lg:flex-row items-stretch gap-6">
          {/* Floating Left Toolbar */}
          <StudioLeftToolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            setRotationAngle={setRotationAngle}
          />

          {/* Left Column: Curtis Valk Patient Passport Card */}
          <StudioPatientPassport />

          {/* Center Column: 3D Anatomical Muscular Body Stage */}
          <StudioAnatomicalHero
            joints={HOTSPOT_JOINTS}
            selectedJoint={selectedJoint}
            onSelectJoint={setSelectedJoint}
            rotationAngle={rotationAngle}
            setRotationAngle={setRotationAngle}
            zoomLevel={zoomLevel}
          />

          {/* Right Column: Diagnostic Scans Drawer */}
          <StudioDiagnosticDrawer
            selectedJoint={selectedJoint}
            scans={DIAGNOSTIC_SCANS}
            onSelectScan={(scan) => {
              alert(`Opened ${scan.name} (${scan.type}) captured on ${scan.date}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default HealixClinicalStudio;

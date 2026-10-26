'use client';

import React from 'react';
import { HealixClinicalStudio } from '@/components/HealixClinicalStudio';

export default function LandingPage() {
  return (
    <main className="min-h-screen w-full bg-[#E8ECF2] flex items-center justify-center p-2 sm:p-4 lg:p-6 select-none overflow-x-hidden">
      <HealixClinicalStudio
        onStartLiveSession={() => {
          window.location.href = '/session';
        }}
      />
    </main>
  );
}

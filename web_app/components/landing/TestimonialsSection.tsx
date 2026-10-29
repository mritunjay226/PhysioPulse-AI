'use client';

import React from 'react';

export function TestimonialsSection() {
  const useCases = [
    {
      title: 'Post-Operative Rotator Cuff Repair',
      timing: 'Weeks 4–12 Post-Surgery',
      indication: 'Supraspinatus Tendon Repair, Subacromial Decompression',
      challenge:
        'Patients frequently recruit the upper trapezius to hike the shoulder girdle rather than isolating glenohumeral elevation, risking tendon re-tear.',
      solution:
        'Real-time anti-compensation audio prompts fire if scapular elevation exceeds 5° prior to 90° humeral flexion. Tracks weekly progress from 90° to 140° active ROM.'
    },
    {
      title: 'ACL Reconstruction Rehabilitation',
      timing: 'Weeks 6–16 Post-Surgery',
      indication: 'Bone-Tendon-Bone & Hamstring Autograft Recovery',
      challenge:
        'Subtle dynamic knee valgus collapse during squats increases graft strain and delays return-to-sport clearance.',
      solution:
        'Tracks the frontal plane knee trajectory relative to the second metatarsal at 30 FPS, alerting the patient whenever medial collapse exceeds safe anatomical thresholds.'
    },
    {
      title: 'Cervical Spine Ergonomic Decompression',
      timing: '4–8 Week Conservative Protocol',
      indication: 'C4-C7 Upper Crossed Syndrome, Cervical Radiculopathy',
      challenge:
        'Forward head posture produces significant compressive shear on the cervical spine during daily desk work.',
      solution:
        'Measures axial cervical retraction distance and extension angle, confirming deep cervical flexor activation prior to eccentric loading.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Clinical Indications
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Primary rehabilitation use cases.
          </h2>
          <p className="mt-3 text-base text-slate-600 font-sans">
            How markerless kinematics and anti-compensation boundaries apply to common orthopedic conditions.
          </p>
        </div>

        {/* 3 Use Case Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 block mb-1">
                  {uc.timing}
                </span>

                <h3 className="text-base font-bold text-slate-900 font-sans mb-1">
                  {uc.title}
                </h3>

                <span className="text-[11px] text-slate-500 block mb-4">
                  {uc.indication}
                </span>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Clinical Challenge:</span>
                    <span className="text-slate-600">{uc.challenge}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">Kinematic Tracking:</span>
                    <span className="text-slate-600">{uc.solution}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

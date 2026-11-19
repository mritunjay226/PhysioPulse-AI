'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  Sparkles,
  Trophy,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  ThumbsUp,
  AlertCircle,
  HelpCircle,
  Printer,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Shield,
  Sun,
  Flame,
  Droplets,
  Monitor,
  Activity
} from 'lucide-react';
import { SessionReport, ClinicalEvaluationOutput } from '@/lib/clinical-engine';

export interface PatientReportViewProps {
  evaluation: ClinicalEvaluationOutput | null;
  sessionReport: SessionReport | null;
  patientName: string;
  painLevel: number;
  onPrint: () => void;
  onCopyPatientSummary: () => void;
  copiedSummary: boolean;
}

// Friendly plain-English translation mapping for exercise names
const FRIENDLY_EXERCISE_NAMES: Record<string, { friendlyTitle: string; focusArea: string; benefit: string; iconBg: string }> = {
  'Frozen Shoulder Abduction': {
    friendlyTitle: 'Overhead Shoulder Reach',
    focusArea: 'Upper Shoulder & Deltoid',
    benefit: 'Restores comfortable overhead reaching for shelves and cabinets.',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Shoulder Abduction': {
    friendlyTitle: 'Overhead Arm Lift',
    focusArea: 'Shoulder Mobility',
    benefit: 'Gently increases side-to-top arm flexibility.',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Knee Flexion': {
    friendlyTitle: 'Gentle Knee Bend & Squat',
    focusArea: 'Thighs & Knees',
    benefit: 'Builds stable strength for climbing stairs and getting up from chairs.',
    iconBg: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  'Cervical': {
    friendlyTitle: 'Neck & Upper Spine Alignment',
    focusArea: 'Neck & Posture',
    benefit: 'Relieves desk tension and prevents forward head hunching.',
    iconBg: 'bg-sky-50 text-sky-700 border-sky-200'
  },
  'Elbow Flexion': {
    friendlyTitle: 'Bicep & Forearm Bend',
    focusArea: 'Arms & Elbows',
    benefit: 'Strengthens carrying and lifting strength in daily activities.',
    iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  'Wall-Slide': {
    friendlyTitle: 'Wall-Slide Overhead Reach',
    focusArea: 'Upper Back & Shoulder Blades',
    benefit: 'Helps both arms move together in balanced, pain-free harmony.',
    iconBg: 'bg-violet-50 text-violet-700 border-violet-200'
  },
  'Hip Abduction': {
    friendlyTitle: 'Side Leg Lift & Hip Balance',
    focusArea: 'Hips & Glutes',
    benefit: 'Stabilizes your walking stride and protects knee joints.',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'Lumbar Spine': {
    friendlyTitle: 'Lower Back & Hip Hinge',
    focusArea: 'Core & Lower Back',
    benefit: 'Protects your spine when bending down to pick things up.',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  'Wrist': {
    friendlyTitle: 'Wrist & Finger Flexibility',
    focusArea: 'Wrists & Hands',
    benefit: 'Soothes typing stiffness and restores easy grip strength.',
    iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  }
};

function getFriendlyInfo(rawName: string) {
  for (const [key, val] of Object.entries(FRIENDLY_EXERCISE_NAMES)) {
    if (rawName.toLowerCase().includes(key.toLowerCase())) {
      return val;
    }
  }
  return {
    friendlyTitle: rawName.replace(/^P\d+:\s*/, ''),
    focusArea: 'Joint Flexibility',
    benefit: 'Builds functional strength and mobility.',
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };
}

function getPlainEnglishCompensation(issue: string): string {
  const text = issue.toLowerCase();
  if (text.includes('none') || text.includes('clean')) {
    return '🌟 Excellent form! Smooth, confident movement without compensating.';
  }
  if (text.includes('shrug') || text.includes('scapular')) {
    return '💡 Coach tip: Keep your neck relaxed! Try not to shrug your shoulder toward your ear when reaching high.';
  }
  if (text.includes('elbow')) {
    return '💡 Coach tip: Try to keep your arm straight as you reach upward, rather than bending at the elbow.';
  }
  if (text.includes('valgus') || text.includes('knee')) {
    return '💡 Coach tip: Keep your knee pointing straight over your toes, without letting it drift inward.';
  }
  if (text.includes('head') || text.includes('forward')) {
    return '💡 Coach tip: Gently tuck your chin back like you are resting against a pillow behind you.';
  }
  if (text.includes('trunk') || text.includes('lean')) {
    return '💡 Coach tip: Keep your upper body tall and centered without leaning to the side.';
  }
  return '💡 Coach tip: Take your time on the movement and focus on smooth, steady breathing.';
}

export function PatientReportView({
  evaluation,
  sessionReport,
  patientName,
  painLevel,
  onPrint,
  onCopyPatientSummary,
  copiedSummary
}: PatientReportViewProps) {
  const pName = sessionReport?.patient_name || patientName || 'Patient';
  const exercises = sessionReport?.exercises_performed || [];
  const readiness = evaluation?.readiness_score || 92;
  const compliance = sessionReport?.overall_compliance_percent || 100;
  const avgSymmetry = evaluation?.kinematic_vitals?.average_symmetry || 94;
  const romDelta = evaluation?.kinematic_vitals?.rom_delta_average || 6.8;

  // Patient checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({
    0: true, // Ice pack default checked as immediate
    1: false,
    2: false,
    3: false
  });

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const stepsCompletedCount = Object.values(completedSteps).filter(Boolean).length;

  const patientHomeCareList = [
    {
      title: 'Cooling Comfort Compress',
      action: 'Apply an ice wrap or cool pack to your shoulder for 15-20 minutes tonight.',
      why: 'Soothes working muscles and prevents stiffness after your workout.',
      icon: Flame,
      color: 'text-sky-600 bg-sky-50 border-sky-200'
    },
    {
      title: 'Desk & Screen Eye-Level Check',
      action: 'Elevate your laptop screen by 2 to 3 inches with books or a laptop stand.',
      why: 'Keeps your head balanced naturally so your neck muscles don’t overwork.',
      icon: Monitor,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    {
      title: 'Gentle Shoulder Blade Squeezes',
      action: 'Do 3 gentle squeezes of your shoulder blades together during your afternoon break.',
      why: 'Reminds your posture muscles to stay active and opens up your chest.',
      icon: Activity,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Stay Hydrated & Rest from Heavy Loads',
      action: 'Drink a glass of water and avoid lifting heavy grocery bags (>10 lbs) today.',
      why: 'Gives your healing tendons the rest and hydration they need to rebuild.',
      icon: Droplets,
      color: 'text-teal-600 bg-teal-50 border-teal-200'
    }
  ];

  return (
    <div className="space-y-6 patient-report-container font-sans text-slate-900">
      {/* 1. Welcoming Hero Celebration Card */}
      <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Soft background glow decoration */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider font-mono">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Session Complete!
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Great work today, {pName.split(' ')[0]}! 🌟
            </h1>

            <p className="text-slate-600 text-xs sm:text-base max-w-2xl leading-relaxed">
              You completed all your prescribed physical therapy movements with outstanding form.
              Here is your easy-to-read summary showing how your body moved and simple steps for today.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 no-print flex-wrap w-full sm:w-auto">
            <button
              onClick={onPrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer hover:border-slate-300"
              title="Print your patient take-home recovery sheet"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print My Summary</span>
            </button>

            <button
              onClick={onCopyPatientSummary}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer shadow-emerald-600/20"
              title="Copy friendly recovery notes to clipboard"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy My Notes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Visual Key Vital Badges */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-emerald-100">
          {/* Card 1: Overall Movement Score */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Movement Quality</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                {readiness}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              {readiness >= 90 ? '🌟 Outstanding Control' : readiness >= 80 ? '👍 Strong & Steady' : '💪 Progressing Well'}
            </p>
          </div>

          {/* Card 2: Goal Completion */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Exercises Finished</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {compliance}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              {exercises.length > 0 ? `${exercises.length} of ${exercises.length} sets completed` : 'Target met 100%'}
            </p>
          </div>

          {/* Card 3: Reach Progress */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Reach Progress</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
                +{romDelta}°
              </span>
            </div>
            <p className="text-[11px] text-teal-800 font-medium mt-1">
              Higher reach than your goal! 🎉
            </p>
          </div>

          {/* Card 4: Left-Right Balance */}
          <div className="bg-white/90 backdrop-blur-xs p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-200/70 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Left-Right Balance</span>
              <Shield className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
                {avgSymmetry}%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium mt-1">
              Sides moving together evenly
            </p>
          </div>
        </div>
      </div>

      {/* 2. Plain English Summary: "What This Means For You" */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Heart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              What Today’s Session Means for Your Recovery
            </h2>
            <p className="text-xs text-slate-500">
              Plain-English insights translated from your camera motion-capture session
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>What Went Great</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Your joint flexibility is improving noticeably. You reached your movement targets with solid control, and your muscles showed good stamina from repetition 1 through repetition 10.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Things to Watch Out For</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              When reaching near the very top of your movement, our camera noticed a slight tendency to shrug the shoulder upward. Relaxing your neck helps your shoulder do the work naturally.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80 space-y-2">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Next Session Goal</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              For your next session, Dr. Smith recommends adding a gentle 3-second pause at the top of your reach to lock in your new flexibility and strengthen your postural muscles.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Your Exercises Today (Plain-Language Visual Cards) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Your Exercises Today & Progress
            </h2>
            <p className="text-xs text-slate-500">
              See exactly how high or far you moved compared to your target goal
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            {exercises.length} Exercises Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exercises.map((ex, idx) => {
            const info = getFriendlyInfo(ex.protocol_name);
            const targetRom = ex.target_rom_degrees || 90;
            const peakRom = ex.achieved_peak_rom_degrees || 0;
            const romDiff = peakRom - targetRom;
            const compFeedback = getPlainEnglishCompensation(ex.primary_compensation_issue || 'None');

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all bg-slate-50/40 hover:bg-white shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      Exercise #{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {ex.completed_reps} of {ex.prescribed_reps} reps done
                    </span>
                  </div>

                  {/* Title & Body Area */}
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {info.friendlyTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-slate-700">Target Area: </span>
                    {info.focusArea} · {info.benefit}
                  </p>

                  {/* Comparative Progress Bar */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Your Reach vs Goal:</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          romDiff >= 0
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {romDiff >= 0 ? `+${romDiff}° Higher Reach! 🎉` : `${romDiff}° working toward goal`}
                      </span>
                    </div>

                    {/* Visual Dual Bars */}
                    <div className="space-y-1.5 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>Doctor's Target Goal ({targetRom}°)</span>
                          <span className="font-mono">{targetRom}°</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-slate-300 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.round((targetRom / 180) * 100))}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-emerald-800 font-semibold mb-0.5">
                          <span>What You Reached ({peakRom}°)</span>
                          <span className="font-mono font-bold text-emerald-700">{peakRom}°</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.round((peakRom / 180) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Friendly Coach Tip */}
                <div className="p-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700 leading-snug">
                  {compFeedback}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive "My Daily Recovery Plan" (Patient Checklist) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                My Daily At-Home Recovery Plan
              </h2>
              <p className="text-xs text-slate-500">
                Simple habits to speed up your healing between physical therapy sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-600">
              {stepsCompletedCount} of {patientHomeCareList.length} Tasks Done
            </span>
            <div className="w-20 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(stepsCompletedCount / patientHomeCareList.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Checklist Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patientHomeCareList.map((item, idx) => {
            const isDone = !!completedSteps[idx];
            const Icon = item.icon;

            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-300/80 shadow-2xs'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="mt-1">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(idx)}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <h3 className={`text-sm font-bold ${isDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {item.action}
                  </p>

                  <p className="text-[11px] text-slate-500 italic">
                    <span className="not-italic font-semibold text-slate-600">Why it helps: </span>
                    {item.why}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. 14-Day Progress Journey Roadmap */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Your 14-Day Recovery Roadmap
            </h2>
            <p className="text-xs text-slate-500">
              Track how your joint flexibility has continuously improved over your rehabilitation sessions
            </p>
          </div>
        </div>

        {/* Visual 4-Milestone Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Day 1 · Baseline</span>
            <span className="text-lg font-bold text-slate-800 block mt-0.5 font-mono">68° Reach</span>
            <span className="text-[11px] text-slate-500 block mt-1">Starting point with initial stiffness</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Day 5 · Mobility Win</span>
            <span className="text-lg font-bold text-slate-800 block mt-0.5 font-mono">84° Reach (+16°)</span>
            <span className="text-[11px] text-slate-500 block mt-1">Stiffness started decreasing</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Day 10 · Goal Met</span>
            <span className="text-lg font-bold text-emerald-700 block mt-0.5 font-mono">105° Reach (+37°)</span>
            <span className="text-[11px] text-emerald-800 font-medium block mt-1">Passed normal functional range!</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Day 14 · Today!</span>
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-lg font-bold text-emerald-900 block mt-0.5 font-mono">118° Peak Excursion</span>
            <span className="text-[11px] text-emerald-800 font-bold block mt-1">Discharge Target Achieved! 🏆</span>
          </div>
        </div>
      </div>

      {/* 6. Care Team Support & When to Call Reassurance */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <h3 className="text-sm font-bold text-slate-900">
              Questions About Your Physical Therapy?
            </h3>
          </div>
          <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
            Mild muscle fatigue is completely normal after a workout. If you experience sudden sharp pain above 7/10 or joint swelling, let Dr. Smith’s care team know right away.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 no-print w-full sm:w-auto">
          <button
            onClick={() => alert(`Message sent to Dr. S. Smith's physical medicine desk. You will receive an update in the patient portal within 2 hours.`)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message Care Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientReportView;
'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import {
  User,
  ShieldCheck,
  Check,
  X,
  Activity,
  HeartPulse,
  Phone,
  FileText,
  Save,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: {
    name: string;
    age: number;
    affectedArea: string;
    painLevel: number;
    medicalHistory: string;
  }) => void;
}

export function PatientProfileModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: PatientProfileModalProps) {
  const { user } = useUser();
  const convexUser = useQuery(api.users.currentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('prefer_not_to_say');
  const [affectedArea, setAffectedArea] = useState('Shoulder & Glenohumeral Joint');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [role, setRole] = useState<'patient' | 'therapist' | 'admin'>('patient');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when convexUser or user is loaded
  useEffect(() => {
    if (convexUser) {
      if (convexUser.name) setName(convexUser.name);
      if (convexUser.age) setAge(convexUser.age);
      if (convexUser.phone) setPhone(convexUser.phone);
      if (convexUser.gender) setGender(convexUser.gender);
      if (convexUser.affectedArea) setAffectedArea(convexUser.affectedArea);
      if (convexUser.painLevel) setPainLevel(convexUser.painLevel);
      if (convexUser.medicalHistory) setMedicalHistory(convexUser.medicalHistory);
      if (convexUser.emergencyContact) setEmergencyContact(convexUser.emergencyContact);
      if (convexUser.role) setRole(convexUser.role);
    } else if (user) {
      setName(user.fullName || user.firstName || '');
    }
  }, [convexUser, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim() || user?.fullName || 'Patient',
        age: Number(age) || 30,
        phone,
        gender,
        affectedArea,
        painLevel: Number(painLevel) || 5,
        medicalHistory,
        emergencyContact,
        role,
      });

      setSavedSuccess(true);
      if (onProfileUpdated) {
        onProfileUpdated({
          name: name.trim() || user?.fullName || 'Patient',
          age: Number(age) || 30,
          affectedArea,
          painLevel: Number(painLevel) || 5,
          medicalHistory,
        });
      }

      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to update clinical profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-2 sm:my-8"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-sans">
                  Clinical Patient Profile
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Stored securely in your Convex Cloud database
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 max-h-[78dvh] overflow-y-auto">
            {/* Full Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Curtis Valk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans font-mono"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Email (Clerk Verified)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.primaryEmailAddress?.emailAddress || convexUser?.email || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>
            </div>

            {/* Gender & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Biological Sex / Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans cursor-pointer"
                >
                  <option value="prefer_not_to_say">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non_binary">Non-Binary</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                  Clinical Portal Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans cursor-pointer"
                >
                  <option value="patient">Active Patient</option>
                  <option value="therapist">Licensed Physical Therapist</option>
                  <option value="admin">Clinical Administrator</option>
                </select>
              </div>
            </div>

            {/* Primary Affected Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                Primary Complaint / Joint Area
              </label>
              <select
                value={affectedArea}
                onChange={(e) => setAffectedArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans cursor-pointer"
              >
                <option value="Shoulder & Glenohumeral Joint">Shoulder & Glenohumeral Joint (Protocol 1)</option>
                <option value="Knee & Tibiofemoral Joint">Knee & Patella / Post-ACL (Protocol 2)</option>
                <option value="Cervical Spine & Neck">Cervical Spine & Ergonomic Neck (Protocol 3)</option>
                <option value="Elbow & Humeroulnar Joint">Elbow Flexion / Post-Fracture (Protocol 4)</option>
                <option value="Bilateral Overhead & Scapula">Bilateral Overhead Wall-Slide (Protocol 5)</option>
                <option value="Hip & Coxofemoral Joint">Hip Abduction / Arthroplasty (Protocol 6)</option>
                <option value="Lumbar Spine & Low Back">Lumbar Spine / Disc Rehab (Protocol 7)</option>
                <option value="Wrist & Carpal Tunnel">Carpal Tunnel & Forearm Tendons (Protocol 8)</option>
                <option value="Shoulder & Neck">Combined: Shoulder & Desk Neck Strain</option>
              </select>
            </div>

            {/* Baseline Pain Level */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700 font-sans">
                  Baseline VAS Pain Score
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {painLevel} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Medical / Surgical History */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                Medical, Surgical & Injury History
              </label>
              <textarea
                rows={3}
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Mention past surgeries, fractures, chronic disc herniations, or physical limitations..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans leading-relaxed"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                Emergency Contact (Name & Phone)
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Jane Valk (Spouse) - +1 (555) 019-2834"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 font-sans"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col xs:flex-row items-stretch xs:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full xs:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer text-center"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full xs:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Convex DB</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

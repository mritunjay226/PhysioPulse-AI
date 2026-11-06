'use client';

import React, { useState } from 'react';
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import { ShieldCheck, User, Key, Check, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function UserAuthNav() {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const sampleEnv = `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...\nCLERK_SECRET_KEY=sk_test_...`;

  const copySample = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasClerkKey) {
    return (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="Convex is active! Click to connect Clerk Auth"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-600">Convex DB Active</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
              + Clerk Setup
            </span>
          </button>
        </div>

        {/* Modal explaining Clerk key configuration */}
        <AnimatePresence>
          {showKeyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Clerk + Convex Integrated</h3>
                      <p className="text-xs text-slate-500">Add your Clerk keys to complete user auth</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                  <p>
                    Convex is live and syncing with your deployment <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">calm-impala-999</code>.
                  </p>
                  <p>
                    To enable 1-click Google, Apple, and Email authentication, paste your Clerk keys into <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">web_app/.env.local</code>:
                  </p>

                  <div className="relative bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                    <pre>{sampleEnv}</pre>
                    <button
                      onClick={copySample}
                      className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-slate-500">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Get keys at <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">dashboard.clerk.com</a> & configure Convex JWT template.</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
                  >
                    Got it
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition cursor-pointer">
            Register
          </button>
        </SignUpButton>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center gap-2 pl-1">
          <UserBadge />
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 rounded-xl border border-emerald-500/30",
              },
            }}
          />
        </div>
      </Show>
    </div>
  );
}

function UserBadge() {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="hidden lg:flex flex-col text-right">
      <span className="text-xs font-bold text-slate-900 leading-tight">
        {user.fullName || user.firstName || "Patient"}
      </span>
      <span className="text-[10px] font-mono text-emerald-600 font-semibold leading-none">
        Active Patient
      </span>
    </div>
  );
}

'use client';

import React from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs';

export function UserAuthNav() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse shrink-0" />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {user?.fullName || user?.firstName || 'Patient'}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold leading-none">
              Active Patient
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8 rounded-xl border border-emerald-500/30',
              },
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}

'use client';

import React, { ReactNode, useEffect } from 'react';
import { ConvexReactClient, ConvexProvider, useMutation } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ClerkProvider, useAuth, useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://calm-impala-999.convex.cloud';
const convex = new ConvexReactClient(convexUrl);
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function UserSyncBridge() {
  const { user, isLoaded, isSignedIn } = useUser();
  const storeUser = useMutation(api.users.storeUser);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      storeUser({
        clerkId: user.id,
        name: user.fullName || user.firstName || 'PhysioPulse Patient',
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      }).catch((err) => {
        console.warn('Convex user sync notice:', err);
      });
    }
  }, [isLoaded, isSignedIn, user, storeUser]);

  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!clerkPublishableKey) {
    return (
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSyncBridge />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

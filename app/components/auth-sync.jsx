'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/store';

/**
 * AuthSync component that synchronizes the NextAuth session with the Zustand user store.
 * This ensures the user store always has the most up-to-date session information.
 */
export default function AuthSync() {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // If there's a valid session with user data
    if (session?.user) {
      // If there's no user in the store, or the user IDs don't match, update the store
      if (!user || user.id !== session.user.id) {
        setUser({
          id: session.user.id,
          firstname: session.user.firstname,
          lastname: session.user.lastname,
          email: session.user.email,
          // Include any other fields from the session you need
        });
      }
    }
  }, [session, setUser, user]);

  // This is a utility component that doesn't render anything
  return null;
}

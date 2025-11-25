'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name?: string;
    isAdmin?: boolean;
}

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    signOut: () => void;
}

export const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            signOut: async () => {
                try {
                    await fetch('/api/auth/signout', { method: 'POST' });
                    set({ user: null });
                } catch (error) {
                    console.error('Signout error:', error);
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);

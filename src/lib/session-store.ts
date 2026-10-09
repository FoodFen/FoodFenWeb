import type { AuthSessionResponse, UserResponse } from '@/api/generated'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthUser = Pick<UserResponse, 'id' | 'email' | 'role'> & {
  displayName: string | null
}

export function toAuthUser(user: UserResponse): AuthUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? null,
    role: user.role,
  }
}

type SessionState = {
  user: AuthUser | null
  refreshToken: string | null
  accessToken: string | null
  /** Epoch milliseconds, as returned by the BE. */
  expiresAt: number | null
  setSession: (session: AuthSessionResponse) => void
  setUser: (user: UserResponse) => void
  clear: () => void
}

// The user and refresh token survive reloads (localStorage, so every tab shares one session; the BE
// rotates the refresh token on each use). The access token is short-lived and stays in memory.
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      refreshToken: null,
      accessToken: null,
      expiresAt: null,
      setSession: ({ user, accessToken, refreshToken, expiresAt }) =>
        set({ user: toAuthUser(user), accessToken, refreshToken, expiresAt }),
      setUser: (user) => set({ user: toAuthUser(user) }),
      clear: () => set({ user: null, refreshToken: null, accessToken: null, expiresAt: null }),
    }),
    {
      name: 'foodfen-session',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, refreshToken: state.refreshToken }),
    },
  ),
)

import type { AuthSessionResponse } from '@/api/generated'
import {
  passwordResetAuthPasswordResetPostMutation,
  resetPasswordAuthResetPasswordPostMutation,
  signInAuthSignInPostMutation,
  signOutAuthSignOutPostMutation,
  signUpAuthSignUpPostMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import { queryClient } from '@/api/query-client'
import { useSessionStore } from '@/lib/session-store'
import { useMutation } from '@tanstack/react-query'

// The auth forms show failures inline, and sign-out ignores them, so none of these toast an error.
const inlineError = { errorToast: false } as const

const startSession = (session: AuthSessionResponse) =>
  useSessionStore.getState().setSession(session)

export const useSignIn = () =>
  useMutation({ ...signInAuthSignInPostMutation(), onSuccess: startSession, meta: inlineError })

export const useSignUp = () =>
  useMutation({ ...signUpAuthSignUpPostMutation(), onSuccess: startSession, meta: inlineError })

export const usePasswordReset = () =>
  useMutation({ ...passwordResetAuthPasswordResetPostMutation(), meta: inlineError })

export const useResetPassword = () =>
  useMutation({ ...resetPasswordAuthResetPasswordPostMutation(), meta: inlineError })

// Ending the session must never depend on the network: the local state is cleared either way.
export function useSignOut() {
  return useMutation({
    ...signOutAuthSignOutPostMutation(),
    meta: inlineError,
    onSettled: () => {
      useSessionStore.getState().clear()
      queryClient.clear()
    },
  })
}

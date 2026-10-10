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

const startSession = (session: AuthSessionResponse) =>
  useSessionStore.getState().setSession(session)

export const useSignIn = () =>
  useMutation({ ...signInAuthSignInPostMutation(), onSuccess: startSession })

export const useSignUp = () =>
  useMutation({ ...signUpAuthSignUpPostMutation(), onSuccess: startSession })

export const usePasswordReset = () => useMutation(passwordResetAuthPasswordResetPostMutation())

export const useResetPassword = () => useMutation(resetPasswordAuthResetPasswordPostMutation())

// Ending the session must never depend on the network: the local state is cleared either way.
export function useSignOut() {
  return useMutation({
    ...signOutAuthSignOutPostMutation(),
    onSettled: () => {
      useSessionStore.getState().clear()
      queryClient.clear()
    },
  })
}

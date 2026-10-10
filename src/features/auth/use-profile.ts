import {
  meAuthMeGetOptions,
  updateMyProfileUsersMePatchMutation,
} from '@/api/generated/@tanstack/react-query.gen'
import { queryClient } from '@/api/query-client'
import { useSessionStore } from '@/lib/session-store'
import { useMutation, useQuery } from '@tanstack/react-query'

// Same query as SessionSync, so the cache entry is shared.
export const useProfile = () => useQuery(meAuthMeGetOptions())

export const useUpdateProfile = () =>
  useMutation({
    ...updateMyProfileUsersMePatchMutation(),
    onSuccess: (user) => {
      useSessionStore.getState().setUser(user)
      void queryClient.invalidateQueries({ queryKey: meAuthMeGetOptions().queryKey })
    },
  })

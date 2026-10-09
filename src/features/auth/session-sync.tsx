import { meAuthMeGetOptions } from '@/api/generated/@tanstack/react-query.gen'
import { parseApiError } from '@/api/errors'
import { useSessionStore } from '@/lib/session-store'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

/**
 * Pings the BE (`GET /auth/me`) while a session exists. This revalidates it, refreshing the access
 * token on the way if needed, and keeps the stored profile current. An explicit 401 ends the session.
 */
export function SessionSync() {
  const signedIn = useSessionStore((s) => s.user !== null)
  const { data, error } = useQuery({
    ...meAuthMeGetOptions(),
    enabled: signedIn,
    staleTime: 5 * 60_000,
  })

  useEffect(() => {
    if (data) useSessionStore.getState().setUser(data)
  }, [data])

  useEffect(() => {
    if (error && parseApiError(error).status === 401) useSessionStore.getState().clear()
  }, [error])

  return null
}

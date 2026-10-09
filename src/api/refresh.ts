import { useSessionStore } from '@/lib/session-store'
import { env } from '@/lib/env'
import { isAxiosError } from 'axios'
import { refreshAuthRefreshPost } from './generated'
import { createClient, createConfig } from './generated/client'

// A separate client without interceptors, so a failing refresh can never trigger another refresh.
const refreshClient = createClient(createConfig({ baseURL: env.apiUrl }))

// Treat a token as expired slightly early so a request does not arrive with a dying token.
const SKEW_MS = 30_000

async function rotate(): Promise<string> {
  // Another tab may have rotated the refresh token while this one waited for the lock.
  await useSessionStore.persist.rehydrate()
  const { refreshToken } = useSessionStore.getState()
  if (!refreshToken) throw new Error('No refresh token')

  try {
    const { data } = await refreshAuthRefreshPost({
      client: refreshClient,
      body: { refreshToken },
      throwOnError: true,
    })
    useSessionStore.getState().setSession(data)
    return data.accessToken
  } catch (error) {
    // Only an explicit rejection ends the session; being offline must not log anyone out.
    if (isAxiosError(error) && error.response?.status === 401) useSessionStore.getState().clear()
    throw error
  }
}

// One refresh at a time per tab, and (where supported) one at a time across tabs.
const withLock = <T>(task: () => Promise<T>) =>
  navigator.locks ? navigator.locks.request('foodfen-refresh', task) : task()

let inflight: Promise<string> | null = null

export function refreshAccessToken() {
  inflight ??= withLock(rotate).finally(() => {
    inflight = null
  })
  return inflight
}

/** The token for the next request: reuses the current one, or refreshes when it is missing or expiring. */
export async function getAccessToken() {
  const { accessToken, expiresAt, refreshToken } = useSessionStore.getState()
  if (accessToken && expiresAt && expiresAt - SKEW_MS > Date.now()) return accessToken
  if (!refreshToken) return undefined
  try {
    return await refreshAccessToken()
  } catch {
    return undefined
  }
}

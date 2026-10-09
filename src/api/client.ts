import { env } from '@/lib/env'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { client } from './generated/client.gen'
import { getAccessToken, refreshAccessToken } from './refresh'

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean }

async function retryAfterRefresh(error: AxiosError) {
  const request = error.config as RetriableRequest | undefined
  // Only requests that carried a token can be fixed by a new one, and only once.
  if (error.response?.status !== 401 || !request?.headers.Authorization || request._retried) {
    throw error
  }
  request._retried = true
  let token: string
  try {
    token = await refreshAccessToken()
  } catch {
    throw error
  }
  request.headers.Authorization = `Bearer ${token}`
  return client.instance.request(request)
}

/** Call once at startup, before any request. */
export function configureApi() {
  // `auth` runs only for operations the OpenAPI spec marks as secured.
  client.setConfig({ baseURL: env.apiUrl, auth: getAccessToken })
  client.instance.interceptors.response.use(undefined, retryAfterRefresh)
}

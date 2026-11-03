import { client } from '@/api/generated/client.gen'

type Options = { query?: Record<string, unknown>; body?: unknown; signal?: AbortSignal }

/**
 * One authenticated admin call through the generated axios client, returning the response body.
 * Stands in for the generated SDK while the foods endpoints are missing from it.
 */
export const adminRequest = <T>(
  method: 'get' | 'post' | 'patch',
  url: string,
  options: Options = {},
) =>
  client[method]<{ 200: T }, unknown, true>({
    url,
    security: [{ scheme: 'bearer', type: 'http' }],
    throwOnError: true,
    ...options,
  }).then((response) => response.data)

import { useSessionStore } from '@/lib/session-store'
import { AxiosError, type AxiosResponse } from 'axios'
import { getAccessToken, refreshAccessToken } from './refresh'

const refreshPost = vi.hoisted(() => vi.fn())
vi.mock('./generated', () => ({ refreshAuthRefreshPost: refreshPost }))

const session = (accessToken: string, expiresIn = 600_000) => ({
  accessToken,
  refreshToken: `${accessToken}-refresh`,
  expiresAt: Date.now() + expiresIn,
  user: { id: 1, email: 'a@b.c', displayName: null },
})

beforeEach(() => {
  refreshPost.mockReset()
  useSessionStore.getState().clear()
  useSessionStore.setState({
    user: { id: 1, email: 'a@b.c', displayName: null, role: 'user' },
    refreshToken: 'r0',
  })
})

test('concurrent refreshes share one request', async () => {
  refreshPost.mockResolvedValue({ data: session('new') })
  const tokens = await Promise.all([
    refreshAccessToken(),
    refreshAccessToken(),
    refreshAccessToken(),
  ])
  expect(refreshPost).toHaveBeenCalledTimes(1)
  expect(tokens).toEqual(['new', 'new', 'new'])
})

test('a valid access token is reused without a request', async () => {
  useSessionStore.getState().setSession(session('live') as never)
  expect(await getAccessToken()).toBe('live')
  expect(refreshPost).not.toHaveBeenCalled()
})

test('an expiring access token is refreshed first', async () => {
  useSessionStore.getState().setSession(session('old', 10_000) as never)
  refreshPost.mockResolvedValue({ data: session('fresh') })
  expect(await getAccessToken()).toBe('fresh')
})

test('a rejected refresh token ends the session', async () => {
  refreshPost.mockRejectedValue(
    new AxiosError('no', undefined, undefined, undefined, { status: 401 } as AxiosResponse),
  )
  await expect(refreshAccessToken()).rejects.toThrow()
  expect(useSessionStore.getState().user).toBeNull()
})

test('being offline keeps the session', async () => {
  refreshPost.mockRejectedValue(new AxiosError('Network Error'))
  expect(await getAccessToken()).toBeUndefined()
  expect(useSessionStore.getState().user).not.toBeNull()
})

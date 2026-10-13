import { listUsersAdminUsersGet } from '@/api/generated/sdk.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useAdminUsers } from './use-admin-users'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listUsersAdminUsersGet: vi.fn(),
}))

test('the first page is requested from cursor 0 without throwing', async () => {
  vi.mocked(listUsersAdminUsersGet).mockResolvedValue({
    data: { items: [], nextCursor: null },
  } as never)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  )

  const { result } = renderHook(() => useAdminUsers('an', undefined), { wrapper })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(listUsersAdminUsersGet).toHaveBeenCalledWith(
    expect.objectContaining({ query: expect.objectContaining({ q: 'an', cursor: '0' }) }),
  )
})

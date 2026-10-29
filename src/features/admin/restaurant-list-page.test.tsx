import type { AdminRestaurantRowResponse } from '@/api/generated'
import { listRestaurantsAdminRestaurantsGet } from '@/api/generated/sdk.gen'
import { useSessionStore } from '@/lib/session-store'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listRestaurantsAdminRestaurantsGet: vi.fn(),
}))

const queries = () =>
  vi.mocked(listRestaurantsAdminRestaurantsGet).mock.calls.map(([options]) => options?.query)

test('the default tab lists every restaurant and the pending tab is a URL search param', async () => {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
  vi.mocked(listRestaurantsAdminRestaurantsGet).mockResolvedValue({ data: [] } as never)
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/admin/restaurants'] }),
  })
  await router.load()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  await screen.findByText('Quán mới đăng ký sẽ xuất hiện ở đây.')
  expect(queries()).toContain(undefined)
  expect(router.state.location.search).toEqual({})

  await userEvent.click(screen.getByRole('tab', { name: 'Chờ duyệt' }))

  await screen.findByText(/để chờ duyệt/)
  expect(queries()).toContainEqual({ needsReview: true })
  expect(router.state.location.search).toEqual({ tab: 'pending' })
})

const row = (i: number, name: string): AdminRestaurantRowResponse =>
  ({
    id: `r${i}`,
    name,
    ownerName: null,
    ownerEmail: `owner${i}@x.vn`,
    status: 'approved',
    dishCount: 1,
    pendingDishCount: 0,
    updatedAt: '2026-10-10T09:20:46Z',
  }) as AdminRestaurantRowResponse

test('search and page live in the URL: the list pages by 20 and filters ignoring diacritics', async () => {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
  const rows = Array.from({ length: 24 }, (_, i) => row(i, `Quán ${i}`))
  rows.push(row(99, 'Bún bò Huế'))
  vi.mocked(listRestaurantsAdminRestaurantsGet).mockResolvedValue({ data: rows } as never)
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/admin/restaurants'] }),
  })
  await router.load()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  await screen.findByText('Trang 1 / 2')
  expect(screen.getByText('25 quán')).toBeInTheDocument()
  expect(screen.queryByText('Bún bò Huế')).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Sau' }))
  await screen.findByText('Trang 2 / 2')
  expect(router.state.location.search).toEqual({ page: 2 })
  expect(screen.getByText('Bún bò Huế')).toBeInTheDocument()

  await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm quán' }), 'BUN')

  await screen.findByText('Trang 1 / 1')
  expect(router.state.location.search).toEqual({ q: 'BUN' })
  expect(screen.getByText('1 quán')).toBeInTheDocument()
})

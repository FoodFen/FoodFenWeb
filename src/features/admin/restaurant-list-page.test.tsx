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

const respond = (restaurants: AdminRestaurantRowResponse[], total = restaurants.length) =>
  vi.mocked(listRestaurantsAdminRestaurantsGet).mockResolvedValue({
    data: { restaurants, total, nextCursor: null },
  } as never)

const queries = () =>
  vi.mocked(listRestaurantsAdminRestaurantsGet).mock.calls.map(([options]) => options?.query)

async function renderPage() {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
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
  return router
}

test('the default tab lists every restaurant and the pending tab is a URL search param', async () => {
  respond([])
  const router = await renderPage()

  await screen.findByText('Quán mới đăng ký sẽ xuất hiện ở đây.')
  expect(queries()).toContainEqual({ q: undefined, cursor: '0' })
  expect(router.state.location.search).toEqual({})

  await userEvent.click(screen.getByRole('tab', { name: 'Chờ duyệt' }))

  await screen.findByText(/để chờ duyệt/)
  expect(queries()).toContainEqual({ needsReview: true, q: undefined, cursor: '0' })
  expect(router.state.location.search).toEqual({ tab: 'pending' })
})

test('searching sends q to the server and keeps it in the URL', async () => {
  respond([row(1, 'Quán 1'), row(2, 'Bún bò Huế')], 2)
  const router = await renderPage()
  await screen.findByText('Bún bò Huế')
  expect(screen.getByText('2 quán')).toBeInTheDocument()

  respond([row(2, 'Bún bò Huế')], 1)
  await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm quán' }), 'bun')

  await screen.findByText('1 quán')
  expect(queries()).toContainEqual({ q: 'bun', cursor: '0' })
  expect(router.state.location.search).toEqual({ q: 'bun' })
  expect(screen.queryByText('Quán 1')).not.toBeInTheDocument()
})

test('"Tải thêm" fetches the next page with the cursor and appends it', async () => {
  vi.mocked(listRestaurantsAdminRestaurantsGet).mockImplementation((async (options: {
    query?: { cursor?: string }
  }) => ({
    data:
      options.query?.cursor === '20'
        ? { restaurants: [row(21, 'Quán cuối')], total: 21, nextCursor: null }
        : {
            restaurants: Array.from({ length: 20 }, (_, i) => row(i, `Quán ${i}`)),
            total: 21,
            nextCursor: '20',
          },
  })) as never)
  await renderPage()

  await screen.findByText('21 quán')
  expect(screen.queryByText('Quán cuối')).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Tải thêm' }))

  await screen.findByText('Quán cuối')
  expect(screen.getByText('Quán 0')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Tải thêm' })).not.toBeInTheDocument()
})

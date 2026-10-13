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

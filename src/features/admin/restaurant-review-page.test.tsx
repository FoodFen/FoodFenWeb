import {
  getRestaurantAdminRestaurantsRestaurantIdGet,
  listRestaurantsAdminRestaurantsGet,
} from '@/api/generated/sdk.gen'
import { routeTree } from '@/routeTree.gen'
import { useSessionStore } from '@/lib/session-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listRestaurantsAdminRestaurantsGet: vi.fn(),
  getRestaurantAdminRestaurantsRestaurantIdGet: vi.fn(),
}))

// Shapes copied from real `GET /admin/restaurants` and `GET /admin/restaurants/{id}` responses.
const restaurant = {
  id: 'r1',
  ownerId: 'o1',
  name: 'Bếp Ba Tèo (Demo)',
  description: null,
  address: '1 Lê Lợi',
  phone: '0901234567',
  openingHours: '07:00-21:00',
  imageUrl: null,
  latitude: 10.77,
  longitude: 106.7,
  status: 'approved',
  rejectionReason: null,
  createdAt: '2026-10-10T09:20:46Z',
  updatedAt: '2026-10-10T09:20:46Z',
  reviewedAt: '2026-10-10T09:20:46Z',
}
const dish = (id: string, name: string) => ({
  id,
  restaurantId: 'r1',
  name,
  description: null,
  imageUrl: null,
  price: 40000,
  servingG: 320,
  kcal: 320,
  proteinG: 22,
  carbsG: 44,
  fatG: 6,
  fiberG: 4,
  dietTag: 'none',
  status: 'approved',
  rejectionReason: null,
  createdAt: '2026-10-10T09:20:46Z',
  updatedAt: '2026-10-10T09:20:46Z',
  reviewedAt: '2026-10-10T09:20:46Z',
})

test('opening a restaurant from the list shows its menu', async () => {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
  vi.mocked(listRestaurantsAdminRestaurantsGet).mockResolvedValue({
    data: [
      {
        ...restaurant,
        ownerName: null,
        ownerEmail: 'owner@x.vn',
        dishCount: 2,
        pendingDishCount: 0,
      },
    ],
  } as never)
  vi.mocked(getRestaurantAdminRestaurantsRestaurantIdGet).mockResolvedValue({
    data: { restaurant, dishes: [dish('d1', 'Gỏi cuốn tôm thịt'), dish('d2', 'Bún bò')] },
  } as never)
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

  await userEvent.click(await screen.findByRole('button', { name: 'Xem Bếp Ba Tèo (Demo)' }))

  expect(await screen.findByRole('heading', { name: 'Thực đơn (2 món)' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Gỏi cuốn tôm thịt' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Bún bò' })).toBeInTheDocument()
})

import {
  getRestaurantAdminRestaurantsRestaurantIdGet,
  listRestaurantsAdminRestaurantsGet,
  reviewRestaurantAdminRestaurantsRestaurantIdReviewPost,
} from '@/api/generated/sdk.gen'
import { useSessionStore } from '@/lib/session-store'
import { renderRoutes } from '@/test/render-routes'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'
import { RestaurantListPage } from './restaurant-list-page'
import { RestaurantReviewPage } from './restaurant-review-page'
import { restaurantSearchSchema } from './restaurant-tabs'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listRestaurantsAdminRestaurantsGet: vi.fn(),
  getRestaurantAdminRestaurantsRestaurantIdGet: vi.fn(),
  reviewRestaurantAdminRestaurantsRestaurantIdReviewPost: vi.fn(),
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
const renderAt = (url: string) =>
  renderRoutes(
    [
      {
        path: '/admin/restaurants/',
        component: RestaurantListPage,
        validateSearch: restaurantSearchSchema,
      },
      { path: '/admin/restaurants/$restaurantId', component: RestaurantReviewPage },
    ],
    url,
  )

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
    data: {
      restaurants: [
        {
          ...restaurant,
          ownerName: null,
          ownerEmail: 'owner@x.vn',
          dishCount: 2,
          pendingDishCount: 0,
        },
      ],
      total: 1,
      nextCursor: null,
    },
  } as never)
  vi.mocked(getRestaurantAdminRestaurantsRestaurantIdGet).mockResolvedValue({
    data: {
      restaurant,
      dishes: [dish('d1', 'Gỏi cuốn tôm thịt'), dish('d2', 'Bún bò')],
      ownerName: null,
      ownerEmail: 'owner@x.vn',
    },
  } as never)
  await renderAt('/admin/restaurants')

  await userEvent.click(await screen.findByRole('button', { name: 'Xem Bếp Ba Tèo (Demo)' }))

  expect(await screen.findByRole('heading', { name: 'Thực đơn (2 món)' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Gỏi cuốn tôm thịt' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Bún bò' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'owner@x.vn' })).toBeInTheDocument()
})

test('a failed reject shows its error once, in the dialog', async () => {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
  vi.mocked(getRestaurantAdminRestaurantsRestaurantIdGet).mockResolvedValue({
    data: { restaurant, dishes: [], ownerName: null, ownerEmail: 'owner@x.vn' },
  } as never)
  vi.mocked(reviewRestaurantAdminRestaurantsRestaurantIdReviewPost).mockRejectedValue(
    new AxiosError('bad', undefined, undefined, undefined, {
      status: 400,
      data: { message: 'Không thể từ chối lúc này.' },
    } as never),
  )
  await renderAt('/admin/restaurants/r1')

  await userEvent.click(await screen.findByRole('button', { name: 'Gỡ quán' }))
  await userEvent.type(await screen.findByLabelText('Lý do'), 'Sai thông tin')
  await userEvent.click(screen.getByRole('button', { name: 'Từ chối' }))

  expect(await screen.findAllByText('Không thể từ chối lúc này.')).toHaveLength(1)
})

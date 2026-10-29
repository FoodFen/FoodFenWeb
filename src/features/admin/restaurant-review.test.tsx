import type { DishResponse, RestaurantResponse } from '@/api/generated'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantReview } from './restaurant-review'

const restaurant = (status: RestaurantResponse['status']): RestaurantResponse => ({
  id: 'r1',
  name: 'Bếp Ba Tèo',
  description: null,
  address: '1 Lê Lợi',
  phone: '0901234567',
  openingHours: '07:00-21:00',
  latitude: 10.77,
  longitude: 106.7,
  imageUrl: null,
  status,
  rejectionReason: null,
  createdAt: '2026-10-10T09:20:46Z',
  updatedAt: '2026-10-10T09:20:46Z',
  reviewedAt: null,
})

const dish = (id: string, status: DishResponse['status']): DishResponse => ({
  id,
  restaurantId: 'r1',
  name: `Món ${id}`,
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
  status,
  rejectionReason: null,
  createdAt: '2026-10-10T09:20:46Z',
  updatedAt: '2026-10-10T09:20:46Z',
  reviewedAt: null,
})

const renderReview = (status: RestaurantResponse['status'], dishes: DishResponse[]) => {
  const onApprovePendingDishes = vi.fn()
  render(
    <RestaurantReview
      restaurant={restaurant(status)}
      dishes={dishes}
      busy={false}
      onApproveRestaurant={vi.fn()}
      onRejectRestaurant={vi.fn()}
      onApproveDish={vi.fn()}
      onApprovePendingDishes={onApprovePendingDishes}
      onRejectDish={vi.fn()}
    />,
  )
  return onApprovePendingDishes
}

test('two pending dishes can be approved at once', async () => {
  const dishes = [dish('a', 'pending'), dish('b', 'pending'), dish('c', 'approved')]
  const onApprovePendingDishes = renderReview('approved', dishes)

  await userEvent.click(screen.getByRole('button', { name: 'Duyệt tất cả món đang chờ (2)' }))

  expect(onApprovePendingDishes).toHaveBeenCalledWith([dishes[0], dishes[1]])
})

test('a single pending dish has no bulk button', () => {
  renderReview('approved', [dish('a', 'pending'), dish('b', 'approved')])
  expect(screen.queryByRole('button', { name: /Duyệt tất cả/ })).not.toBeInTheDocument()
})

test('dishes are explained as hidden while the restaurant is pending', () => {
  renderReview('pending', [dish('a', 'approved')])
  expect(
    screen.getByText('Món được duyệt chỉ hiện với người dùng khi quán cũng được duyệt.'),
  ).toBeInTheDocument()
})

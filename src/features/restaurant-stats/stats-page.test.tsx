import type { DishResponse, MyAdPaymentResponse, RestaurantResponse } from '@/api/generated'
import {
  getMyAdsRestaurantsMineAdsGet,
  getMyRestaurantRestaurantsMineGet,
  listMyDishesRestaurantsMineDishesGet,
  listMyPaymentsRestaurantsMinePaymentsGet,
  meAuthMeGet,
} from '@/api/generated/sdk.gen'
import { useSessionStore } from '@/lib/session-store'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  meAuthMeGet: vi.fn(),
  getMyRestaurantRestaurantsMineGet: vi.fn(),
  listMyDishesRestaurantsMineDishesGet: vi.fn(),
  getMyAdsRestaurantsMineAdsGet: vi.fn(),
  listMyPaymentsRestaurantsMinePaymentsGet: vi.fn(),
}))

const restaurant = { id: 'r1', name: 'Bếp Ba Tèo', status: 'approved' } as RestaurantResponse

const dish = (id: string, status: DishResponse['status'], kcal = 320): DishResponse =>
  ({
    id,
    status,
    kcal,
    price: 40000,
    proteinG: 22,
    carbsG: 44,
    fatG: 6,
    dietTag: 'none',
  }) as DishResponse

const payment = (
  orderCode: number,
  status: MyAdPaymentResponse['status'],
): MyAdPaymentResponse => ({
  orderCode,
  amount: 50000,
  status,
  provider: 'payos',
  adDays: 7,
  createdAt: '2026-10-09T03:00:00Z',
  paidAt: status === 'paid' ? '2026-10-09T03:05:00Z' : null,
})

const impressions = Array.from({ length: 30 }, (_, i) => ({
  date: `2026-10-${String(i + 1).padStart(2, '0')}`,
  count: i === 29 ? 12 : 1,
}))

const respond = (payments: MyAdPaymentResponse[], nextCursor: string | null = null) => {
  vi.mocked(getMyRestaurantRestaurantsMineGet).mockResolvedValue({ data: restaurant } as never)
  vi.mocked(listMyDishesRestaurantsMineDishesGet).mockResolvedValue({
    data: [dish('a', 'approved'), dish('b', 'pending'), dish('c', 'rejected', 900)],
  } as never)
  vi.mocked(getMyAdsRestaurantsMineAdsGet).mockResolvedValue({
    data: { featuredUntil: null, packages: [], impressions },
  } as never)
  vi.mocked(listMyPaymentsRestaurantsMinePaymentsGet).mockResolvedValue({
    data: { payments, nextCursor },
  } as never)
}

const notFound = new AxiosError('missing', undefined, undefined, undefined, {
  status: 404,
  data: {},
} as never)

async function renderPage() {
  useSessionStore.setState({ user: { id: 1, email: 'a@b.vn', displayName: null, role: 'user' } })
  vi.mocked(meAuthMeGet).mockReturnValue(new Promise(() => {}) as never)
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/restaurant/stats'] }),
  })
  await router.load()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

afterEach(() => useSessionStore.setState({ user: null }))

test('shows status, impressions, dish counts, spend and the payment history', async () => {
  respond([payment(1700000001, 'paid'), payment(1700000002, 'pending')])
  await renderPage()

  expect(await screen.findByText('1700000001')).toBeInTheDocument()
  const card = (label: string) => screen.getByText(label).parentElement as HTMLElement
  expect(within(card('Lượt hiển thị 7 ngày qua')).getByText('18')).toBeInTheDocument()
  expect(within(card('Lượt hiển thị 30 ngày qua')).getByText('41')).toBeInTheDocument()
  expect(within(card('Đã chi cho quảng cáo')).getByText('50.000 ₫')).toBeInTheDocument()
  expect(within(card('Món đã duyệt')).getByText('1')).toBeInTheDocument()
  expect(within(card('Món chờ duyệt')).getByText('1')).toBeInTheDocument()
  expect(within(card('Món bị từ chối')).getByText('1')).toBeInTheDocument()
  expect(screen.getByText('Không chạy quảng cáo')).toBeInTheDocument()
  expect(screen.getByText('Món cần kiểm tra dinh dưỡng')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Mở trang quán' })).toHaveAttribute('href', '/restaurant')
  expect(screen.getByText('Thanh toán lúc')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Tải thêm' })).not.toBeInTheDocument()
})

test('with more payments to load the spend says how many it covers, and loading more fetches the next page', async () => {
  respond([payment(1700000001, 'paid')], '1')
  await renderPage()

  expect(await screen.findByText('Đã chi trong 1 giao dịch gần nhất')).toBeInTheDocument()
  vi.mocked(listMyPaymentsRestaurantsMinePaymentsGet).mockResolvedValue({
    data: { payments: [payment(1700000009, 'paid')], nextCursor: null },
  } as never)
  await userEvent.click(screen.getByRole('button', { name: 'Tải thêm' }))

  expect(await screen.findByText('1700000009')).toBeInTheDocument()
  expect(screen.getByText('100.000 ₫', { selector: 'p' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Tải thêm' })).not.toBeInTheDocument()
})

test('an owner without payments sees the empty state', async () => {
  respond([])
  await renderPage()

  expect(await screen.findByText('Chưa có giao dịch nào')).toBeInTheDocument()
})

test('a user without a restaurant is pointed to the restaurant page', async () => {
  respond([])
  vi.mocked(getMyRestaurantRestaurantsMineGet).mockRejectedValue(notFound)
  await renderPage()

  expect(await screen.findByText('Bạn cần tạo quán để xem thống kê.')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Tạo quán của bạn' })).toHaveAttribute(
    'href',
    '/restaurant',
  )
})

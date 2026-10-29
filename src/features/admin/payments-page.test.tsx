import type { AdminPaymentRowResponse } from '@/api/generated'
import { listPaymentsAdminPaymentsGet } from '@/api/generated/sdk.gen'
import { useSessionStore } from '@/lib/session-store'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  listPaymentsAdminPaymentsGet: vi.fn(),
}))

const payment = (overrides: Partial<AdminPaymentRowResponse>): AdminPaymentRowResponse => ({
  id: 'p1',
  orderCode: 1700000001,
  userId: 7,
  userEmail: 'an@x.vn',
  userName: 'Nguyễn An',
  restaurantId: null,
  restaurantName: null,
  planType: 'monthly',
  provider: 'payos',
  amount: 99000,
  status: 'paid',
  adDays: null,
  createdAt: '2026-10-09T03:00:00Z',
  paidAt: '2026-10-09T03:05:00Z',
  ...overrides,
})

const respond = (payments: AdminPaymentRowResponse[]) =>
  vi.mocked(listPaymentsAdminPaymentsGet).mockResolvedValue({
    data: { payments, total: payments.length, nextCursor: null },
  } as never)

const queries = () =>
  vi.mocked(listPaymentsAdminPaymentsGet).mock.calls.map(([options]) => options?.query)

async function renderPage(url = '/admin/payments') {
  useSessionStore.setState({
    user: { id: 1, email: 'admin@x.vn', displayName: null, role: 'admin' },
  })
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
  })
  await router.load()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

test('lists payments with plan, ad restaurant link, amount, status and total', async () => {
  respond([
    payment({}),
    payment({
      id: 'p2',
      orderCode: 1700000002,
      planType: 'ad_package',
      adDays: 7,
      restaurantId: 'r1',
      restaurantName: 'Bếp Ba Tèo',
      status: 'pending',
      paidAt: null,
    }),
  ])
  await renderPage()

  expect(await screen.findByText('1700000001')).toBeInTheDocument()
  expect(screen.getByText('2 giao dịch')).toBeInTheDocument()
  expect(screen.getByText('Premium theo tháng', { selector: 'td span' })).toBeInTheDocument()
  expect(screen.getAllByText('99.000 ₫', { selector: 'td' })).toHaveLength(2)
  expect(screen.getByText('Đã thanh toán', { selector: 'td span' })).toBeInTheDocument()
  expect(screen.getByText('Quảng cáo 7 ngày')).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Bếp Ba Tèo' })).toHaveAttribute(
    'href',
    '/admin/restaurants/r1',
  )
  expect(screen.getByText('Chờ thanh toán', { selector: 'td span' })).toBeInTheDocument()
})

test('filters come from the URL and changing one updates the URL and the request', async () => {
  respond([payment({})])
  const router = await renderPage('/admin/payments?status=paid')
  await screen.findByText('1700000001')
  expect(queries()).toContainEqual(expect.objectContaining({ status: 'paid', limit: 20 }))

  await userEvent.selectOptions(screen.getByLabelText('Cổng thanh toán'), 'momo')

  await vi.waitFor(() =>
    expect(router.state.location.search).toEqual({ status: 'paid', provider: 'momo' }),
  )
  await vi.waitFor(() =>
    expect(queries()).toContainEqual(expect.objectContaining({ status: 'paid', provider: 'momo' })),
  )
})

test('typing a search commits it to the URL after a pause', async () => {
  respond([])
  const router = await renderPage()
  await screen.findByText('Không có giao dịch nào')

  await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm giao dịch' }), 'an@x.vn')

  await vi.waitFor(() => expect(router.state.location.search).toEqual({ q: 'an@x.vn' }))
  await vi.waitFor(() =>
    expect(queries()).toContainEqual(expect.objectContaining({ q: 'an@x.vn' })),
  )
})

import { meAuthMeGet, getMyRestaurantRestaurantsMineGet } from '@/api/generated/sdk.gen'
import { useSessionStore } from '@/lib/session-store'
import { routeTree } from '@/routeTree.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  meAuthMeGet: vi.fn(),
  getMyRestaurantRestaurantsMineGet: vi.fn(),
}))

const signIn = (role: 'user' | 'admin') =>
  useSessionStore.setState({ user: { id: 1, email: 'a@b.vn', displayName: null, role } })

const noRestaurant = () =>
  vi.mocked(getMyRestaurantRestaurantsMineGet).mockRejectedValue(
    new AxiosError('missing', undefined, undefined, undefined, {
      status: 404,
      data: {},
    } as never),
  )

async function renderAt(path: string) {
  vi.mocked(meAuthMeGet).mockReturnValue(new Promise(() => {}) as never)
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

afterEach(() => useSessionStore.setState({ user: null }))

describe('MyRestaurantCard on /app', () => {
  test('is hidden for admins', async () => {
    signIn('admin')
    await renderAt('/app')

    await screen.findByText('Thông tin cơ bản')
    expect(screen.queryByText('Quán của tôi')).not.toBeInTheDocument()
    expect(getMyRestaurantRestaurantsMineGet).not.toHaveBeenCalled()
  })

  test('offers to open a restaurant when the user has none', async () => {
    signIn('user')
    noRestaurant()
    await renderAt('/app')

    expect(await screen.findByRole('link', { name: 'Mở quán trên FoodFen' })).toHaveAttribute(
      'href',
      '/restaurant',
    )
  })

  test('shows the name and status of an existing restaurant', async () => {
    signIn('user')
    vi.mocked(getMyRestaurantRestaurantsMineGet).mockResolvedValue({
      data: { name: 'Phở Bát Đàn', status: 'pending' },
    } as never)
    await renderAt('/app')

    await screen.findByText('Phở Bát Đàn')
    expect(screen.getByText('Chờ duyệt')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Quản lý quán' })).toHaveAttribute(
      'href',
      '/restaurant',
    )
  })
})

describe('onboarding', () => {
  beforeEach(() => {
    signIn('user')
    noRestaurant()
  })

  test('the start button stays disabled until the terms are accepted, then opens the form', async () => {
    const router = await renderAt('/restaurant')
    const start = await screen.findByRole('button', { name: 'Bắt đầu đăng ký' })
    expect(start).toBeDisabled()

    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Tôi đã đọc và đồng ý với điều khoản' }),
    )
    expect(start).toBeEnabled()
    await userEvent.click(start)

    await screen.findByRole('heading', { name: 'Đăng ký quán của bạn' })
    expect(router.state.location.pathname).toBe('/restaurant/register')
    expect(router.state.location.search).toEqual({ accepted: true })
  })

  test('the form is not reachable without accepting the terms', async () => {
    const router = await renderAt('/restaurant/register')

    expect(router.state.location.pathname).toBe('/restaurant')
    await screen.findByRole('button', { name: 'Bắt đầu đăng ký' })
  })
})

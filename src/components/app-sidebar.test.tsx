import { useSessionStore } from '@/lib/session-store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppSidebar } from './app-sidebar'
import { SidebarProvider } from './ui/sidebar'

const paths = ['/app', '/restaurant', '/restaurant/ads', '/admin', '/admin/users']

async function renderAt(path: string, role: 'user' | 'admin') {
  useSessionStore.setState({ user: { id: 1, email: 'a@b.vn', displayName: null, role } })
  const root = createRootRoute({
    component: () => (
      <SidebarProvider open>
        <AppSidebar />
        <Outlet />
      </SidebarProvider>
    ),
  })
  const routeTree = root.addChildren(
    paths.map((p) => createRoute({ getParentRoute: () => root, path: p })),
  )
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  render(
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  await screen.findByText('FoodFen')
}

afterEach(() => useSessionStore.setState({ user: null }))

test('signed-in users without the admin role get no admin group', async () => {
  await renderAt('/app', 'user')
  expect(screen.getByRole('link', { name: 'Tài khoản' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Quản trị' })).not.toBeInTheDocument()
})

test('admins get no owner portal group', async () => {
  await renderAt('/app', 'admin')
  expect(screen.getByRole('button', { name: 'Quản trị' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Quán của tôi' })).not.toBeInTheDocument()
})

test('a group opens and closes from its parent button', async () => {
  await renderAt('/app', 'admin')
  const group = screen.getByRole('button', { name: 'Quản trị' })
  expect(group).toHaveAttribute('aria-expanded', 'false')
  expect(screen.queryByRole('link', { name: 'Người dùng' })).not.toBeInTheDocument()

  await userEvent.click(group)
  expect(group).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('link', { name: 'Người dùng' })).toBeVisible()

  await userEvent.click(group)
  expect(group).toHaveAttribute('aria-expanded', 'false')
})

test('the group holding the current route starts open and marks the child active', async () => {
  await renderAt('/restaurant/ads', 'user')
  expect(screen.getByRole('button', { name: 'Quán của tôi' })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  expect(screen.getByRole('link', { name: 'Quảng cáo' })).toHaveAttribute('data-active')
  expect(screen.getByRole('link', { name: 'Hồ sơ quán' })).not.toHaveAttribute('data-active')
})

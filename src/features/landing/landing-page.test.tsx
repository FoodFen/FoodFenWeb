import { setLanguage } from '@/lib/language'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { LandingPage } from './landing-page'

// jsdom has no IntersectionObserver; the nav highlight and the scroll reveals use it.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => vi.stubGlobal('IntersectionObserver', NoopObserver))
afterAll(() => vi.unstubAllGlobals())
afterEach(() => act(() => setLanguage('vi')))

async function renderLanding() {
  const root = createRootRoute({ component: LandingPage })
  const paths = ['/login', '/register', '/restaurant']
  const router = createRouter({
    routeTree: root.addChildren(
      paths.map((path) => createRoute({ getParentRoute: () => root, path })),
    ),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1 })
}

test('renders in Vietnamese by default', async () => {
  await renderLanding()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Chụp bữa ăn, biết ngay calo.',
  )
  expect(screen.getAllByRole('link', { name: 'Dùng thử miễn phí' }).length).toBeGreaterThan(0)
})

test('renders in English', async () => {
  await act(() => setLanguage('en'))
  await renderLanding()
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Snap a meal, know the calories.',
  )
  expect(screen.getAllByRole('link', { name: 'Try it free' }).length).toBeGreaterThan(0)
  expect(screen.queryByText('Dùng thử miễn phí')).not.toBeInTheDocument()
})

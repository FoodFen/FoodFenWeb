import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  type AnyValidator,
  type RouteComponent,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { render } from '@testing-library/react'

export type TestRoute = {
  /** Path under the pathless `_authed` layout, so ids match the real file routes (`getRouteApi`). */
  path: string
  component: RouteComponent
  validateSearch?: AnyValidator
  beforeLoad?: (ctx: { search: any }) => void
}

/**
 * Renders only the given routes (not the generated route tree, which imports every page) at `url`.
 * Returns the router so a test can assert on `router.state.location`.
 */
export async function renderRoutes(routes: TestRoute[], url: string) {
  const root = createRootRoute()
  const authed = createRoute({ getParentRoute: () => root, id: '_authed' })
  const router = createRouter({
    routeTree: root.addChildren([
      authed.addChildren(routes.map((r) => createRoute({ ...r, getParentRoute: () => authed }))),
    ]),
    history: createMemoryHistory({ initialEntries: [url] }),
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

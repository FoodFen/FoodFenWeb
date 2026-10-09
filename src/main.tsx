import { configureApi } from '@/api/client'
import { queryClient } from '@/api/query-client'
import { SessionSync } from '@/features/auth/session-sync'
import { useSessionStore } from '@/lib/session-store'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { routeTree } from './routeTree.gen'

configureApi()

const router = createRouter({ routeTree })

// When the session ends (sign-out, revoked refresh token), re-run route guards so protected pages redirect.
useSessionStore.subscribe((state, previous) => {
  if (previous.user && !state.user) router.invalidate()
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SessionSync />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)

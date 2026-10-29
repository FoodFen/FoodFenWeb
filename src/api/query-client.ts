import { toastError, toastSuccess } from '@/lib/mutation-toasts'
import { MutationCache, QueryClient } from '@tanstack/react-query'
import { shouldRetry } from './errors'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: shouldRetry, refetchOnWindowFocus: false } },
  mutationCache: new MutationCache({ onSuccess: toastSuccess, onError: toastError }),
})

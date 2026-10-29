import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'
import type { Mutation } from '@tanstack/react-query'
import type { ParseKeys } from 'i18next'
import { toast } from 'sonner'

type Ns = 'admin' | 'restaurant' | 'auth'
type ToastKey = { [N in Ns]: `${N}:toast.${ParseKeys<N, {}, 'toast'>}` }[Ns]

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** Translation key of the toast shown when the mutation succeeds. */
      success?: ToastKey
      /** `false` when the UI already shows the failure (inline form error), so no toast. */
      errorToast?: false
    }
  }
}

type Settled = Mutation<unknown, unknown, unknown, unknown>

/** MutationCache `onSuccess`: shows `meta.success` when set. */
export function toastSuccess(_data: unknown, _vars: unknown, _result: unknown, { meta }: Settled) {
  if (meta?.success) toast.success(i18n.t(meta.success))
}

/** MutationCache `onError`: shows the parsed API message unless `meta.errorToast` is false. */
export function toastError(error: unknown, _vars: unknown, _result: unknown, { meta }: Settled) {
  if (meta?.errorToast !== false) toast.error(parseApiError(error).message)
}

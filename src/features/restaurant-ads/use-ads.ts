import { parseApiError } from '@/api/errors'
import type { PaymentProvider } from '@/api/generated'
import {
  cancelPaymentPaymentsOrderCodeCancelPostMutation,
  createAdCheckoutRestaurantsMineAdsCheckoutPostMutation,
  getMyAdsRestaurantsMineAdsGetOptions,
  getMyAdsRestaurantsMineAdsGetQueryKey,
  getPaymentPaymentsOrderCodeGetOptions,
  getPaymentPaymentsOrderCodeGetQueryKey,
} from '@/api/generated/@tanstack/react-query.gen'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { clearOrderCode, readOrderCode, saveOrderCode } from './pending-order'

/** 404 means the user has no restaurant yet. */
export const useMyAds = () => useQuery(getMyAdsRestaurantsMineAdsGetOptions())

/** Creates the order, remembers its code, and sends the browser to the provider's page. */
export function useAdCheckout() {
  const { mutateAsync } = useMutation(createAdCheckoutRestaurantsMineAdsCheckoutPostMutation())
  return async (packageId: string, provider: PaymentProvider) => {
    const { orderCode, checkoutUrl } = await mutateAsync({ body: { packageId, provider } })
    saveOrderCode(orderCode)
    window.location.assign(checkoutUrl)
  }
}

/**
 * The order we sent the owner off to pay, polled while it is pending (the BE reconciles with the
 * provider on each read). Once it settles the stored code is dropped and the ads data refreshed.
 */
export function usePaymentOrder() {
  const queryClient = useQueryClient()
  const [orderCode, setOrderCode] = useState(readOrderCode)
  const path = { order_code: orderCode ?? 0 }

  const payment = useQuery({
    ...getPaymentPaymentsOrderCodeGetOptions({ path }),
    enabled: orderCode !== null,
    refetchInterval: (query) => (query.state.data?.status === 'pending' ? 3000 : false),
  })
  const cancel = useMutation({
    ...cancelPaymentPaymentsOrderCodeCancelPostMutation(),
    onSuccess: (data) =>
      queryClient.setQueryData(getPaymentPaymentsOrderCodeGetQueryKey({ path }), data),
  })

  const status = payment.data?.status
  const gone = parseApiError(payment.error).status === 404
  useEffect(() => {
    if (!gone && (!status || status === 'pending')) return
    clearOrderCode()
    if (status)
      void queryClient.invalidateQueries({ queryKey: getMyAdsRestaurantsMineAdsGetQueryKey() })
  }, [gone, status, queryClient])

  return {
    status: gone ? undefined : status,
    cancel: () => cancel.mutate({ path, body: {} }),
    cancelling: cancel.isPending,
    cancelError: cancel.error ? parseApiError(cancel.error).message : null,
    dismiss: () => setOrderCode(null),
  }
}

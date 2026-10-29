const KEY = 'foodfen-ad-order'

const toOrderCode = (value: string | null) => {
  const code = Number(value)
  return Number.isInteger(code) && code > 0 ? code : null
}

/** PayOS returns `?orderCode=1234`; MoMo returns `?orderId=FF1234` (prefix fixed in the BE). */
function readReturnUrlCode() {
  const params = new URLSearchParams(window.location.search)
  return (
    toOrderCode(params.get('orderCode')) ??
    toOrderCode(/^FF(\d+)$/.exec(params.get('orderId') ?? '')?.[1] ?? null)
  )
}

/**
 * The order being paid at PayOS/MoMo. It comes back on the provider's return URL to `/restaurant/ads`
 * (so it survives a different tab or browser) and is also kept in sessionStorage across the redirect.
 * A code from the URL is saved and the query string is stripped, so a reload does not bring the banner back.
 */
export function readOrderCode() {
  const fromUrl = readReturnUrlCode()
  if (fromUrl) {
    saveOrderCode(fromUrl)
    history.replaceState(history.state, '', window.location.pathname)
    return fromUrl
  }
  return toOrderCode(sessionStorage.getItem(KEY))
}

export const saveOrderCode = (orderCode: number) => sessionStorage.setItem(KEY, String(orderCode))

export const clearOrderCode = () => sessionStorage.removeItem(KEY)

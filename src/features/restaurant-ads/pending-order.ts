const KEY = 'foodfen-ad-order'

/** The order being paid at PayOS/MoMo, kept across the redirect away and back to `/restaurant/ads`. */
export function readOrderCode() {
  const code = Number(sessionStorage.getItem(KEY))
  return Number.isInteger(code) && code > 0 ? code : null
}

export const saveOrderCode = (orderCode: number) => sessionStorage.setItem(KEY, String(orderCode))

export const clearOrderCode = () => sessionStorage.removeItem(KEY)

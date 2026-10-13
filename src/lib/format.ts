import i18n from '@/i18n'

const locales: Record<string, string> = { vi: 'vi-VN', en: 'en-US' }

// One formatter per locale: building an Intl formatter is slow, switching language is rare.
const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>()

function formatter<T extends Intl.NumberFormat | Intl.DateTimeFormat>(
  id: string,
  create: (locale: string) => T,
): T {
  const locale = locales[i18n.language] ?? locales.vi
  const key = `${id}:${locale}`
  let found = cache.get(key)
  if (!found) cache.set(key, (found = create(locale)))
  return found as T
}

/** "99.000 ₫" in Vietnamese, "99,000 ₫" in English: Intl puts the symbol first in en-US, so the sign is appended by hand. */
export const formatVnd = (amount: number) =>
  `${formatter('vnd', (l) => new Intl.NumberFormat(l, { maximumFractionDigits: 0 })).format(amount)} ₫`

export const formatNumber = (value: number) =>
  formatter('number', (l) => new Intl.NumberFormat(l, { maximumFractionDigits: 1 })).format(value)

/** `2026-10-09` to `09/10` (`10/09` in English). The date has no time zone, so it is read as UTC. */
export const formatShortDate = (iso: string) =>
  formatter(
    'short-date',
    (l) => new Intl.DateTimeFormat(l, { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
  )
    .formatToParts(new Date(iso))
    .filter((part) => part.type === 'day' || part.type === 'month')
    .map((part) => part.value)
    .join('/')

export const formatDate = (iso: string) =>
  formatter(
    'date',
    (l) => new Intl.DateTimeFormat(l, { day: '2-digit', month: '2-digit', year: 'numeric' }),
  ).format(new Date(iso))

/** A calendar day without a time: read as UTC so the viewer's time zone cannot shift it. */
export const formatDay = (iso: string) =>
  formatter(
    'day',
    (l) =>
      new Intl.DateTimeFormat(l, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
      }),
  ).format(new Date(iso))

export const formatDateTime = (iso: string) =>
  formatter(
    'date-time',
    (l) => new Intl.DateTimeFormat(l, { dateStyle: 'short', timeStyle: 'short' }),
  ).format(new Date(iso))

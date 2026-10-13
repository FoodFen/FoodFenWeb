import { parsePhoneNumberFromString } from 'libphonenumber-js/min'

const DEFAULT_COUNTRY = 'VN'

function parse(text: string) {
  const phone = parsePhoneNumberFromString(text.trim(), DEFAULT_COUNTRY)
  return phone?.isValid() ? phone : null
}

export const isValidPhone = (text: string) => parse(text) !== null

/** Vietnamese numbers are stored nationally without spaces ("0901234567"), foreign ones as E.164. */
export function toStoredPhone(text: string) {
  const phone = parse(text)
  if (!phone) return text.trim()
  return phone.country === DEFAULT_COUNTRY
    ? phone.formatNational().replaceAll(' ', '')
    : phone.number
}

/** Human display ("0901 234 567"); text that is not a valid number is shown as stored. */
export function formatPhone(text: string) {
  const phone = parse(text)
  if (!phone) return text
  return phone.country === DEFAULT_COUNTRY ? phone.formatNational() : phone.formatInternational()
}

/** `tel:` target: digits and a leading plus only. */
export const phoneHref = (text: string) => `tel:${text.replace(/[^\d+]/g, '')}`

import viAds from '@/locales/vi/ads.json'
import viAdmin from '@/locales/vi/admin.json'
import viAuth from '@/locales/vi/auth.json'
import viCommon from '@/locales/vi/common.json'
import viErrors from '@/locales/vi/errors.json'
import viLanding from '@/locales/vi/landing.json'
import viNav from '@/locales/vi/nav.json'
import viRestaurant from '@/locales/vi/restaurant.json'
import viValidation from '@/locales/vi/validation.json'
import enAds from '@/locales/en/ads.json'
import enAdmin from '@/locales/en/admin.json'
import enAuth from '@/locales/en/auth.json'
import enCommon from '@/locales/en/common.json'
import enErrors from '@/locales/en/errors.json'
import enLanding from '@/locales/en/landing.json'
import enNav from '@/locales/en/nav.json'
import enRestaurant from '@/locales/en/restaurant.json'
import enValidation from '@/locales/en/validation.json'

// Adding a namespace: create both JSON files, import them here and nowhere else.
export const resources = {
  vi: {
    common: viCommon,
    nav: viNav,
    auth: viAuth,
    validation: viValidation,
    errors: viErrors,
    landing: viLanding,
    admin: viAdmin,
    ads: viAds,
    restaurant: viRestaurant,
  },
  en: {
    common: enCommon,
    nav: enNav,
    auth: enAuth,
    validation: enValidation,
    errors: enErrors,
    landing: enLanding,
    admin: enAdmin,
    ads: enAds,
    restaurant: enRestaurant,
  },
}

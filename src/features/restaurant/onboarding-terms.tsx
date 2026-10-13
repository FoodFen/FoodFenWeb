import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// This copy is a draft pending legal review. Do not treat it as final terms of service.
const TERMS = [
  'accuracy',
  'images',
  'dishReview',
  'profileEdits',
  'takedown',
  'oneRestaurant',
  'ads',
] as const

export function OnboardingTerms() {
  const { t } = useTranslation('restaurant')
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('onboarding.terms.title')}</h2>
      <ul className="bg-card space-y-3 rounded-2xl border p-6">
        {TERMS.map((id) => (
          <li key={id} className="flex gap-3 text-sm">
            <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{t(`onboarding.terms.items.${id}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

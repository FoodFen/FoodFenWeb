import { Eye, Gift, Megaphone, MapPin, Smartphone, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BENEFITS: {
  id: 'free' | 'reach' | 'directions' | 'ads' | 'impressions'
  icon: LucideIcon
}[] = [
  { id: 'free', icon: Gift },
  { id: 'reach', icon: Smartphone },
  { id: 'directions', icon: MapPin },
  { id: 'ads', icon: Megaphone },
  { id: 'impressions', icon: Eye },
]

export function OnboardingBenefits() {
  const { t } = useTranslation('restaurant')
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('onboarding.benefits.title')}</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {BENEFITS.map(({ id, icon: Icon }) => (
          <li key={id} className="bg-card flex gap-4 rounded-2xl border p-5">
            <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <h3 className="font-medium">{t(`onboarding.benefits.items.${id}.title`)}</h3>
              <p className="text-muted-foreground text-sm">
                {t(`onboarding.benefits.items.${id}.body`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

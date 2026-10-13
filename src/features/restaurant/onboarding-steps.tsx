import { useTranslation } from 'react-i18next'

const STEPS = ['profile', 'menu', 'review', 'live'] as const

export function OnboardingSteps() {
  const { t } = useTranslation('restaurant')
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{t('onboarding.steps.title')}</h2>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((id, index) => (
          <li key={id} className="bg-card space-y-3 rounded-2xl border p-5">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold tabular-nums">
              {index + 1}
            </span>
            <h3 className="font-medium">{t(`onboarding.steps.items.${id}.title`)}</h3>
            <p className="text-muted-foreground text-sm">
              {t(`onboarding.steps.items.${id}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

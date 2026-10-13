import { Button } from '@/components/ui/button'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OnboardingBenefits } from './onboarding-benefits'
import { OnboardingSteps } from './onboarding-steps'
import { OnboardingTerms } from './onboarding-terms'

/** Shown at /restaurant until the user has a restaurant; the form sits behind the terms. */
export function OnboardingIntro() {
  const { t } = useTranslation('restaurant')
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="max-w-3xl space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('onboarding.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('onboarding.pitch')}</p>
      </header>
      <OnboardingBenefits />
      <OnboardingSteps />
      <OnboardingTerms />
      <div className="space-y-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="accent-primary size-5"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          <span>{t('onboarding.accept')}</span>
        </label>
        <Button
          className="h-11 px-6 text-base"
          disabled={!accepted}
          onClick={() => void navigate({ to: '/restaurant/register', search: { accepted: true } })}
        >
          {t('onboarding.start')}
        </Button>
      </div>
    </div>
  )
}

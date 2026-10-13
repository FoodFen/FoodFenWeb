import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from './parts'
import { big, wrap } from './shared'

const perks = ['fiber', 'scans', 'coins'] as const

export function Premium() {
  const { t } = useTranslation('landing')
  return (
    <section className={`${wrap} py-8 md:py-16`}>
      <Reveal>
        <div className="bg-secondary grid gap-8 rounded-2xl p-8 md:grid-cols-2 md:items-center md:p-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {t('premium.title')}
            </h2>
            <Link
              to="/register"
              className={buttonVariants({
                className: `${big} bg-cta text-cta-foreground hover:bg-cta/90`,
              })}
            >
              {t('premium.cta')}
            </Link>
          </div>
          <ul className="space-y-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-lg">
                <Check className="text-primary mt-1 size-5 shrink-0" aria-hidden />
                {t(`premium.perks.${perk}`)}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}

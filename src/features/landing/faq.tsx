import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { wrap } from './shared'

const faqIds = ['free', 'accuracy', 'privacy', 'mobile'] as const

export function Faq() {
  const { t } = useTranslation('landing')
  return (
    <section id="hoi-dap" className={`${wrap} space-y-6 py-16 md:py-24`}>
      <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
        {t('faq.title')}
      </h2>
      <div className="bg-card max-w-2xl divide-y rounded-2xl border">
        {faqIds.map((id) => (
          <details key={id} className="group px-5 py-2">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {t(`faq.items.${id}.q`)}
              <ChevronDown
                className="text-muted-foreground size-5 shrink-0 transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="text-muted-foreground pb-3">{t(`faq.items.${id}.a`)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

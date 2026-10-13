import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const rules = ['eligibility', 'relevance', 'limit', 'extension', 'refund'] as const

export function AdsExplainer() {
  const { t } = useTranslation('ads')
  return (
    <section className="bg-muted/50 space-y-2 rounded-2xl p-4 text-sm">
      <h2 className="flex items-center gap-2 font-medium">
        <Info className="size-4" aria-hidden />
        {t('explainer.title')}
      </h2>
      <ul className="text-muted-foreground list-disc space-y-1 pl-5">
        {rules.map((rule) => (
          <li key={rule}>{t(`explainer.rules.${rule}`)}</li>
        ))}
      </ul>
    </section>
  )
}

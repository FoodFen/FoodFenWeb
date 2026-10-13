import { LANGUAGES, setLanguage, type Language } from '@/lib/language'
import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation()
  const current = i18n.language as Language
  const next = LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length]

  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={t('language.change')}
      className={`hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors outline-none focus-visible:ring-3 ${className}`}
    >
      <Languages className="size-5" aria-hidden />
      {current.toUpperCase()}
    </button>
  )
}

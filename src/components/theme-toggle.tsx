import { setTheme, useIsDark } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const dark = useIsDark()
  const Icon = dark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? t('theme.light') : t('theme.dark')}
      className={`hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-3 ${className}`}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  )
}

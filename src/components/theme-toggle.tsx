import { setTheme, useIsDark } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({
  className = '',
  showLabel = false,
}: {
  className?: string
  showLabel?: boolean
}) {
  const dark = useIsDark()
  const Icon = dark ? Sun : Moon
  const label = dark ? 'Chế độ sáng' : 'Chế độ tối'

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={showLabel ? undefined : label}
      className={`hover:bg-accent hover:text-accent-foreground flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg transition-colors ${className}`}
    >
      <Icon className="size-5" aria-hidden />
      {showLabel && label}
    </button>
  )
}

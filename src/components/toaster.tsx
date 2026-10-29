import { useIsDark } from '@/lib/theme'
import type { CSSProperties } from 'react'
import { Toaster as Sonner } from 'sonner'

// Sonner reads these variables for the neutral toast; success and error keep their rich colours.
const style = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius-2xl)',
} as CSSProperties

export function Toaster() {
  return (
    <Sonner
      theme={useIsDark() ? 'dark' : 'light'}
      position="top-right"
      richColors
      closeButton
      style={style}
    />
  )
}

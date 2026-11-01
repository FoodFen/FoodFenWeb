import '@testing-library/jest-dom/vitest'
import '@/i18n'
import { configure } from '@testing-library/react'

// The 1 s default flakes for `findBy*` on lazy chunks (the map picker) when the workers compete for CPU.
configure({ asyncUtilTimeout: 5000 })

// jsdom has no matchMedia; the theme module and the sidebar's mobile check both call it.
window.matchMedia ??= (query: string) =>
  ({
    media: query,
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList

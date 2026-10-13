import '@testing-library/jest-dom/vitest'
import '@/i18n'
import { configure } from '@testing-library/react'

// `findBy*` waits for lazy route chunks to load; the 1 s default flakes on a loaded machine.
configure({ asyncUtilTimeout: 5000 })

// jsdom has no matchMedia; the theme module and the sidebar's mobile check both call it.
window.matchMedia ??= (query: string) =>
  ({
    media: query,
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList

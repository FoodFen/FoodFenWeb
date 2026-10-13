import '@testing-library/jest-dom/vitest'

// jsdom has no matchMedia; the theme module and the sidebar's mobile check both call it.
window.matchMedia ??= (query: string) =>
  ({
    media: query,
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }) as unknown as MediaQueryList

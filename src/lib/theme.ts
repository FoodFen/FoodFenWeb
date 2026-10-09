import { useSyncExternalStore } from 'react'

// The choice is stored only after the user toggles; until then the OS preference decides.
// index.html runs the same check before first paint so the page never flashes the wrong theme.
const key = 'foodfen-theme'
const media = '(prefers-color-scheme: dark)'
const listeners = new Set<() => void>()

function stored() {
  try {
    const value = localStorage.getItem(key)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

function sync() {
  const dark = (stored() ?? (matchMedia(media).matches ? 'dark' : 'light')) === 'dark'
  document.documentElement.classList.toggle('dark', dark)
  listeners.forEach((notify) => notify())
}

matchMedia(media).addEventListener('change', sync)

export function setTheme(theme: 'light' | 'dark') {
  try {
    localStorage.setItem(key, theme)
  } catch {
    // Storage can be blocked; the theme still applies for this visit.
  }
  sync()
}

const subscribe = (notify: () => void) => {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export function useIsDark() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  )
}

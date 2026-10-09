import { useReducedMotion, useTransform, type MotionValue } from 'motion/react'
import { useSyncExternalStore } from 'react'

export const wrap = 'mx-auto w-full max-w-6xl px-4 md:px-8'
export const big = 'h-11 px-5 text-base'

// Maps scroll progress (0..1) to a pixel offset; flat when the user prefers reduced motion.
export function useShift(progress: MotionValue<number>, from: number, to: number) {
  const reduce = useReducedMotion()
  return useTransform(progress, [0, 1], reduce ? [0, 0] : [from, to])
}

const query = '(min-width: 768px)'
export function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

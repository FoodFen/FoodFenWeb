import type { MascotState } from '@/api/generated'

// A Record forces every generated state to be listed; the keys keep the order shown in the UI.
const STATES: Record<MascotState, true> = {
  idle: true,
  hungry: true,
  thirsty: true,
  eating: true,
  drinking: true,
  exercising: true,
  thinking: true,
  happy: true,
  confused: true,
}

export const MASCOT_STATES = Object.keys(STATES) as MascotState[]

/** Mascots the mobile app draws itself, so they may be active without an uploaded idle image. */
export const HAND_DRAWN_IDS = ['default', 'sprout', 'berry', 'chili']

/** The circle behind the art when no color is chosen: the app's theme green, per theme. */
export const BODY_COLOR_DEFAULT = { light: '#15803D', dark: '#4ADE80' } as const

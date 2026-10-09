type Macros = { proteinG: number; carbsG: number; fatG: number }

/** Atwater factors: 4 kcal per gram of protein and carbs, 9 per gram of fat. */
export function estimateKcal({ proteinG, carbsG, fatG }: Macros) {
  return 4 * proteinG + 4 * carbsG + 9 * fatG
}

// ponytail: flat 20% (min 30 kcal) tolerance; fiber and alcohol are ignored. Tune if reviewers see noise.
export function kcalLooksOff(kcal: number, macros: Macros) {
  const estimate = estimateKcal(macros)
  return Math.abs(kcal - estimate) > Math.max(30, estimate * 0.2)
}

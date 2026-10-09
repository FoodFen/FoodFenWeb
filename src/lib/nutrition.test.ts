import { estimateKcal, kcalLooksOff } from './nutrition'

const pho = { proteinG: 25, carbsG: 60, fatG: 10 }

test('estimates kcal as 4P + 4C + 9F', () => {
  expect(estimateKcal(pho)).toBe(430)
})

test('accepts a figure close to the estimate', () => {
  expect(kcalLooksOff(450, pho)).toBe(false)
})

test('flags a figure far from the estimate', () => {
  expect(kcalLooksOff(900, pho)).toBe(true)
  expect(kcalLooksOff(100, pho)).toBe(true)
})

test('uses a 30 kcal floor for tiny dishes', () => {
  const tea = { proteinG: 0, carbsG: 1, fatG: 0 }
  expect(kcalLooksOff(25, tea)).toBe(false)
  expect(kcalLooksOff(40, tea)).toBe(true)
})

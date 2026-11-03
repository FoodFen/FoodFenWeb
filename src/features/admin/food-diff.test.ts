import type { FoodSnapshot } from '@/api/generated'
import { diffFood } from './food-diff'

const snapshot = (patch: Partial<FoodSnapshot> = {}): FoodSnapshot => ({
  name: 'Phở',
  nameEn: null,
  aliases: [],
  category: 'mon-nuoc',
  kcal: 100,
  carbsG: 10,
  proteinG: 5,
  fatG: 2,
  fiberG: null,
  servings: [{ label: '1 tô', grams: 400, default: true }],
  sourceKind: 'nin',
  sourceRef: null,
  archived: false,
  ...patch,
})

test('lists only the fields that changed', () => {
  expect(diffFood(snapshot(), snapshot({ kcal: 120, carbsG: 12 }))).toEqual([
    { field: 'kcal', before: 100, after: 120 },
    { field: 'carbsG', before: 10, after: 12 },
  ])
})

test('lists and servings compare by content', () => {
  expect(diffFood(snapshot({ aliases: ['a'] }), snapshot({ aliases: ['a'] }))).toEqual([])
  expect(
    diffFood(snapshot(), snapshot({ servings: [{ label: '1 tô', grams: 450, default: true }] })),
  ).toHaveLength(1)
})

test('a missing before snapshot diffs every non-empty field against nothing', () => {
  expect(diffFood(null, snapshot({ nameEn: 'Pho' })).map(({ field }) => field)).toContain('nameEn')
  expect(diffFood(null, snapshot()).find(({ field }) => field === 'fiberG')).toBeUndefined()
})

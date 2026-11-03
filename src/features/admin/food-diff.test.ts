import { diffFood, isFoodField } from './food-diff'

test('lists only the fields that changed', () => {
  expect(diffFood({ kcal: 100, name: 'Phở' }, { kcal: 120, name: 'Phở' })).toEqual([
    { field: 'kcal', before: 100, after: 120 },
  ])
})

test('snake_case and camelCase keys name the same field', () => {
  expect(diffFood({ carbs_g: 10, name_en: null }, { carbsG: 12, nameEn: null })).toEqual([
    { field: 'carbsG', before: 10, after: 12 },
  ])
  expect(diffFood({ source_kind: 'nin' }, { source_kind: 'team' })).toEqual([
    { field: 'sourceKind', before: 'nin', after: 'team' },
  ])
})

test('a field missing on one side counts as null, and nested values compare by content', () => {
  expect(diffFood({ fiberG: null }, { fiberG: 2 })).toEqual([
    { field: 'fiberG', before: null, after: 2 },
  ])
  expect(diffFood({}, { nameEn: 'Pho' })).toEqual([{ field: 'nameEn', before: null, after: 'Pho' }])
  expect(diffFood({ aliases: ['a'] }, { aliases: ['a'] })).toEqual([])
  expect(
    diffFood({ servings: [{ label: 'a', grams: 1 }] }, { servings: [{ label: 'a', grams: 2 }] }),
  ).toHaveLength(1)
})

test('a missing before snapshot diffs against nothing, and unknown keys keep their raw name', () => {
  expect(diffFood(null, { mystery: 1 })).toEqual([{ field: 'mystery', before: null, after: 1 }])
  expect(isFoodField('kcal')).toBe(true)
  expect(isFoodField('mystery')).toBe(false)
  expect(isFoodField('carbs_g')).toBe(false)
})

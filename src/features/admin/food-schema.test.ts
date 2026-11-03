import { foodSchema, newFoodValues, toFoodBody, toFoodPatch, type FoodValues } from './food-schema'

const valid: FoodValues = {
  ...newFoodValues({ name: 'Phở bò' }),
  kcal: '350',
  carbsG: '12,5',
  proteinG: '8',
  fatG: '4',
}
const parse = (values: Partial<FoodValues>) => foodSchema.safeParse({ ...valid, ...values })
const message = (values: Partial<FoodValues>) => {
  const result = parse(values)
  return result.success ? null : result.error.issues[0].message
}

test('an empty fiber is not tracked (null) and a typed 0 stays 0', () => {
  expect(toFoodBody({ ...valid, fiberG: '' }).fiberG).toBeNull()
  expect(toFoodBody({ ...valid, fiberG: '0' }).fiberG).toBe(0)
  expect(toFoodBody({ ...valid, fiberG: '1,5' }).fiberG).toBe(1.5)
})

test('an empty English name becomes null and decimals accept a comma', () => {
  const body = toFoodBody(valid)
  expect(body.nameEn).toBeNull()
  expect(body.carbsG).toBe(12.5)
})

test('carbs, protein and fat may not add up to more than 100 g', () => {
  expect(parse({ carbsG: '60', proteinG: '30', fatG: '10' }).success).toBe(true)
  expect(message({ carbsG: '60', proteinG: '30', fatG: '11' })).toBe(
    'admin:foods.validation.macroSum',
  )
  expect(message({ carbsG: '101' })).toBe('admin:foods.validation.macroRange')
})

test('kcal is a whole number from 0 to 900', () => {
  expect(parse({ kcal: '0' }).success).toBe(true)
  expect(parse({ kcal: '900' }).success).toBe(true)
  expect(parse({ kcal: '901' }).success).toBe(false)
  expect(parse({ kcal: '12.5' }).success).toBe(false)
  expect(parse({ kcal: '' }).success).toBe(false)
})

test('servings need exactly one default and 1 to 10 rows of positive grams', () => {
  const row = { label: '1 bát', grams: '250', default: false }
  expect(
    message({
      servings: [
        { ...row, default: true },
        { ...row, default: true },
      ],
    }),
  ).toBe('admin:foods.validation.servingDefault')
  expect(message({ servings: [row] })).toBe('admin:foods.validation.servingDefault')
  expect(message({ servings: [] })).toBe('admin:foods.validation.servingsCount')
  expect(message({ servings: [{ ...row, default: true, grams: '0' }] })).toBe(
    'admin:foods.validation.servingGrams',
  )
  expect(message({ servings: [{ ...row, default: true, grams: '5001' }] })).toBe(
    'admin:foods.validation.servingGrams',
  )
  const eleven = Array.from({ length: 11 }, (_, i) => ({ ...row, default: i === 0 }))
  expect(message({ servings: eleven })).toBe('admin:foods.validation.servingsCount')
})

test('aliases: at most 20, each 1 to 80 characters', () => {
  expect(parse({ aliases: Array.from({ length: 20 }, (_, i) => `a${i}`) }).success).toBe(true)
  expect(message({ aliases: Array.from({ length: 21 }, (_, i) => `a${i}`) })).toBe(
    'admin:foods.validation.aliasesMax',
  )
  expect(message({ aliases: ['x'.repeat(81)] })).toBe('admin:foods.validation.aliasLength')
  expect(message({ aliases: [' '] })).toBe('admin:foods.validation.aliasLength')
})

test('name is 1 to 120 characters', () => {
  expect(parse({ name: ' ' }).success).toBe(false)
  expect(parse({ name: 'x'.repeat(121) }).success).toBe(false)
  expect(parse({ nameEn: 'x'.repeat(121) }).success).toBe(false)
})

test('the PATCH body holds only the fields that changed', () => {
  expect(toFoodPatch(valid, valid)).toEqual({})
  expect(toFoodPatch({ ...valid, kcal: '360', aliases: ['pho'] }, valid)).toEqual({
    kcal: 360,
    aliases: ['pho'],
  })
  expect(toFoodPatch({ ...valid, fiberG: '0' }, valid)).toEqual({ fiberG: 0 })
  expect(toFoodPatch({ ...valid, nameEn: '' }, { ...valid, nameEn: 'Pho' })).toEqual({
    nameEn: null,
  })
})

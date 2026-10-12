import {
  adPackageSchema,
  emptyAdPackage,
  toAdPackageBody,
  toAdPackagePatch,
} from './ad-package-schema'

const valid = { days: '7', priceVnd: '99.000', active: true }
const parse = (values: Partial<typeof valid>) => adPackageSchema.safeParse({ ...valid, ...values })

test('a price with thousands dots or spaces maps to whole dong', () => {
  expect(parse({}).success).toBe(true)
  expect(toAdPackageBody(valid)).toEqual({ days: 7, priceVnd: 99000, active: true })
  expect(toAdPackageBody({ ...valid, priceVnd: '99 000' }).priceVnd).toBe(99000)
  expect(toAdPackageBody({ ...valid, priceVnd: '99000' }).priceVnd).toBe(99000)
})

test('days must be a positive whole number', () => {
  for (const days of ['', '0', '-3', '1.5', '1,5', 'abc']) {
    expect(parse({ days }).success).toBe(false)
  }
})

test('price must be positive', () => {
  for (const priceVnd of ['', '0', '-1000', '1,5', 'abc']) {
    expect(parse({ priceVnd }).success).toBe(false)
  }
  expect(adPackageSchema.safeParse(emptyAdPackage).success).toBe(false)
})

test('the patch carries only the changed fields', () => {
  expect(toAdPackagePatch({ ...valid, active: false }, { active: true })).toEqual({ active: false })
})

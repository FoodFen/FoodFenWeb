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

test('the price also reads an English thousands comma', () => {
  expect(toAdPackageBody({ ...valid, priceVnd: '99,000' }).priceVnd).toBe(99000)
})

test('days must be a whole number from 1 to 3650', () => {
  for (const days of ['', '0', '-3', '1.5', '1,5', 'abc', '3651']) {
    expect(parse({ days }).success).toBe(false)
  }
  expect(parse({ days: '3650' }).success).toBe(true)
})

test('price must be a whole number from 1 to 999 999 999 999', () => {
  for (const priceVnd of ['', '0', '-1000', '1,5', 'abc', '1.000.000.000.000']) {
    expect(parse({ priceVnd }).success).toBe(false)
  }
  expect(parse({ priceVnd: '999.999.999.999' }).success).toBe(true)
  expect(adPackageSchema.safeParse(emptyAdPackage).success).toBe(false)
})

test('the patch carries only the changed fields', () => {
  expect(toAdPackagePatch({ ...valid, active: false }, { active: true })).toEqual({ active: false })
})

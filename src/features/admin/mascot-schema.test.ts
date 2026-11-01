import type { AdminMascotResponse } from '@/api/generated'
import {
  activeLock,
  mascotSchema,
  slugify,
  toMascotBody,
  toMascotPatch,
  type MascotValues,
} from './mascot-schema'

const valid: MascotValues = {
  id: 'tomato',
  name: ' Cà chua ',
  coinCost: '1.500',
  images: {},
  bodyColor: null,
}
const parse = (values: Partial<MascotValues>) => mascotSchema.safeParse({ ...valid, ...values })

test('slugify drops diacritics and punctuation', () => {
  expect(slugify('Cà Chua Đỏ!')).toBe('ca-chua-do')
  expect(slugify('  --Fen  2--')).toBe('fen-2')
  expect(slugify('a'.repeat(40))).toHaveLength(32)
})

test('the id is a slug of at most 32 characters', () => {
  expect(parse({}).success).toBe(true)
  for (const id of ['', 'Tomato', 'to mato', 'cà', 'a'.repeat(33)]) {
    expect(parse({ id }).success).toBe(false)
  }
})

test('the name is trimmed and 1 to 40 characters', () => {
  expect(parse({ name: '   ' }).success).toBe(false)
  expect(parse({ name: 'x'.repeat(41) }).success).toBe(false)
  expect(parse({ name: 'x'.repeat(40) }).success).toBe(true)
})

test('the price is a whole number from 0 to 1 000 000', () => {
  for (const coinCost of ['', '-1', '1,5', 'abc', '1.000.001']) {
    expect(parse({ coinCost }).success).toBe(false)
  }
  for (const coinCost of ['0', '1.000.000']) expect(parse({ coinCost }).success).toBe(true)
})

test('the create body is a draft with the trimmed name and a whole price', () => {
  expect(toMascotBody({ ...valid, images: { idle: 'u' } })).toEqual({
    id: 'tomato',
    name: 'Cà chua',
    coinCost: 1500,
    active: false,
    images: { idle: 'u' },
    bodyColor: null,
  })
  expect(toMascotBody({ ...valid, bodyColor: '#FF0000' }).bodyColor).toBe('#FF0000')
})

test('the body color is a #RRGGBB code or null', () => {
  for (const bodyColor of ['#15803d', '#15803D', null]) {
    expect(parse({ bodyColor }).success).toBe(true)
  }
  for (const bodyColor of ['15803D', '#1580', '#GGGGGG', '']) {
    expect(parse({ bodyColor }).success).toBe(false)
  }
})

test('the patch carries the body color only when dirty, null included', () => {
  const colored = { ...valid, bodyColor: '#FF0000' }
  expect(toMascotPatch(colored, { bodyColor: true }, {})).toEqual({ bodyColor: '#FF0000' })
  expect(toMascotPatch(valid, { bodyColor: true }, {})).toEqual({ bodyColor: null })
  expect(toMascotPatch(colored, {}, {})).toEqual({})
})

test('the patch carries only dirty fields and an image diff', () => {
  const values: MascotValues = { ...valid, images: { idle: 'new-idle', happy: 'same' } }
  const original = { idle: 'old-idle', happy: 'same', thirsty: 'gone' }
  expect(toMascotPatch(values, { name: true }, original)).toEqual({
    name: 'Cà chua',
    images: { idle: 'new-idle', thirsty: null },
  })
  expect(toMascotPatch({ ...valid, images: original }, { coinCost: true }, original)).toEqual({
    coinCost: 1500,
  })
})

const mascot = (patch: Partial<AdminMascotResponse>): AdminMascotResponse => ({
  id: 'x',
  name: 'X',
  coinCost: 0,
  active: false,
  images: {},
  bodyColor: null,
  ownerCount: 0,
  equippedCount: 0,
  ...patch,
})

test('a mascot cannot be shown without an idle image unless the app draws it', () => {
  expect(activeLock(mascot({}))).toBe('noIdle')
  expect(activeLock(mascot({ images: { idle: 'u' } }))).toBeNull()
  expect(activeLock(mascot({ id: 'sprout' }))).toBeNull()
  expect(activeLock(mascot({ active: true }))).toBeNull()
  expect(activeLock(mascot({ id: 'default', active: true }))).toBe('default')
})

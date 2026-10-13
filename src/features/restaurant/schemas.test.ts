import type { DishResponse, RestaurantResponse } from '@/api/generated'
import {
  dishSchema,
  emptyDish,
  toDishBody,
  toDishPatch,
  toDishValues,
  type DishValues,
} from './dish-schema'
import {
  emptyRestaurant,
  restaurantSchema,
  toRestaurantBody,
  toRestaurantPatch,
  toRestaurantValues,
} from './restaurant-schema'

const dish: DishValues = {
  ...emptyDish,
  name: 'Phở bò',
  price: '65000',
  servingG: '450',
  kcal: '430',
  proteinG: '25,5',
  carbsG: '60',
  fatG: '10',
  dietTag: 'vegan',
}

test('a complete dish passes and maps to numbers, with the comma read as a decimal point', () => {
  expect(dishSchema.safeParse(dish).success).toBe(true)
  expect(toDishBody(dish)).toMatchObject({
    price: 65000,
    proteinG: 25.5,
    description: null,
    imageUrl: null,
    fiberG: null,
  })
})

test('fiber is optional but must be valid when filled', () => {
  expect(dishSchema.safeParse({ ...dish, fiberG: '3' }).success).toBe(true)
  expect(dishSchema.safeParse({ ...dish, fiberG: 'abc' }).success).toBe(false)
})

test('whole-number fields read thousands groups, decimals keep the comma', () => {
  const grouped = { ...dish, price: '65.000', kcal: '1,250' }
  expect(dishSchema.safeParse(grouped).success).toBe(true)
  expect(toDishBody(grouped)).toMatchObject({ price: 65000, kcal: 1250, proteinG: 25.5 })
})

test('a bad fiber value reports the fiber message, not a generic one', () => {
  const result = dishSchema.safeParse({ ...dish, fiberG: 'abc' })
  expect(result.error?.issues[0]?.message).toBe('restaurant:validation.fiberRange')
})

test('rejects empty, non-numeric and out-of-bound numbers', () => {
  for (const patch of [
    { price: '' },
    { price: '12.5' },
    { servingG: '0' },
    { kcal: '20001' },
    { fatG: '-1' },
    { proteinG: 'abc' },
  ]) {
    expect(dishSchema.safeParse({ ...dish, ...patch }).success).toBe(false)
  }
})

const restaurant = {
  ...emptyRestaurant,
  name: 'Bếp Nhà',
  address: '12 Nguyễn Huệ, Quận 1',
  phone: '0901234567',
  hours: [{ open: '07:00', close: '21:00' }],
  location: '10.7769, 106.7009',
}

test('a complete restaurant passes and the pasted location becomes latitude and longitude', () => {
  expect(restaurantSchema.safeParse(restaurant).success).toBe(true)
  expect(toRestaurantBody(restaurant)).toMatchObject({
    latitude: 10.7769,
    longitude: 106.7009,
    description: null,
  })
  expect(toRestaurantBody(restaurant)).not.toHaveProperty('location')
})

test('the phone is checked and stored in its canonical shape', () => {
  expect(
    restaurantSchema.safeParse({ ...restaurant, phone: '123' }).error?.issues[0]?.message,
  ).toBe('restaurant:validation.phoneInvalid')
  expect(toRestaurantBody({ ...restaurant, phone: '+84 901 234 567' }).phone).toBe('0901234567')
})

test('the body carries the shifts as the stored text', () => {
  expect(toRestaurantBody(restaurant).openingHours).toBe('07:00-21:00')
})

const shifts = (...list: [string, string][]) => list.map(([open, close]) => ({ open, close }))
const hoursIssues = (hours: ReturnType<typeof shifts>) =>
  restaurantSchema
    .safeParse({ ...restaurant, hours })
    .error?.issues.map((issue) => [issue.path.join('.'), issue.message])

test('shifts need both times, differing, and may not overlap', () => {
  expect(hoursIssues(shifts(['07:00', '10:30'], ['16:00', '21:00']))).toBeUndefined()
  expect(hoursIssues(shifts(['', '10:00']))).toEqual([
    ['hours.0.open', 'restaurant:validation.hoursOpenRequired'],
  ])
  expect(hoursIssues(shifts(['07:00', '07:00']))).toEqual([
    ['hours.0.close', 'restaurant:validation.hoursSame'],
  ])
  expect(hoursIssues(shifts(['07:00', '12:00'], ['11:00', '14:00']))).toEqual([
    ['hours.1.open', 'restaurant:validation.hoursOverlap'],
  ])
})

test('a shift may close after midnight', () => {
  expect(hoursIssues(shifts(['18:00', '02:00']))).toBeUndefined()
})

test('at most three shifts', () => {
  const four = shifts(
    ['01:00', '02:00'],
    ['03:00', '04:00'],
    ['05:00', '06:00'],
    ['07:00', '08:00'],
  )
  expect(hoursIssues(four)).toBeDefined()
})

test('saved hours the picker can read become shifts, others are kept as legacy text', () => {
  const saved = { ...restaurant, id: 'x', status: 'approved', latitude: 1, longitude: 2 }
  const readable = toRestaurantValues({ ...saved, openingHours: '7h-21h' } as never)
  expect(readable).toMatchObject({ hours: shifts(['07:00', '21:00']), legacyHours: '' })
  const legacy = toRestaurantValues({ ...saved, openingHours: 'Cả ngày trừ Chủ nhật' } as never)
  expect(legacy).toMatchObject({ hours: [], legacyHours: 'Cả ngày trừ Chủ nhật' })
  expect(restaurantSchema.safeParse(legacy).success).toBe(true)
})

test('an update leaves unreadable saved hours alone and sends picked ones', () => {
  const legacy = { ...restaurant, hours: [], legacyHours: 'Cả ngày' }
  expect(toRestaurantPatch(legacy)).not.toHaveProperty('openingHours')
  expect(toRestaurantPatch(restaurant)).toHaveProperty('openingHours', '07:00-21:00')
  expect(toRestaurantPatch(legacy)).not.toHaveProperty('legacyHours')
})

test('rejects a location that is not a coordinate pair', () => {
  expect(restaurantSchema.safeParse({ ...restaurant, location: 'Quận 1' }).success).toBe(false)
})

test('editing round-trips: values built from a saved restaurant map back to the same body', () => {
  const saved = {
    ...restaurant,
    location: '10.7769, 106.7009',
  }
  const body = toRestaurantBody(saved)
  expect(
    toRestaurantValues({ ...body, id: 'x', status: 'approved' } as unknown as RestaurantResponse),
  ).toMatchObject({ location: '10.7769, 106.7009', name: 'Bếp Nhà', description: '' })
})

test('a dish patch carries only the edited fields', () => {
  const edited = { ...dish, kcal: '500', description: '' }
  expect(toDishPatch(edited, { kcal: true })).toEqual({ kcal: 500 })
  expect(toDishPatch(edited, { description: true, fiberG: true })).toEqual({
    description: null,
    fiberG: null,
  })
})

test('diet tag defaults to none, rejects unknown values and passes through to the body', () => {
  expect(emptyDish.dietTag).toBe('none')
  expect(dishSchema.safeParse({ ...dish, dietTag: 'keto' }).success).toBe(false)
  expect(toDishBody(dish).dietTag).toBe('vegan')
})

test('editing a saved dish reads its diet tag back', () => {
  const saved = { ...toDishBody(dish), id: 'x', status: 'approved' } as unknown as DishResponse
  expect(toDishValues(saved).dietTag).toBe('vegan')
})

test('a dish patch includes the diet tag only when it is dirty', () => {
  expect(toDishPatch(dish, { dietTag: true })).toEqual({ dietTag: 'vegan' })
  expect(toDishPatch(dish, { kcal: true })).not.toHaveProperty('dietTag')
})

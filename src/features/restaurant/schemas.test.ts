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
  openingHours: '7:00 - 21:00',
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

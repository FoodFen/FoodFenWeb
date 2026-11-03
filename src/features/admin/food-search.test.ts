import { foodSearchSchema } from './food-search'

test('invalid search params are dropped instead of failing the route', () => {
  expect(
    foodSearchSchema.parse({ tab: 'nope', category: 'x', verified: 'maybe', status: 1 }),
  ).toEqual({})
})

test('valid params pass through', () => {
  const search = { tab: 'misses', status: 'ignored', verified: true, food: 'pho-bo' }
  expect(foodSearchSchema.parse(search)).toEqual(search)
})

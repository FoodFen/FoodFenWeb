import type { AdImpressionResponse, DishResponse, MyAdPaymentResponse } from '@/api/generated'
import { adSpend, summarizeMenu, sumLastDays } from './stats'

const days = (counts: number[]): AdImpressionResponse[] =>
  counts.map((count, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, count }))

test('impressions are summed over the latest days only, gaps included', () => {
  const impressions = days([...Array<number>(25).fill(1), 0, 0, 5, 0, 10])
  expect(sumLastDays(impressions, 7)).toBe(17)
  expect(sumLastDays(impressions, 30)).toBe(40)
})

test('impressions of a shorter history sum what exists', () => {
  expect(sumLastDays(days([2, 3]), 7)).toBe(5)
  expect(sumLastDays([], 7)).toBe(0)
})

const payment = (status: MyAdPaymentResponse['status'], amount: number): MyAdPaymentResponse => ({
  orderCode: amount,
  amount,
  status,
  provider: 'payos',
  adDays: 7,
  createdAt: '2026-10-09T03:00:00Z',
  paidAt: null,
})

test('ad spend counts paid payments only', () => {
  const payments = [
    payment('paid', 50000),
    payment('paid', 20000),
    payment('pending', 99000),
    payment('cancelled', 1000),
    payment('expired', 2000),
    payment('failed', 3000),
  ]
  expect(adSpend(payments)).toBe(70000)
  expect(adSpend([])).toBe(0)
})

const dish = (overrides: Partial<DishResponse>): DishResponse => ({
  id: 'd',
  restaurantId: 'r1',
  name: 'Món',
  description: null,
  imageUrl: null,
  price: 40000,
  servingG: 300,
  kcal: 320,
  proteinG: 22,
  carbsG: 44,
  fatG: 6,
  fiberG: null,
  dietTag: 'none',
  status: 'approved',
  rejectionReason: null,
  createdAt: '2026-10-10T09:20:46Z',
  updatedAt: '2026-10-10T09:20:46Z',
  reviewedAt: null,
  ...overrides,
})

test('menu summary has ranges, averages, counts per status and diet, and flagged dishes', () => {
  const summary = summarizeMenu([
    dish({}),
    dish({ kcal: 500, proteinG: 30, carbsG: 50, fatG: 20, price: 60000, dietTag: 'vegan' }),
    dish({ kcal: 900, price: 20000, status: 'pending', dietTag: 'vegetarian' }),
    dish({ status: 'rejected' }),
  ])
  expect(summary.count).toBe(4)
  expect(summary.byStatus).toEqual({ approved: 2, pending: 1, rejected: 1 })
  expect(summary.byDiet).toEqual({ none: 2, vegetarian: 1, vegan: 1 })
  expect(summary.kcal).toEqual({ min: 320, max: 900 })
  expect(summary.price).toEqual({ min: 20000, max: 60000 })
  expect(summary.avgKcal).toBe((320 + 500 + 900 + 320) / 4)
  expect(summary.flagged).toBe(1)
})

test('an empty menu summarises to zeros', () => {
  expect(summarizeMenu([])).toEqual({
    count: 0,
    byStatus: { approved: 0, pending: 0, rejected: 0 },
    byDiet: { none: 0, vegetarian: 0, vegan: 0 },
    flagged: 0,
    avgKcal: 0,
    kcal: { min: 0, max: 0 },
    price: { min: 0, max: 0 },
  })
})

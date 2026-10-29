import type { AdImpressionResponse, DishResponse, MyAdPaymentResponse } from '@/api/generated'
import { kcalLooksOff } from '@/lib/nutrition'

/** The BE sends every one of the last 30 days, oldest first, zero-filled: the tail is the latest days. */
export const sumLastDays = (impressions: AdImpressionResponse[], days: number) =>
  impressions.slice(-days).reduce((sum, day) => sum + day.count, 0)

/** Only money that actually came in: pending, cancelled, expired and failed orders cost nothing. */
export const adSpend = (payments: MyAdPaymentResponse[]) =>
  payments.reduce((sum, payment) => sum + (payment.status === 'paid' ? payment.amount : 0), 0)

const range = (values: number[]) =>
  values.length ? { min: Math.min(...values), max: Math.max(...values) } : { min: 0, max: 0 }

export function summarizeMenu(dishes: DishResponse[]) {
  const byStatus = { approved: 0, pending: 0, rejected: 0 }
  const byDiet = { none: 0, vegetarian: 0, vegan: 0 }
  for (const dish of dishes) {
    byStatus[dish.status] += 1
    byDiet[dish.dietTag] += 1
  }
  const kcals = dishes.map((dish) => dish.kcal)
  return {
    count: dishes.length,
    byStatus,
    byDiet,
    flagged: dishes.filter((dish) => kcalLooksOff(dish.kcal, dish)).length,
    avgKcal: dishes.length ? kcals.reduce((sum, kcal) => sum + kcal, 0) / dishes.length : 0,
    kcal: range(kcals),
    price: range(dishes.map((dish) => dish.price)),
  }
}

export type MenuSummary = ReturnType<typeof summarizeMenu>

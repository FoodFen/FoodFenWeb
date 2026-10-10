/** Percentage change from `previous` to `current`, one decimal; undefined when there is no baseline. */
export const percentChange = (current: number, previous: number) =>
  previous === 0 ? undefined : Math.round(((current - previous) / previous) * 1000) / 10

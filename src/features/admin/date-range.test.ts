import { pickDay, toDate, toIso, vietnamToday } from './date-range'

test('maps between BE days and calendar dates without drifting', () => {
  const date = toDate('2026-10-09')
  expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 9, 9])
  expect(toIso(date)).toBe('2026-10-09')
})

test('today is the Vietnam day, not the UTC one', () => {
  expect(vietnamToday(new Date('2026-10-09T18:30:00Z'))).toBe('2026-10-10')
  expect(vietnamToday(new Date('2026-10-09T16:30:00Z'))).toBe('2026-10-09')
})

describe('pickDay', () => {
  test('the first click only anchors', () => {
    expect(pickDay(null, '2026-10-05')).toEqual({ anchor: '2026-10-05', range: null })
  })

  test('the second click completes the range in either order', () => {
    expect(pickDay('2026-10-05', '2026-10-09').range).toEqual({
      from: '2026-10-05',
      to: '2026-10-09',
    })
    expect(pickDay('2026-10-09', '2026-10-05').range).toEqual({
      from: '2026-10-05',
      to: '2026-10-09',
    })
    expect(pickDay('2026-10-05', '2026-10-05').range).toEqual({
      from: '2026-10-05',
      to: '2026-10-05',
    })
  })
})

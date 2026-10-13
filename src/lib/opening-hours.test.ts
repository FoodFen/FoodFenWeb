import {
  crossesMidnight,
  displayHours,
  findOverlap,
  formatHours,
  parseHours,
} from './opening-hours'

const s = (open: string, close: string) => ({ open, close })

test('formats shifts as the stored text', () => {
  expect(formatHours([s('07:00', '10:30'), s('16:00', '21:00')])).toBe('07:00-10:30, 16:00-21:00')
})

test('parses its own output', () => {
  expect(parseHours('07:00-10:30, 16:00-21:00')).toEqual([s('07:00', '10:30'), s('16:00', '21:00')])
})

test.each([
  ['7:00 - 21:00', [s('07:00', '21:00')]],
  ['7h-21h', [s('07:00', '21:00')]],
  ['7h30 – 21h', [s('07:30', '21:00')]],
  ['  06:00—10:00 ;  17:00 - 22:00 ', [s('06:00', '10:00'), s('17:00', '22:00')]],
])('parses legacy text "%s"', (text, shifts) => {
  expect(parseHours(text)).toEqual(shifts)
})

test.each([
  '',
  'hằng ngày',
  '7:00 - 21:00 hằng ngày',
  '25:00-26:00',
  '07:60-08:00',
  '1-2, 3-4, 5-6, 7-8',
])('returns null for "%s"', (text) => {
  expect(parseHours(text)).toBeNull()
})

test('a shift crosses midnight when it closes before it opens', () => {
  expect(crossesMidnight(s('18:00', '02:00'))).toBe(true)
  expect(crossesMidnight(s('07:00', '21:00'))).toBe(false)
})

describe('findOverlap', () => {
  test('is -1 for separate shifts, even when one touches the next', () => {
    expect(findOverlap([s('07:00', '10:30'), s('16:00', '21:00')])).toBe(-1)
    expect(findOverlap([s('07:00', '10:00'), s('10:00', '12:00')])).toBe(-1)
  })

  test('finds the shift that overlaps an earlier one', () => {
    expect(findOverlap([s('07:00', '12:00'), s('11:00', '14:00')])).toBe(1)
  })

  test('sees overlap across midnight', () => {
    expect(findOverlap([s('18:00', '02:00'), s('01:00', '05:00')])).toBe(1)
    expect(findOverlap([s('18:00', '02:00'), s('03:00', '05:00')])).toBe(-1)
    expect(findOverlap([s('06:00', '10:00'), s('22:00', '07:00')])).toBe(1)
  })
})

test('displays readable legacy text normalised and the rest verbatim', () => {
  expect(displayHours('6:00-21:00')).toBe('06:00-21:00')
  expect(displayHours('7h - 11h; 16h-21h')).toBe('07:00-11:00, 16:00-21:00')
  expect(displayHours('7:00 - 21:00 hằng ngày')).toBe('7:00 - 21:00 hằng ngày')
})

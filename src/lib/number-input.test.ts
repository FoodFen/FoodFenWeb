import { parseDecimal, parseWhole } from './number-input'

test('decimals accept a comma or a dot and reject anything else', () => {
  expect(parseDecimal('12,5')).toBe(12.5)
  expect(parseDecimal(' 12.5 ')).toBe(12.5)
  expect(parseDecimal('7')).toBe(7)
  for (const text of ['', 'abc', '-1', '1,2,3', '1e3', ',5']) expect(parseDecimal(text)).toBeNaN()
})

test('whole numbers accept thousands groups with a dot, comma or space', () => {
  expect(parseWhole('65000')).toBe(65000)
  expect(parseWhole('99.000')).toBe(99000)
  expect(parseWhole('99,000')).toBe(99000)
  expect(parseWhole('1 250 000')).toBe(1250000)
  for (const text of ['', '12.5', '1,5', '99.00', '1.2345', '-3', 'abc']) {
    expect(parseWhole(text)).toBeNaN()
  }
})

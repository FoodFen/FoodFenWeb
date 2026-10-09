import { parseCoordinates } from './coordinates'

test('splits the string Google Maps copies', () => {
  expect(parseCoordinates('10.7769, 106.7009')).toEqual({ latitude: 10.7769, longitude: 106.7009 })
})

test('accepts negatives, no space and surrounding whitespace', () => {
  expect(parseCoordinates(' -33.86,151.21 ')).toEqual({ latitude: -33.86, longitude: 151.21 })
})

test('rejects out-of-range values', () => {
  expect(parseCoordinates('91, 10')).toBeNull()
  expect(parseCoordinates('10, 181')).toBeNull()
})

test('rejects anything that is not a pair of numbers', () => {
  expect(parseCoordinates('')).toBeNull()
  expect(parseCoordinates('10.77')).toBeNull()
  expect(parseCoordinates('10.77; 106.70')).toBeNull()
  expect(parseCoordinates('https://maps.app.goo.gl/abc')).toBeNull()
})

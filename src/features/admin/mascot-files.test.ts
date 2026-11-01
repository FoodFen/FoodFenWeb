import { stateFromFilename, fitsImageSize, isImageType } from './mascot-files'

test('a filename that is exactly a state name picks that state', () => {
  expect(stateFromFilename('happy.png')).toBe('happy')
  expect(stateFromFilename('IDLE.webp')).toBe('idle')
  expect(stateFromFilename('happy-2.png')).toBeNull()
  expect(stateFromFilename('happy')).toBe('happy')
})

const file = (type: string, size = 10) => new File([new Uint8Array(size)], 'a', { type })

test('only png and webp are accepted', () => {
  expect(isImageType(file('image/png'))).toBe(true)
  expect(isImageType(file('image/webp'))).toBe(true)
  expect(isImageType(file('image/jpeg'))).toBe(false)
  expect(isImageType(file('image/gif'))).toBe(false)
})

test('up to 5 MB fits', () => {
  expect(fitsImageSize(file('image/png', 5 * 1024 * 1024))).toBe(true)
  expect(fitsImageSize(file('image/png', 5 * 1024 * 1024 + 1))).toBe(false)
})

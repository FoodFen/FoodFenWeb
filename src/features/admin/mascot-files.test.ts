import { stateFromFilename, validateImageFile } from './mascot-files'

test('a filename that is exactly a state name picks that state', () => {
  expect(stateFromFilename('happy.png')).toBe('happy')
  expect(stateFromFilename('IDLE.webp')).toBe('idle')
  expect(stateFromFilename('happy-2.png')).toBeNull()
  expect(stateFromFilename('happy')).toBe('happy')
})

test('only png and webp up to 5 MB are accepted', () => {
  const file = (type: string, size = 10) => new File([new Uint8Array(size)], 'a', { type })
  expect(validateImageFile(file('image/png'))).toBeNull()
  expect(validateImageFile(file('image/jpeg'))).toBe('imageType')
  expect(validateImageFile(file('image/gif'))).toBe('imageType')
  expect(validateImageFile(file('image/webp', 5 * 1024 * 1024 + 1))).toBe('imageSize')
})

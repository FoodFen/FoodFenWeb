import { fitWithin, resizeImage } from './resize-image'

test('fitWithin scales the longest side down and keeps the aspect ratio', () => {
  expect(fitWithin(2000, 1000, 1024)).toEqual({ width: 1024, height: 512 })
  expect(fitWithin(1000, 2000, 1024)).toEqual({ width: 512, height: 1024 })
  expect(fitWithin(2000, 2000, 1024)).toEqual({ width: 1024, height: 1024 })
  expect(fitWithin(2001, 1000, 1000)).toEqual({ width: 1000, height: 500 })
})

test('fitWithin never upscales', () => {
  expect(fitWithin(512, 300, 1024)).toEqual({ width: 512, height: 300 })
  expect(fitWithin(1024, 1024, 1024)).toEqual({ width: 1024, height: 1024 })
})

test('an image that is already small comes back as the same file and the bitmap is closed', async () => {
  const close = vi.fn()
  vi.stubGlobal('createImageBitmap', async () => ({ width: 800, height: 600, close }))
  const file = new File(['x'], 'idle.png', { type: 'image/png' })

  expect(await resizeImage(file)).toBe(file)
  expect(close).toHaveBeenCalled()
  vi.unstubAllGlobals()
})

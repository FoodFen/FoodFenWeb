import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { resizeImage } from './resize-image'
import { useImageSlots } from './use-image-slots'

vi.mock('./resize-image', () => ({ resizeImage: vi.fn() }))

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
)

test('an image the browser cannot decode shows the unreadable error on its tile', async () => {
  vi.mocked(resizeImage).mockRejectedValueOnce(new Error('decode'))
  const onUploaded = vi.fn()
  const { result } = renderHook(() => useImageSlots(onUploaded), { wrapper })

  await act(() =>
    result.current.assign('happy', new File(['x'], 'happy.png', { type: 'image/png' })),
  )

  expect(result.current.slots.happy).toEqual({ error: 'Không đọc được ảnh này' })
  expect(onUploaded).not.toHaveBeenCalled()
})

test('a resized file still over 5 MB is rejected by size', async () => {
  const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'happy.png', { type: 'image/png' })
  vi.mocked(resizeImage).mockResolvedValueOnce(big)
  const { result } = renderHook(() => useImageSlots(vi.fn()), { wrapper })

  await act(() => result.current.assign('happy', big))

  expect(result.current.slots.happy).toEqual({ error: 'Ảnh tối đa 5 MB' })
})

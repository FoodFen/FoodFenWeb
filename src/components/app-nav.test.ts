import { isActivePath } from './app-nav'

const link = (to: string, exact?: boolean) => ({ to, exact }) as Parameters<typeof isActivePath>[1]

test('a link is active on its own path and below it', () => {
  expect(isActivePath('/restaurant/ads', link('/restaurant/ads'))).toBe(true)
  expect(isActivePath('/admin/restaurants/abc', link('/admin/restaurants'))).toBe(true)
})

test('exact links ignore deeper paths', () => {
  expect(isActivePath('/restaurant/ads', link('/restaurant', true))).toBe(false)
  expect(isActivePath('/restaurant', link('/restaurant', true))).toBe(true)
})

test('a path that merely shares a prefix is not active', () => {
  expect(isActivePath('/administrator', link('/admin'))).toBe(false)
})

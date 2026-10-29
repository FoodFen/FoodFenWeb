import type { AdminRestaurantRowResponse } from '@/api/generated'
import { PAGE_SIZE, filterRestaurants, paginate } from './restaurant-filter'

const row = (name: string, ownerName: string | null, ownerEmail: string) =>
  ({ name, ownerName, ownerEmail }) as AdminRestaurantRowResponse

const rows = [
  row('Bún Bò Huế', 'Nguyễn Văn Đức', 'duc@x.vn'),
  row('Cơm Tấm', null, 'owner@mail.com'),
]

describe('filterRestaurants', () => {
  test('matches name, owner name and owner email ignoring case and diacritics', () => {
    expect(filterRestaurants(rows, 'BUN bo')).toEqual([rows[0]])
    expect(filterRestaurants(rows, 'nguyen van duc')).toEqual([rows[0]])
    expect(filterRestaurants(rows, 'OWNER@')).toEqual([rows[1]])
  })

  test('a blank query keeps every row', () => {
    expect(filterRestaurants(rows, '  ')).toBe(rows)
  })

  test('no match gives an empty list', () => {
    expect(filterRestaurants(rows, 'pizza')).toEqual([])
  })
})

describe('paginate', () => {
  const many = Array.from({ length: PAGE_SIZE * 2 + 1 }, (_, i) => i)

  test('slices a page and reports the page count', () => {
    const second = paginate(many, 2)
    expect(second.items).toEqual(many.slice(PAGE_SIZE, PAGE_SIZE * 2))
    expect(second).toMatchObject({ page: 2, pageCount: 3, total: many.length })
  })

  test('clamps pages outside the bounds', () => {
    expect(paginate(many, 99).page).toBe(3)
    expect(paginate(many, 0).page).toBe(1)
  })

  test('an empty list is one empty page', () => {
    expect(paginate([], 5)).toEqual({ items: [], page: 1, pageCount: 1, total: 0 })
  })
})

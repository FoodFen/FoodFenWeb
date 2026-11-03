import type { FoodMissResponse, FoodMissStatus } from '@/api/generated'
import { renderRoutes } from '@/test/render-routes'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodMissesTable } from './food-misses-table'
import { foodSearchSchema } from './food-search'

const miss = (patch: Partial<FoodMissResponse>): FoodMissResponse => ({
  id: 'm1',
  key: 'banh trang tron',
  name: 'bánh tráng trộn',
  language: 'vi',
  count: 4,
  firstSeenAt: '2026-10-01T09:00:00Z',
  lastSeenAt: '2026-10-10T09:20:46Z',
  status: 'open',
  existingFood: null,
  ...patch,
})

const handlers = { onAdd: vi.fn(), onIgnore: vi.fn(), onReopen: vi.fn() }

const renderTable = (rows: FoodMissResponse[], status: FoodMissStatus = 'open') =>
  renderRoutes(
    [
      {
        path: '/admin/foods',
        validateSearch: foodSearchSchema,
        component: () => <FoodMissesTable rows={rows} status={status} {...handlers} />,
      },
    ],
    '/admin/foods',
  )

beforeEach(() => vi.clearAllMocks())

test('only a miss typed in another language than Vietnamese gets the EN badge', async () => {
  await renderTable([miss({}), miss({ id: 'm2', name: 'banana', language: 'en' })])

  expect(screen.getAllByText('EN')).toHaveLength(1)
})

test('a Vietnamese miss prefills the name, an English one the English name', async () => {
  await renderTable([miss({}), miss({ id: 'm2', name: 'banana', language: 'en' })])

  await userEvent.click(screen.getByRole('button', { name: 'Thêm món bánh tráng trộn' }))
  expect(handlers.onAdd).toHaveBeenLastCalledWith({ missId: 'm1', name: 'bánh tráng trộn' })

  await userEvent.click(screen.getByRole('button', { name: 'Thêm món banana' }))
  expect(handlers.onAdd).toHaveBeenLastCalledWith({ missId: 'm2', nameEn: 'banana' })
})

test('a miss already in the catalog links to it and cannot be added, only ignored', async () => {
  await renderTable([miss({ existingFood: { slug: 'banh-trang-tron', name: 'Bánh tráng trộn' } })])

  const link = screen.getByRole('link', { name: 'Đã có trong danh mục: Bánh tráng trộn' })
  expect(link).toHaveAttribute('href', '/admin/foods?food=banh-trang-tron')
  expect(screen.queryByRole('button', { name: /^Thêm món/ })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: /^Bỏ qua/ }))
  expect(handlers.onIgnore).toHaveBeenCalledWith('m1')
})

test('ignored and resolved misses can be reopened', async () => {
  await renderTable(
    [miss({ status: 'ignored' }), miss({ id: 'm2', status: 'resolved' })],
    'ignored',
  )

  expect(screen.queryByRole('button', { name: /^Bỏ qua/ })).not.toBeInTheDocument()
  const reopen = screen.getAllByRole('button', { name: /^Mở lại/ })
  expect(reopen).toHaveLength(2)

  await userEvent.click(reopen[1])
  expect(handlers.onReopen).toHaveBeenCalledWith('m2')
})

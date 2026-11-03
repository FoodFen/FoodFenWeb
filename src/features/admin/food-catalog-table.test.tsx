import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FoodCatalogTable } from './food-catalog-table'
import type { AdminFood } from './food-types'

const food = (patch: Partial<AdminFood>): AdminFood => ({
  slug: 'pho-bo',
  name: 'Phở bò',
  nameEn: null,
  category: 'mon-nuoc',
  sourceKind: 'nin',
  sourceRef: null,
  verified: true,
  kcal: 350,
  carbsG: 40,
  proteinG: 20,
  fatG: 10,
  fiberG: null,
  archived: false,
  updatedAt: '2026-10-10T09:20:46Z',
  ...patch,
})

test('an unverified food is flagged "Chưa có nguồn", a verified one names its source', () => {
  render(
    <FoodCatalogTable
      rows={[food({}), food({ slug: 'xoi', name: 'Xôi', verified: false, sourceKind: 'legacy' })]}
      filtered={false}
      onOpen={() => {}}
    />,
  )

  expect(screen.getByText('Chưa có nguồn')).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Viện Dinh dưỡng (NIN)' })).toBeInTheDocument()
})

test('the English name sits under the name', () => {
  render(
    <FoodCatalogTable rows={[food({ nameEn: 'Beef pho' })]} filtered={false} onOpen={() => {}} />,
  )
  expect(screen.getByText('Beef pho')).toBeInTheDocument()
})

test('clicking anywhere on a row opens that food', async () => {
  const onOpen = vi.fn()
  render(<FoodCatalogTable rows={[food({})]} filtered={false} onOpen={onOpen} />)

  await userEvent.click(screen.getByText('Món nước'))
  expect(onOpen).toHaveBeenCalledWith('pho-bo')
})

test('the name is a button, so the keyboard reaches the row', async () => {
  const onOpen = vi.fn()
  render(<FoodCatalogTable rows={[food({})]} filtered={false} onOpen={onOpen} />)

  await userEvent.tab()
  expect(screen.getByRole('button', { name: 'Phở bò' })).toHaveFocus()
  await userEvent.keyboard('{Enter}')
  expect(onOpen).toHaveBeenCalledTimes(1)
})

test('an empty list says whether nothing matched or nothing exists', () => {
  const { rerender } = render(<FoodCatalogTable rows={[]} filtered={false} onOpen={() => {}} />)
  expect(screen.getByText('Chưa có món nào')).toBeInTheDocument()

  rerender(<FoodCatalogTable rows={[]} filtered onOpen={() => {}} />)
  expect(screen.getByText('Không có món phù hợp')).toBeInTheDocument()
})

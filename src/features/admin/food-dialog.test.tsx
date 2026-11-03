import type { AdminFoodResponse, FoodChangeResponse, FoodSnapshot } from '@/api/generated'
import {
  createFoodAdminFoodsPost,
  getFoodAdminFoodsSlugGet,
  listFoodChangesAdminFoodsSlugChangesGet,
  updateFoodAdminFoodsSlugPatch,
} from '@/api/generated/sdk.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { FoodDialog } from './food-dialog'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  getFoodAdminFoodsSlugGet: vi.fn(),
  updateFoodAdminFoodsSlugPatch: vi.fn(),
  createFoodAdminFoodsPost: vi.fn(),
  listFoodChangesAdminFoodsSlugChangesGet: vi.fn(),
}))

const getFood = vi.mocked(getFoodAdminFoodsSlugGet)
const updateFood = vi.mocked(updateFoodAdminFoodsSlugPatch)
const createFood = vi.mocked(createFoodAdminFoodsPost)
const listChanges = vi.mocked(listFoodChangesAdminFoodsSlugChangesGet)

const detail = (patch: Partial<AdminFoodResponse> = {}): AdminFoodResponse => ({
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
  aliases: ['pho'],
  servings: [{ label: '1 tô', grams: 450, default: true }],
  createdAt: '2026-10-01T09:20:46Z',
  updatedByEmail: 'admin@x.vn',
  ...patch,
})

const snapshot = (patch: Partial<FoodSnapshot> = {}): FoodSnapshot => ({
  name: 'Phở bò',
  nameEn: null,
  aliases: [],
  category: 'mon-nuoc',
  kcal: 300,
  carbsG: 40,
  proteinG: 20,
  fatG: 10,
  fiberG: null,
  servings: [{ label: '1 tô', grams: 450, default: true }],
  sourceKind: 'nin',
  sourceRef: null,
  archived: false,
  ...patch,
})

const failure = (status: number, data: object = {}) =>
  new AxiosError('failed', undefined, undefined, undefined, { status, data } as AxiosResponse)

const renderDialog = (slug: string | null = 'pho-bo', food = detail()) => {
  getFood.mockResolvedValue({ data: food } as never)
  const onClose = vi.fn()
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <FoodDialog slug={slug} onClose={onClose} />
    </QueryClientProvider>,
  )
  return onClose
}

const kcal = () => screen.findByLabelText(/^Calo/)
beforeEach(() => vi.clearAllMocks())

test('editing a food from a source other than the team warns that a change moves it to the team', async () => {
  renderDialog('pho-bo', detail({ sourceKind: 'nin' }))

  expect(await screen.findByText(/chuyển nguồn của món sang FoodFen team/)).toBeInTheDocument()
  expect(screen.getByText(/Viện Dinh dưỡng \(NIN\)/)).toBeInTheDocument()
})

test('a food the team already owns shows no such notice', async () => {
  renderDialog('pho-bo', detail({ sourceKind: 'team' }))

  await kcal()
  expect(screen.queryByText(/chuyển nguồn của món sang FoodFen team/)).not.toBeInTheDocument()
})

test('the PATCH carries only what changed, and the history is not fetched until opened', async () => {
  const onClose = renderDialog()
  const field = await kcal()
  expect(getFood).toHaveBeenCalledTimes(1)
  expect(listChanges).not.toHaveBeenCalled()

  updateFood.mockResolvedValueOnce({ data: detail({ kcal: 360 }) } as never)
  await userEvent.clear(field)
  await userEvent.type(field, '360')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(updateFood).toHaveBeenCalledWith(
    expect.objectContaining({ path: { slug: 'pho-bo' }, body: { kcal: 360 } }),
  )
})

test('a taken name is shown on the name field and the dialog stays open', async () => {
  const onClose = renderDialog()
  const field = await kcal()

  updateFood.mockRejectedValueOnce(failure(409, { error: 'food_name_taken', message: 'x' }))
  await userEvent.clear(field)
  await userEvent.type(field, '360')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByText('Đã có món khác dùng tên này')).toBeInTheDocument()
  expect(onClose).not.toHaveBeenCalled()
})

test('a business-rule failure (422 with only a message) is shown for the whole form', async () => {
  const onClose = renderDialog()
  const field = await kcal()

  updateFood.mockRejectedValueOnce(failure(422, { message: 'Tổng tinh bột, đạm, béo vượt 100 g' }))
  await userEvent.clear(field)
  await userEvent.type(field, '360')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByText('Tổng tinh bột, đạm, béo vượt 100 g')).toHaveAttribute(
    'role',
    'alert',
  )
  expect(onClose).not.toHaveBeenCalled()
})

test('a new food is created with the full body and the miss it came from', async () => {
  createFood.mockResolvedValue({ data: detail() } as never)
  const onClose = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <FoodDialog slug={null} prefill={{ missId: 'm1', name: 'Phở gà' }} onClose={onClose} />
    </QueryClientProvider>,
  )

  expect(screen.getByLabelText(/^Tên món/)).toHaveValue('Phở gà')
  await userEvent.type(screen.getByLabelText(/^Calo/), '300')
  await userEvent.type(screen.getByLabelText(/^Tinh bột/), '30')
  await userEvent.type(screen.getByLabelText(/^Đạm/), '20')
  await userEvent.type(screen.getByLabelText(/^Béo/), '10')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(createFood).toHaveBeenCalledWith(
    expect.objectContaining({
      body: {
        name: 'Phở gà',
        nameEn: null,
        aliases: [],
        category: 'mon-man',
        kcal: 300,
        carbsG: 30,
        proteinG: 20,
        fatG: 10,
        fiberG: null,
        servings: [{ label: '100 g', grams: 100, default: true }],
        missId: 'm1',
      },
    }),
  )
})

test('Enter adds an alias chip, a duplicate is dropped and the chip can be removed', async () => {
  renderDialog('pho-bo', detail({ aliases: [] }))
  const field = await screen.findByLabelText(/^Tên gọi khác/)

  await userEvent.type(field, 'Pho{Enter}pho,Phở gà{Enter}')
  expect(screen.getByText('Pho')).toBeInTheDocument()
  expect(screen.getByText('Phở gà')).toBeInTheDocument()
  expect(screen.getAllByRole('listitem')).toHaveLength(2)

  await userEvent.click(screen.getByRole('button', { name: 'Xóa tên Pho' }))
  expect(screen.queryByText('Pho')).not.toBeInTheDocument()
})

test('the history lists who changed what, once opened', async () => {
  renderDialog()
  await kcal()
  const changes: FoodChangeResponse[] = [
    {
      id: 'c2',
      adminEmail: null,
      action: 'update',
      createdAt: '2026-10-11T09:00:00Z',
      before: snapshot({ kcal: 300 }),
      after: snapshot({ kcal: 350, nameEn: 'Beef pho' }),
    },
    {
      id: 'c1',
      adminEmail: 'a@x.vn',
      action: 'create',
      createdAt: '2026-10-10T09:00:00Z',
      before: null,
      after: snapshot(),
    },
  ]
  listChanges.mockResolvedValueOnce({ data: changes } as never)

  await userEvent.click(screen.getByRole('button', { name: 'Lịch sử' }))

  expect(await screen.findByText('Quản trị viên đã bị xoá')).toBeInTheDocument()
  expect(screen.getByText('Calo: 300 → 350')).toBeInTheDocument()
  expect(screen.getByText('Tên tiếng Anh: trống → Beef pho')).toBeInTheDocument()
  expect(screen.queryByText(/^Tinh bột:/)).not.toBeInTheDocument()
  expect(screen.getByText('a@x.vn')).toBeInTheDocument()
})

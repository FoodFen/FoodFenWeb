import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { adminRequest } from './admin-request'
import { FoodDialog } from './food-dialog'
import type { AdminFoodDetail } from './food-types'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))
vi.mock('./admin-request', () => ({ adminRequest: vi.fn() }))

const request = vi.mocked(adminRequest)

const detail = (patch: Partial<AdminFoodDetail> = {}): AdminFoodDetail => ({
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
  updatedByEmail: 'admin@x.vn',
  ...patch,
})

const failure = (status: number, data: object = {}) =>
  new AxiosError('failed', undefined, undefined, undefined, { status, data } as AxiosResponse)

const renderDialog = (slug: string | null = 'pho-bo', food = detail()) => {
  request.mockImplementation((async (method: string, url: string) => {
    if (method === 'get' && url === '/admin/foods/pho-bo') return food
    throw new Error(`unexpected ${method} ${url}`)
  }) as never)
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
const calls = (method: string) => request.mock.calls.filter(([m]) => m === method)

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
  expect(calls('get').map(([, url]) => url)).toEqual(['/admin/foods/pho-bo'])

  request.mockResolvedValueOnce(detail({ kcal: 360 }))
  await userEvent.clear(field)
  await userEvent.type(field, '360')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() => expect(onClose).toHaveBeenCalled())
  expect(request).toHaveBeenCalledWith('patch', '/admin/foods/pho-bo', { body: { kcal: 360 } })
})

test('a duplicate name (409) is shown on the name field and the dialog stays open', async () => {
  const onClose = renderDialog()
  const field = await kcal()

  request.mockRejectedValueOnce(failure(409))
  await userEvent.clear(field)
  await userEvent.type(field, '360')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByText('Đã có món khác dùng tên này')).toBeInTheDocument()
  expect(onClose).not.toHaveBeenCalled()
})

test('a new food is created with the full body and the miss it came from', async () => {
  request.mockResolvedValue(detail())
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
  expect(request).toHaveBeenCalledWith('post', '/admin/foods', {
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
  })
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
  request.mockResolvedValueOnce({
    items: [
      {
        id: 'c2',
        adminEmail: null,
        action: 'update',
        createdAt: '2026-10-11T09:00:00Z',
        before: { kcal: 300, carbs_g: 30, nameEn: null },
        after: { kcal: 350, carbs_g: 30, nameEn: 'Beef pho' },
      },
      {
        id: 'c1',
        adminEmail: 'a@x.vn',
        action: 'create',
        createdAt: '2026-10-10T09:00:00Z',
        before: null,
        after: {},
      },
    ],
  })

  await userEvent.click(screen.getByRole('button', { name: 'Lịch sử' }))

  expect(await screen.findByText('Quản trị viên đã bị xoá')).toBeInTheDocument()
  expect(screen.getByText('Calo: 300 → 350')).toBeInTheDocument()
  expect(screen.getByText('Tên tiếng Anh: trống → Beef pho')).toBeInTheDocument()
  expect(screen.queryByText(/^Tinh bột:/)).not.toBeInTheDocument()
  expect(screen.getByText('a@x.vn')).toBeInTheDocument()
})

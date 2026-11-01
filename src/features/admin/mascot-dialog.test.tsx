import type { AdminMascotResponse } from '@/api/generated'
import {
  createMascotAdminMascotsPost,
  updateMascotAdminMascotsMascotIdPatch,
} from '@/api/generated/sdk.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError, type AxiosResponse } from 'axios'
import { MascotDialog } from './mascot-dialog'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  createMascotAdminMascotsPost: vi.fn().mockResolvedValue({}),
  updateMascotAdminMascotsMascotIdPatch: vi.fn().mockResolvedValue({}),
}))

const createMascot = vi.mocked(createMascotAdminMascotsPost)
const updateMascot = vi.mocked(updateMascotAdminMascotsMascotIdPatch)

const mascot: AdminMascotResponse = {
  id: 'tomato',
  name: 'Cà chua',
  coinCost: 0,
  active: false,
  images: {},
  bodyColor: null,
  ownerCount: 0,
  equippedCount: 0,
}

const conflict = (data: object) =>
  new AxiosError('failed', undefined, undefined, undefined, {
    status: 409,
    data,
  } as AxiosResponse)

const renderDialog = (editing: AdminMascotResponse | null) => {
  const onOpenChange = vi.fn()
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MascotDialog open onOpenChange={onOpenChange} editing={editing} />
    </QueryClientProvider>,
  )
  return onOpenChange
}

const validation = (data: object) =>
  new AxiosError('failed', undefined, undefined, undefined, {
    status: 422,
    data,
  } as AxiosResponse)

const field = (label: string) => screen.getByLabelText(new RegExp(`^${label}`))

test('the id follows the name until the admin edits the id by hand', async () => {
  renderDialog(null)

  await userEvent.type(field('Tên'), 'Cà Chua Đỏ')
  expect(field('Mã')).toHaveValue('ca-chua-do')

  await userEvent.type(field('Mã'), '-2')
  await userEvent.type(field('Tên'), ' Xanh')
  expect(field('Mã')).toHaveValue('ca-chua-do-2')
})

test('making a free mascot paid asks first and sends the PATCH only after confirming', async () => {
  renderDialog(mascot)

  await userEvent.clear(field('Giá'))
  await userEvent.type(field('Giá'), '50')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))
  expect(updateMascot).not.toHaveBeenCalled()

  const confirm = screen.getByRole('dialog', { name: 'Chuyển sang có phí?' })
  await userEvent.click(within(confirm).getByRole('button', { name: 'Lưu' }))
  await vi.waitFor(() =>
    expect(updateMascot).toHaveBeenCalledWith(
      expect.objectContaining({ path: { mascot_id: 'tomato' }, body: { coinCost: 50 } }),
    ),
  )
})

test('a taken id shows the translated text on the id field and keeps the dialog open', async () => {
  createMascot.mockRejectedValueOnce(conflict({ error: 'mascot_id_taken', message: 'x' }))
  const onOpenChange = renderDialog(null)

  await userEvent.type(field('Tên'), 'Cà chua')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByText('Mã này đã có linh vật khác dùng')).toBeInTheDocument()
  expect(screen.queryByText('x')).not.toBeInTheDocument()
  expect(onOpenChange).not.toHaveBeenCalled()
})

test('a missing idle image is shown on the idle tile', async () => {
  updateMascot.mockRejectedValueOnce(conflict({ error: 'mascot_missing_idle_image' }))
  renderDialog(mascot)

  await userEvent.type(field('Tên'), ' đỏ')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Linh vật cần ảnh idle trước khi hiển thị',
  )
})

test('creating with the default color on sends a null body color', async () => {
  renderDialog(null)

  await userEvent.type(field('Tên'), 'Cà chua')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() =>
    expect(createMascot).toHaveBeenCalledWith(
      expect.objectContaining({ body: expect.objectContaining({ bodyColor: null }) }),
    ),
  )
})

test('turning the default off and typing a color patches it', async () => {
  renderDialog(mascot)

  await userEvent.click(screen.getByRole('checkbox', { name: 'Màu mặc định' }))
  await userEvent.clear(screen.getByLabelText('Mã màu'))
  await userEvent.type(screen.getByLabelText('Mã màu'), '#FF0000')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() =>
    expect(updateMascot).toHaveBeenCalledWith(
      expect.objectContaining({ body: { bodyColor: '#FF0000' } }),
    ),
  )
})

test('turning the default back on resets a mascot color with null', async () => {
  renderDialog({ ...mascot, bodyColor: '#FF0000' })

  await userEvent.click(screen.getByRole('checkbox', { name: 'Màu mặc định' }))
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  await vi.waitFor(() =>
    expect(updateMascot).toHaveBeenCalledWith(
      expect.objectContaining({ body: { bodyColor: null } }),
    ),
  )
})

test('a rejected body color shows the BE message on the field', async () => {
  updateMascot.mockRejectedValueOnce(validation({ errors: { bodyColor: 'Màu không hợp lệ' } }))
  renderDialog({ ...mascot, bodyColor: '#FF0000' })

  await userEvent.clear(screen.getByLabelText('Mã màu'))
  await userEvent.type(screen.getByLabelText('Mã màu'), '#00FF00')
  await userEvent.click(screen.getByRole('button', { name: 'Lưu' }))

  expect(await screen.findByText('Màu không hợp lệ')).toBeInTheDocument()
})

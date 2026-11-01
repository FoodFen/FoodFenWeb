import type { AdminMascotResponse } from '@/api/generated'
import {
  deleteMascotAdminMascotsMascotIdDelete,
  updateMascotAdminMascotsMascotIdPatch,
} from '@/api/generated/sdk.gen'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { AxiosError, type AxiosResponse } from 'axios'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'
import { MascotsTable } from './mascots-table'

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

vi.mock('@/api/generated/sdk.gen', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/api/generated/sdk.gen')>()),
  deleteMascotAdminMascotsMascotIdDelete: vi.fn().mockResolvedValue({}),
  updateMascotAdminMascotsMascotIdPatch: vi.fn().mockResolvedValue({}),
}))

const deleteMascot = vi.mocked(deleteMascotAdminMascotsMascotIdDelete)
const updateMascot = vi.mocked(updateMascotAdminMascotsMascotIdPatch)

const mascot = (patch: Partial<AdminMascotResponse>): AdminMascotResponse => ({
  id: 'tomato',
  name: 'Cà chua',
  coinCost: 100,
  active: false,
  images: {},
  bodyColor: null,
  ownerCount: 0,
  equippedCount: 0,
  ...patch,
})

const renderTable = (rows: AdminMascotResponse[]) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <MascotsTable rows={rows} onEdit={() => {}} />
    </QueryClientProvider>,
  )

const switchOf = (name: string) => screen.getByRole('switch', { name: `Hiển thị ${name}` })

test('a mascot without an idle image cannot be shown unless the app draws it', () => {
  renderTable([mascot({}), mascot({ id: 'sprout', name: 'Sprout' })])
  expect(switchOf('Cà chua')).toBeDisabled()
  expect(switchOf('Sprout')).toBeEnabled()
})

test('deleting an unused mascot asks first and then deletes', async () => {
  renderTable([mascot({})])
  expect(screen.queryByRole('button', { name: 'Ẩn Cà chua' })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Xóa Cà chua' }))
  expect(deleteMascot).not.toHaveBeenCalled()
  expect(screen.getByText('Không thể hoàn tác.')).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Xóa' }))
  expect(deleteMascot).toHaveBeenCalledWith(
    expect.objectContaining({ path: { mascot_id: 'tomato' } }),
  )
})

test('a mascot that people own is hidden, with a warning when some use it', async () => {
  renderTable([mascot({ active: true, images: { idle: 'u' }, ownerCount: 5, equippedCount: 2 })])
  expect(screen.queryByRole('button', { name: 'Xóa Cà chua' })).not.toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Ẩn Cà chua' }))
  expect(updateMascot).not.toHaveBeenCalled()
  expect(screen.getByText(/2 người đang dùng/)).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Ẩn' }))
  expect(updateMascot).toHaveBeenCalledWith(
    expect.objectContaining({ path: { mascot_id: 'tomato' }, body: { active: false } }),
  )
})

test('the default mascot can be neither hidden nor deleted', () => {
  renderTable([mascot({ id: 'default', name: 'Fen', active: true, coinCost: 0 })])
  expect(switchOf('Fen')).toBeDisabled()
  expect(screen.queryByRole('button', { name: /^(Xóa|Ẩn) / })).not.toBeInTheDocument()
})

test('a mascot in use that cannot be deleted shows the translated message, not the server text', async () => {
  const response = { status: 409, data: { error: 'mascot_in_use', message: 'Mascot in use' } }
  deleteMascot.mockRejectedValueOnce(
    new AxiosError('failed', undefined, undefined, undefined, response as AxiosResponse),
  )
  renderTable([mascot({})])

  await userEvent.click(screen.getByRole('button', { name: 'Xóa Cà chua' }))
  await userEvent.click(screen.getByRole('button', { name: 'Xóa' }))

  await vi.waitFor(() =>
    expect(toast.error).toHaveBeenCalledWith(
      'Đã có người mua hoặc đang dùng linh vật này. Hãy ẩn thay vì xóa.',
    ),
  )
})

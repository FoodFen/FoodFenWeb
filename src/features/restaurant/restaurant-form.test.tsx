import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantForm } from './restaurant-form'
import { emptyRestaurant, type RestaurantValues } from './restaurant-schema'

const setup = (
  onSubmit = vi.fn().mockResolvedValue(undefined),
  defaultValues: RestaurantValues = emptyRestaurant,
) => {
  render(
    <RestaurantForm
      defaultValues={defaultValues}
      submitLabel="Gửi duyệt"
      onSubmit={onSubmit}
      upload={vi.fn()}
    />,
  )
  return onSubmit
}

test('the phone field asks for the telephone keypad and autofill', () => {
  setup()
  const phone = screen.getByLabelText('Số điện thoại')
  expect(phone).toHaveAttribute('type', 'tel')
  expect(phone).toHaveAttribute('inputmode', 'tel')
  expect(phone).toHaveAttribute('autocomplete', 'tel')
})

test('a phone that is not a real number is flagged with an example', async () => {
  const onSubmit = setup()
  await userEvent.type(screen.getByLabelText('Số điện thoại'), '123')
  await userEvent.type(screen.getByLabelText('Tên quán'), 'Bếp Nhà')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi duyệt' }))

  expect(await screen.findByText(/Số điện thoại không hợp lệ/)).toBeInTheDocument()
  await waitFor(() =>
    expect(screen.getByLabelText('Số điện thoại')).toHaveAttribute('aria-invalid', 'true'),
  )
  expect(onSubmit).not.toHaveBeenCalled()
})

const filled: RestaurantValues = {
  ...emptyRestaurant,
  name: 'Bếp Nhà',
  address: '12 Nguyễn Huệ',
  phone: '0901234567',
  hours: [{ open: '07:00', close: '21:00' }],
  location: '10.7769, 106.7009',
}

const save = () => userEvent.click(screen.getByRole('button', { name: 'Gửi duyệt' }))
const edit = () => userEvent.type(screen.getByLabelText('Tên quán'), '!')

test('shifts can be added up to three and removed down to one', async () => {
  setup(undefined, filled)
  const add = screen.getByRole('button', { name: 'Thêm ca' })
  await userEvent.click(add)
  await userEvent.click(add)
  expect(screen.getAllByLabelText(/^Giờ mở cửa, ca/)).toHaveLength(3)
  expect(add).toBeDisabled()

  await userEvent.click(screen.getByRole('button', { name: 'Xoá ca 3' }))
  await userEvent.click(screen.getByRole('button', { name: 'Xoá ca 2' }))
  expect(screen.getAllByLabelText(/^Giờ mở cửa, ca/)).toHaveLength(1)
  expect(screen.getByRole('button', { name: 'Xoá ca 1' })).toBeDisabled()
})

test('an empty new shift asks for both times and blocks the save', async () => {
  const onSubmit = setup(undefined, filled)
  await userEvent.click(screen.getByRole('button', { name: 'Thêm ca' }))
  await save()

  expect(await screen.findByText('Chọn giờ mở cửa')).toBeInTheDocument()
  expect(screen.getByText('Chọn giờ đóng cửa')).toBeInTheDocument()
  expect(onSubmit).not.toHaveBeenCalled()
})

test('overlapping shifts are rejected and a shift past midnight is labelled', async () => {
  const onSubmit = setup(undefined, filled)
  await userEvent.click(screen.getByRole('button', { name: 'Thêm ca' }))
  await userEvent.type(screen.getByLabelText('Giờ mở cửa, ca 2'), '20:00')
  await userEvent.type(screen.getByLabelText('Giờ đóng cửa, ca 2'), '02:00')
  expect(screen.getByText('Qua đêm, đóng cửa vào sáng hôm sau')).toBeInTheDocument()

  await save()
  expect(await screen.findByText('Ca này trùng với một ca khác')).toBeInTheDocument()
  expect(onSubmit).not.toHaveBeenCalled()
})

test('valid shifts are submitted', async () => {
  const onSubmit = setup(undefined, filled)
  await userEvent.click(screen.getByRole('button', { name: 'Thêm ca' }))
  await userEvent.type(screen.getByLabelText('Giờ mở cửa, ca 2'), '22:00')
  await userEvent.type(screen.getByLabelText('Giờ đóng cửa, ca 2'), '23:30')
  await save()

  await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  expect(onSubmit.mock.calls[0][0].hours).toEqual([
    { open: '07:00', close: '21:00' },
    { open: '22:00', close: '23:30' },
  ])
})

test('unreadable saved hours show read-only and an untouched form still saves', async () => {
  const onSubmit = setup(undefined, { ...filled, hours: [], legacyHours: 'Cả ngày trừ Chủ nhật' })
  expect(screen.getByText('Giờ hiện tại: Cả ngày trừ Chủ nhật')).toBeInTheDocument()
  expect(screen.queryByLabelText(/^Giờ mở cửa, ca/)).not.toBeInTheDocument()

  await edit()
  await save()
  await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  expect(onSubmit.mock.calls[0][0].hours).toEqual([])
})

test('picking times for unreadable saved hours makes them required', async () => {
  const onSubmit = setup(undefined, { ...filled, hours: [], legacyHours: 'Cả ngày' })
  await userEvent.click(screen.getByRole('button', { name: 'Chọn giờ' }))
  await save()

  expect(await screen.findByText('Chọn giờ mở cửa')).toBeInTheDocument()
  expect(onSubmit).not.toHaveBeenCalled()
})

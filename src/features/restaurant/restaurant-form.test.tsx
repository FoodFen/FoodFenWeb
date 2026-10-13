import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RestaurantForm } from './restaurant-form'
import { emptyRestaurant } from './restaurant-schema'

const setup = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <RestaurantForm
      defaultValues={emptyRestaurant}
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

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DishForm } from './dish-form'
import { emptyDish } from './dish-schema'

const setup = (onSubmit = vi.fn().mockResolvedValue(undefined)) => {
  render(
    <DishForm
      defaultValues={emptyDish}
      submitLabel="Gửi duyệt"
      onSubmit={onSubmit}
      upload={vi.fn()}
    />,
  )
  return onSubmit
}

test('submitting an empty form flags the fields and focuses the first one', async () => {
  const onSubmit = setup()
  await userEvent.type(screen.getByLabelText('Mô tả (không bắt buộc)'), 'ngon')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi duyệt' }))

  const name = screen.getByLabelText('Tên món')
  await waitFor(() => expect(name).toHaveFocus())
  expect(name).toHaveAttribute('aria-invalid', 'true')
  expect(name).toHaveAttribute('aria-describedby', 'name-error')
  expect(screen.getAllByRole('alert').length).toBeGreaterThan(3)
  expect(onSubmit).not.toHaveBeenCalled()
})

test('number fields get the right keypad and the price a hint', () => {
  setup()
  expect(screen.getByLabelText('Giá (đồng)')).toHaveAttribute('inputmode', 'numeric')
  expect(screen.getByLabelText('Giá (đồng)')).toHaveAttribute('aria-describedby', 'price-hint')
  expect(screen.getByLabelText('Đạm (g)')).toHaveAttribute('inputmode', 'decimal')
})

test('accepts "65.000" and "12,5" as typed', async () => {
  const onSubmit = setup()
  await userEvent.type(screen.getByLabelText('Tên món'), 'Phở')
  await userEvent.type(screen.getByLabelText('Giá (đồng)'), '65.000')
  await userEvent.type(screen.getByLabelText('Khẩu phần (g)'), '450')
  await userEvent.type(screen.getByLabelText('Năng lượng (kcal)'), '430')
  await userEvent.type(screen.getByLabelText('Đạm (g)'), '12,5')
  await userEvent.type(screen.getByLabelText('Tinh bột (g)'), '60')
  await userEvent.type(screen.getByLabelText('Chất béo (g)'), '10')
  await userEvent.click(screen.getByRole('button', { name: 'Gửi duyệt' }))

  await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  expect(onSubmit.mock.calls[0][0]).toMatchObject({ price: '65.000', proteinG: '12,5' })
})

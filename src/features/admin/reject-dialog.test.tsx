import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RejectDialog } from './reject-dialog'

const setup = (onReject = vi.fn().mockResolvedValue(undefined)) => {
  const onOpenChange = vi.fn()
  render(<RejectDialog open onOpenChange={onOpenChange} subject="Phở bò" onReject={onReject} />)
  return { onReject, onOpenChange }
}

test('an empty reason is refused, flagged on the field and focused', async () => {
  const { onReject } = setup()
  await userEvent.click(screen.getByRole('button', { name: 'Từ chối' }))

  expect(await screen.findByRole('alert')).toHaveTextContent('Nhập lý do')
  const reason = screen.getByRole('textbox')
  expect(reason).toHaveAttribute('aria-invalid', 'true')
  expect(reason).toHaveAttribute('aria-describedby', 'reason-error')
  await waitFor(() => expect(reason).toHaveFocus())
  expect(onReject).not.toHaveBeenCalled()
})

test('sends the trimmed reason and closes', async () => {
  const { onReject, onOpenChange } = setup()
  await userEvent.type(screen.getByRole('textbox'), '  Thiếu ảnh  ')
  await userEvent.click(screen.getByRole('button', { name: 'Từ chối' }))

  await waitFor(() => expect(onReject).toHaveBeenCalledWith('Thiếu ảnh'))
  expect(onOpenChange).toHaveBeenCalledWith(false)
})

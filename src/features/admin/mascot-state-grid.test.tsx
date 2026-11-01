import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MascotStateGrid } from './mascot-state-grid'

const png = (name: string) => new File(['x'], name, { type: 'image/png' })

function renderGrid() {
  const assign = vi.fn()
  render(<MascotStateGrid images={{}} slots={{}} assign={assign} onRemove={() => {}} />)
  return assign
}

test('selecting several files assigns the ones named after a state and lists the rest', async () => {
  const assign = renderGrid()
  const happy = png('happy.png')
  const idle = png('idle.png')

  await userEvent.upload(screen.getByLabelText('Tải nhiều ảnh'), [happy, idle, png('weird.png')])

  expect(assign).toHaveBeenCalledTimes(2)
  expect(assign).toHaveBeenCalledWith('happy', happy)
  expect(assign).toHaveBeenCalledWith('idle', idle)
  expect(screen.getByText('weird.png')).toBeInTheDocument()
})

test('a listed file is assigned from its state picker', async () => {
  const assign = renderGrid()
  const weird = png('weird.png')
  await userEvent.upload(screen.getByLabelText('Tải nhiều ảnh'), weird)

  await userEvent.selectOptions(screen.getByLabelText('Gán weird.png vào trạng thái'), 'thinking')

  expect(assign).toHaveBeenCalledWith('thinking', weird)
  expect(screen.queryByText('weird.png')).not.toBeInTheDocument()
})

test('one file dropped on a tile goes to that tile, not by its name', () => {
  const assign = renderGrid()
  const file = png('happy.png')
  const tile = screen.getByLabelText('Chọn ảnh cho trạng thái Đói').closest('[class*="relative"]')!

  fireEvent.drop(tile, { dataTransfer: { files: [file] } })

  expect(assign).toHaveBeenCalledTimes(1)
  expect(assign).toHaveBeenCalledWith('hungry', file)
})

test('each tile says when the app shows its state', () => {
  renderGrid()

  expect(screen.getByText('Đến giờ ăn mà chưa ghi bữa')).toBeInTheDocument()
})

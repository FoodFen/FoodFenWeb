import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimePicker } from './time-picker'

const setup = (value = '') => {
  const onChange = vi.fn()
  render(<TimePicker value={value} onChange={onChange} aria-label="Giờ mở cửa" />)
  return onChange
}

const open = () => userEvent.click(screen.getByRole('button', { name: 'Giờ mở cửa' }))
const option = (column: 'Giờ' | 'Phút', name: string) =>
  within(screen.getByRole('listbox', { name: column })).getByRole('option', { name })

test('shows the picked time', () => {
  setup('07:30')
  expect(screen.getByRole('button', { name: 'Giờ mở cửa' })).toHaveTextContent('07:30')
})

test('an empty picker shows the placeholder', () => {
  setup()
  expect(screen.getByRole('button', { name: 'Giờ mở cửa' })).toHaveTextContent('Chọn giờ')
})

test('picking an hour then a minute reports each and closes after the minute', async () => {
  const onChange = setup()
  await open()
  await userEvent.click(option('Giờ', '08'))
  expect(onChange).toHaveBeenLastCalledWith('08:00')
  expect(screen.getByRole('listbox', { name: 'Giờ' })).toBeInTheDocument()

  await userEvent.click(option('Phút', '45'))
  expect(onChange).toHaveBeenLastCalledWith('00:45')
  expect(screen.queryByRole('listbox', { name: 'Giờ' })).not.toBeInTheDocument()
})

test('changing the hour keeps the minute', async () => {
  const onChange = setup('07:30')
  await open()
  await userEvent.click(option('Giờ', '09'))
  expect(onChange).toHaveBeenCalledWith('09:30')
})

test('the selected hour and minute are marked', async () => {
  setup('16:15')
  await open()
  expect(option('Giờ', '16')).toHaveAttribute('aria-selected', 'true')
  expect(option('Giờ', '15')).toHaveAttribute('aria-selected', 'false')
  expect(option('Phút', '15')).toHaveAttribute('aria-selected', 'true')
})

test('minutes offer quarter hours, plus a saved off-grid minute', async () => {
  setup('10:20')
  await open()
  const minutes = within(screen.getByRole('listbox', { name: 'Phút' })).getAllByRole('option')
  expect(minutes.map((m) => m.textContent)).toEqual(['00', '15', '20', '30', '45'])
  expect(option('Phút', '20')).toHaveAttribute('aria-selected', 'true')
})

test('arrow keys move through a column and Enter selects', async () => {
  const onChange = setup('07:00')
  await open()
  expect(option('Giờ', '07')).toHaveFocus()

  await userEvent.keyboard('{ArrowDown}')
  expect(option('Giờ', '08')).toHaveFocus()
  await userEvent.keyboard('{ArrowUp}{ArrowUp}')
  expect(option('Giờ', '06')).toHaveFocus()

  await userEvent.keyboard('{Enter}')
  expect(onChange).toHaveBeenCalledWith('06:00')
})

test('Escape closes the popover and focus returns to the trigger', async () => {
  setup('07:00')
  await open()
  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('listbox', { name: 'Giờ' })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Giờ mở cửa' })).toHaveFocus()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateRangePicker } from './date-range-picker'

const value = { from: '2026-09-01', to: '2026-09-30' }

test('the trigger shows the range in the current language', () => {
  render(<DateRangePicker value={value} onChange={vi.fn()} />)
  expect(screen.getByRole('button', { name: /Khoảng thời gian/ })).toHaveTextContent(
    '01/09/2026 - 30/09/2026',
  )
})

test('two clicks pick a range and close the calendar', async () => {
  const onChange = vi.fn()
  render(<DateRangePicker value={value} onChange={onChange} />)
  await userEvent.click(screen.getByRole('button', { name: /Khoảng thời gian/ }))

  await userEvent.click(document.querySelector('td[data-day="2026-09-10"] button')!)
  expect(onChange).not.toHaveBeenCalled()
  await userEvent.click(document.querySelector('td[data-day="2026-09-05"] button')!)

  expect(onChange).toHaveBeenCalledWith({ from: '2026-09-05', to: '2026-09-10' })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import i18n from 'i18next'
import { LanguageToggle } from './language-toggle'

afterEach(() => {
  localStorage.clear()
  return i18n.changeLanguage('vi')
})

test('shows the current language and switches to the other one', async () => {
  render(<LanguageToggle />)
  const button = screen.getByRole('button', { name: 'Đổi ngôn ngữ' })
  expect(button).toHaveTextContent('VI')

  await userEvent.click(button)
  expect(await screen.findByRole('button', { name: 'Change language' })).toHaveTextContent('EN')
  expect(localStorage.getItem('foodfen-lang')).toBe('en')
})

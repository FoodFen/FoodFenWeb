import { FormField } from '@/components/form-field'
import { setLanguage } from '@/lib/language'
import { render, screen } from '@testing-library/react'
import { act } from 'react'

afterEach(() => act(() => setLanguage('vi')))

const renderError = (error: string) =>
  render(
    <FormField id="x" label="X" error={error}>
      <input id="x" />
    </FormField>,
  )

test('translates an error that is a translation key', async () => {
  renderError('validation:email')
  expect(screen.getByRole('alert')).toHaveTextContent('Email không hợp lệ')
  await act(() => setLanguage('en'))
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email address')
})

test('shows server text as it is, even with a colon or a dot', () => {
  renderError('Lỗi: email đã được dùng.')
  expect(screen.getByRole('alert')).toHaveTextContent('Lỗi: email đã được dùng.')
})

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { PackagePicker } from './package-picker'

const packages = [{ id: 'p1', days: 7, priceVnd: 99000 }]

const renderPicker = (approved: boolean) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <PackagePicker packages={packages} approved={approved} />
    </QueryClientProvider>,
  )

test('buying is disabled and explained until the restaurant is approved', () => {
  renderPicker(false)
  expect(screen.getByRole('button', { name: 'Mua gói' })).toBeDisabled()
  expect(screen.getByText('Quán cần được duyệt trước khi mua quảng cáo.')).toBeInTheDocument()
})

test('an approved restaurant can buy', () => {
  renderPicker(true)
  expect(screen.getByRole('button', { name: 'Mua gói' })).toBeEnabled()
})

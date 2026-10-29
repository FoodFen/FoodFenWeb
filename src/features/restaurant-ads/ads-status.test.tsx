import { render, screen } from '@testing-library/react'
import { AdsStatus } from './ads-status'

const future = new Date(Date.now() + 7 * 86_400_000).toISOString()

test('a running package of an approved restaurant is shown as advertising', () => {
  render(<AdsStatus featuredUntil={future} approved />)
  expect(screen.getByText(/^Đang quảng cáo đến/)).toBeInTheDocument()
})

test('a running package of an unapproved restaurant is shown as paused', () => {
  render(<AdsStatus featuredUntil={future} approved={false} />)
  expect(screen.getByText(/^Gói còn hạn đến .* tạm ẩn/)).toBeInTheDocument()
  expect(screen.queryByText(/^Đang quảng cáo đến/)).not.toBeInTheDocument()
})

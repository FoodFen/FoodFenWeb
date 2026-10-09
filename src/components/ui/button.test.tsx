import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders', () => {
  render(<Button>ok</Button>)
  expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument()
})

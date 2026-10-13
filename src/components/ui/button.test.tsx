import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'

test('renders', () => {
  render(<Button>ok</Button>)
  expect(screen.getByRole('button', { name: 'ok' })).toBeInTheDocument()
})

describe('buttonVariants', () => {
  const tokens = (props: Parameters<typeof buttonVariants>[0]) => buttonVariants(props).split(' ')

  test('className height replaces the size height', () => {
    const t = tokens({ className: 'h-11' })
    expect(t).toContain('h-11')
    expect(t).not.toContain('h-8')
  })

  test('hidden replaces the base display', () => {
    const t = tokens({ className: 'hidden sm:inline-flex' })
    expect(t).toContain('hidden')
    expect(t).toContain('sm:inline-flex')
    expect(t).not.toContain('inline-flex')
  })

  test('className background replaces the variant background', () => {
    const t = tokens({ variant: 'default', className: 'bg-cta' })
    expect(t).toContain('bg-cta')
    expect(t).not.toContain('bg-primary')
  })
})

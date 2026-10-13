import { buttonVariants } from '@/components/ui/button'
import { Link, type LinkProps } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

/** Ghost link above a page header; the negative margin lines its text up with the page edge. */
export function BackLink({ to, children }: { to: LinkProps['to']; children: ReactNode }) {
  return (
    <Link to={to} className={buttonVariants({ variant: 'ghost', className: '-ml-3 h-11 px-3' })}>
      <ArrowLeft aria-hidden />
      {children}
    </Link>
  )
}

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export function SwitchLink({ text, to, label }: { text: string; to: string; label: string }) {
  return (
    <p className="text-muted-foreground text-sm">
      {text}{' '}
      <Link to={to} className={buttonVariants({ variant: 'link', className: 'h-auto p-0' })}>
        {label}
      </Link>
    </p>
  )
}

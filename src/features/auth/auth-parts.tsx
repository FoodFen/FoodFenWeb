import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

type Props = { text: string; to: string; label: string; redirect?: string }

export function SwitchLink({ text, to, label, redirect }: Props) {
  return (
    <p className="text-muted-foreground text-sm">
      {text}{' '}
      <Link
        to={to}
        search={redirect ? { redirect } : undefined}
        className={buttonVariants({ variant: 'link', className: 'h-auto p-0' })}
      >
        {label}
      </Link>
    </p>
  )
}

import { Link, Outlet } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { navItemClass } from './nav-item-class'
import { ThemeToggle } from './theme-toggle'

type NavItem = { to: string; label: string; icon: LucideIcon; exact?: boolean }

export function AppShell({
  title,
  nav,
  footer,
}: {
  title: string
  nav: NavItem[]
  footer?: ReactNode
}) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[14rem_1fr]">
      <nav
        aria-label={title}
        className="bg-sidebar fixed inset-x-0 bottom-0 z-10 flex justify-around border-t p-1 md:sticky md:top-0 md:h-dvh md:flex-col md:justify-start md:gap-1 md:border-t-0 md:border-r md:p-3"
      >
        <Link to="/" className="text-primary hidden px-3 py-4 text-xl font-semibold md:block">
          {title}
        </Link>
        {nav.map(({ to, label, icon: Icon, exact }) => (
          <Link key={to} to={to} activeOptions={{ exact }} className={navItemClass}>
            <Icon className="size-5" aria-hidden />
            {label}
          </Link>
        ))}
        <ThemeToggle showLabel className={navItemClass} />
        {footer}
      </nav>
      <main className="p-4 pb-20 md:p-8 md:pb-8">
        <Outlet />
      </main>
    </div>
  )
}

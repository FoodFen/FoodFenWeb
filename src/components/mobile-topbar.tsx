import { Link } from '@tanstack/react-router'
import { LanguageToggle } from './language-toggle'
import { ThemeToggle } from './theme-toggle'
import { SidebarTrigger } from './ui/sidebar'

export function MobileTopbar() {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 items-center gap-2 border-b px-2 md:hidden">
      <SidebarTrigger className="size-11" />
      <Link to="/" className="text-primary rounded-md text-lg font-semibold">
        FoodFen
      </Link>
      <LanguageToggle className="ml-auto" />
      <ThemeToggle />
    </header>
  )
}

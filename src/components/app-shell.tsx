import { Outlet } from '@tanstack/react-router'
import { AppSidebar } from './app-sidebar'
import { MobileTopbar } from './mobile-topbar'
import { SidebarProvider } from './ui/sidebar'

// `open` pins the desktop sidebar: there is no desktop toggle, so the Ctrl+B shortcut must not hide it.
export function AppShell() {
  return (
    <SidebarProvider open>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

import { Link } from '@tanstack/react-router'
import { wrap } from './shared'

export function Footer() {
  return (
    <footer className="border-t">
      <div
        className={`${wrap} text-muted-foreground flex flex-wrap items-center justify-between gap-4 py-8 text-sm`}
      >
        <span className="text-primary font-semibold">FoodFen</span>
        <Link to="/restaurant" className="hover:text-foreground flex h-11 items-center">
          Đăng ký quán
        </Link>
        <span>© FoodFen</span>
      </div>
    </footer>
  )
}

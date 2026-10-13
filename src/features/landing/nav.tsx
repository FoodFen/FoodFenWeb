import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { wrap } from './shared'

const links = [
  { href: '#tinh-nang', id: 'features' },
  { href: '#cach-hoat-dong', id: 'how' },
  { href: '#hoi-dap', id: 'faq' },
] as const
const sectionIds = links.map((l) => l.href.slice(1))

function useActiveSection() {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`)
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    }
    return () => io.disconnect()
  }, [])
  return active
}

export function Nav() {
  const { t } = useTranslation('landing')
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))
  const active = useActiveSection()
  const [hover, setHover] = useState<string | null>(null)
  const reduce = useReducedMotion()
  const bar = hover ?? (scrolled ? active : null)

  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-background/95 shadow-sm' : 'bg-background/70'
      }`}
    >
      <div
        className={`${wrap} flex items-center justify-between gap-2 transition-[height] duration-300 sm:gap-4 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <Link to="/" className="text-primary text-xl font-semibold">
          FoodFen
        </Link>

        <nav
          aria-label={t('header.label')}
          className="text-muted-foreground hidden gap-6 text-sm md:flex"
          onMouseLeave={() => setHover(null)}
        >
          {links.map(({ href, id }) => (
            <a
              key={href}
              href={href}
              onMouseEnter={() => setHover(href)}
              onFocus={() => setHover(href)}
              onBlur={() => setHover(null)}
              className={`relative flex items-center gap-1.5 px-1 py-2 transition-colors ${bar === href ? 'text-foreground' : ''}`}
            >
              {t(`header.links.${id}`)}
              {bar === href && (
                <motion.span
                  layoutId="nav-bar"
                  aria-hidden
                  className="bg-primary absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full"
                  transition={
                    reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }
                  }
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Link
            to="/login"
            className={buttonVariants({
              variant: 'ghost',
              className:
                'after:bg-primary relative h-11 px-3 text-sm after:absolute after:inset-x-3 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:transition-transform after:duration-300 hover:after:scale-x-100',
            })}
          >
            {t('cta.signIn')}
          </Link>
          <Link
            to="/restaurant"
            className={buttonVariants({
              variant: 'ghost',
              className: 'h-11 px-3 text-sm max-lg:hidden',
            })}
          >
            {t('cta.registerRestaurant')}
          </Link>
          <Link
            to="/register"
            className={buttonVariants({
              className:
                'relative h-11 overflow-hidden px-4 text-sm before:absolute before:inset-y-0 before:-left-1/2 before:w-1/3 before:-skew-x-12 before:bg-white/30 before:transition-transform before:duration-700 hover:before:translate-x-[450%] motion-reduce:before:hidden max-sm:hidden',
            })}
          >
            {t('cta.tryFree')}
          </Link>
        </div>
      </div>
    </header>
  )
}

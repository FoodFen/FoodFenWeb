import { motion, useScroll } from 'motion/react'
import { Faq } from './faq'
import { Features } from './features'
import { FinalCta } from './final-cta'
import { Footer } from './footer'
import { Hero } from './hero'
import { Nav } from './nav'
import { PhotoBand } from './photo-band'
import { Premium } from './premium'
import { Stats } from './stats'
import { Steps } from './steps'
import { Testimonials } from './testimonials'

export function LandingPage() {
  const { scrollYProgress } = useScroll()
  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="bg-primary fixed inset-x-0 top-0 z-30 h-0.5 origin-left"
      />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <PhotoBand />
        <Features />
        <Steps />
        <Testimonials />
        <Premium />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}

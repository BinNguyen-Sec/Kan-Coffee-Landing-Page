'use client'

import { motion } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function Hero() {
  const handleReserve = () => {
    const el = document.querySelector('#floorplan')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-kan-offwhite overflow-hidden px-6">

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #4D8E00 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="text-sm font-medium tracking-[0.2em] text-kan-primary uppercase mb-6"
        >
          Café & Co-working Space · Ho Chi Minh City
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="font-display text-6xl md:text-8xl font-bold text-kan-dark leading-tight mb-6"
        >
          Where every
          <br />
          <span className="text-kan-primary italic">cup</span> tells
          <br />
          a story.
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="text-lg md:text-xl text-kan-dark/70 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          A space to slow down, focus, and be yourself.
          <br />
          <span className="font-semibold text-kan-dark">I C — I Can.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleReserve}
            className="px-8 py-4 bg-kan-primary text-kan-offwhite font-medium rounded-full hover:bg-kan-dark transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-kan-primary/30"
          >
            Reserve a Table
          </button>
          <button
            onClick={() => {
              const el = document.querySelector('#story')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 border border-kan-primary text-kan-primary font-medium rounded-full hover:bg-kan-primary hover:text-kan-offwhite transition-all duration-300"
          >
            Our Story
          </button>
        </motion.div>

        {/* Opening hours badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
          className="mt-12 inline-flex items-center gap-2 px-4 py-2 bg-kan-light/30 border border-kan-light rounded-full"
        >
          <span className="w-2 h-2 rounded-full bg-kan-primary animate-pulse" />
          <span className="text-sm text-kan-dark/70">
            Open daily · 07:00 – 23:30
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-kan-dark/40 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-0.5 h-8 bg-gradient-to-b from-kan-primary to-transparent"
        />
      </motion.div>
    </section>
  )
}
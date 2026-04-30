'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const storyBlocks = [
  {
    year: '2023',
    label: 'The Beginning',
    content:
      'Đăng Phạm and his teammates — friends from school, colleagues, and people who shared the same passion for F&B — found themselves lost in the industry\'s routine. They didn\'t know where to go or what to do next. Then coffee and tea arrived. Not loudly, not dramatically. Just a new direction, quietly pulling them away from the old path.',
  },
  {
    year: '2024',
    label: 'Two Years of Craft',
    content:
      'Two years of preparation. Sourcing robusta beans carefully selected from Buon Me Thuot with expert partners. Crafting fruit teas — lychee oolong, longan pineapple leaf oolong — and unique lattes like strawberry cheese and mango matcha. Every recipe tested hundreds of times. Not to build a perfect menu, but to create drinks they genuinely wanted to drink every day.',
  },
  {
    year: '2025',
    label: 'Kan is Born',
    content:
      'Late 2025. Kan Coffee officially opened its doors. The name carries a hidden message — the letters I and C interlocked to form the K in Kan. I Can. A quiet declaration for the team on hard days, and for every person who walks through the door.',
  },
  {
    year: 'Now',
    label: 'Every Cup, a Story',
    content:
      'Kan is not just about coffee. It\'s a minimal experience — no VIP tiers, because every guest is a VIP. A space that is fresh and energetic, yet still enough to let you slow down, settle your thoughts, and start the day with intention. Thousands of cups. Thousands of stories. And you are part of them.',
  },
]

function StoryBlock({
  block,
  index,
}: {
  block: (typeof storyBlocks)[0]
  index: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease, delay: 0.1 }}
      className={`flex flex-col md:flex-row items-start gap-8 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Year marker */}
      <div className="flex-shrink-0 flex flex-col items-center md:items-end md:w-32">
        <span className="font-display text-5xl font-bold text-kan-primary/20 leading-none">
          {block.year}
        </span>
        <span className="text-xs font-medium tracking-widest text-kan-primary uppercase mt-1">
          {block.label}
        </span>
      </div>

      {/* Divider dot */}
      <div className="hidden md:flex flex-col items-center gap-0 self-stretch">
        <div className="w-3 h-3 rounded-full bg-kan-primary mt-3 flex-shrink-0" />
        <div className="w-px flex-1 bg-kan-light mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 pb-12">
        <p className="text-base md:text-lg text-kan-dark/75 leading-relaxed">
          {block.content}
        </p>
      </div>
    </motion.div>
  )
}

export default function InspiredStory() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section
      id="story"
      className="py-24 md:py-32 bg-kan-offwhite px-6"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-20"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-kan-primary uppercase mb-4">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-kan-dark leading-tight">
            Born from a cup,
            <br />
            <span className="text-kan-primary italic">built with purpose.</span>
          </h2>
          <p className="mt-6 text-kan-dark/60 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            A two-year journey from uncertainty to a space where everyone belongs.
          </p>
        </motion.div>

        {/* Story blocks */}
        <div className="relative">
          {storyBlocks.map((block, index) => (
            <StoryBlock key={block.year} block={block} index={index} />
          ))}
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
          className="mt-8 text-center border-t border-kan-light pt-12"
        >
          <p className="font-display text-2xl md:text-3xl font-bold text-kan-dark">
            "I C —{' '}
            <span className="text-kan-primary italic">ICan.</span>"
          </p>
          <p className="mt-4 text-kan-dark/50 text-sm tracking-widest uppercase">
            Kan Coffee · Est. 2025
          </p>
        </motion.div>
      </div>
    </section>
  )
}
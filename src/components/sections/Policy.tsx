'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const ease = [0.25, 0.1, 0.25, 1] as const

const faqs = [
  {
    q: 'How do I reserve a table?',
    a: 'Scroll up to the Floor Plan section, click any available table (green), fill in your details and submit. You will receive a confirmation email once the owner approves.',
  },
  {
    q: 'How long does confirmation take?',
    a: 'Usually within 15–30 minutes during opening hours. If your booking is not confirmed within 15 minutes, it will be automatically released.',
  },
  {
    q: 'Can I cancel my reservation?',
    a: 'Please contact us via phone or email at least 30 minutes before your reservation time. Walk-in tables are always available without booking.',
  },
  {
    q: 'What is the maximum stay duration?',
    a: 'You can reserve a table for 1, 1.5, or 2 hours. After your reservation period, the table may be needed for other guests.',
  },
  {
    q: 'Is there a minimum order?',
    a: 'There is no minimum order requirement. We simply ask that each guest orders at least one item to enjoy the space.',
  },
  {
    q: 'Do you have WiFi?',
    a: 'Yes! Kan Coffee is a cafe and co-working space with stable, high-speed WiFi — perfect for studying or remote work.',
  },
  {
    q: 'Can I book the outdoor area?',
    a: 'Outdoor tables are walk-in only and cannot be reserved in advance. They are available on a first-come, first-served basis.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-kan-light last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="text-sm font-medium text-kan-dark">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-5 h-5 rounded-full border border-kan-light flex items-center justify-center text-kan-primary text-sm"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <p className="text-sm text-kan-dark/60 leading-relaxed pb-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Policy() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="policy" className="py-24 md:py-32 bg-kan-offwhite px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-kan-primary uppercase mb-4">
            Info & Policy
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-kan-dark">
            Everything you need
            <br />
            <span className="text-kan-primary italic">to know.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">

          {/* Left — Contact + Hours */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Opening Hours */}
            <div>
              <h3 className="text-xs font-medium tracking-widest text-kan-primary uppercase mb-4">
                Opening Hours
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-kan-light">
                  <span className="text-sm text-kan-dark">Monday — Sunday</span>
                  <span className="text-sm font-medium text-kan-dark">07:00 – 23:30</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-kan-dark/60">Last order</span>
                  <span className="text-sm text-kan-dark/60">22:30</span>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-kan-primary animate-pulse" />
                <span className="text-xs text-kan-dark/50">Open today</span>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xs font-medium tracking-widest text-kan-primary uppercase mb-4">
                Address
              </h3>
              <a
                href="https://maps.google.com/?q=35+D5,+Ward+25,+Thanh+My+Tay,+Ho+Chi+Minh+City"
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <p className="text-sm text-kan-dark leading-relaxed group-hover:text-kan-primary transition-colors">
                  35 D5, Phuong 25
                  <br />
                  Thanh My Tay, Ho Chi Minh
                  <br />
                  700000, Vietnam
                </p>
                <span className="text-xs text-kan-primary mt-2 inline-block group-hover:underline">
                  View on Google Maps
                </span>
              </a>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-medium tracking-widest text-kan-primary uppercase mb-4">
                Contact
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-kan-primary text-sm">Phone:</span>
                  <span className="text-sm text-kan-dark/60">TBD — coming soon</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-kan-primary text-sm">Email:</span>
                  <span className="text-sm text-kan-dark/60">TBD — coming soon</span>
                </div>
              </div>
            </div>

            {/* Reservation Policy */}
            <div>
              <h3 className="text-xs font-medium tracking-widest text-kan-primary uppercase mb-4">
                Reservation Policy
              </h3>
              <ul className="space-y-2">
                {[
                  'Bookings are confirmed manually by our team',
                  'Unconfirmed bookings are released after 15 minutes',
                  'Please arrive within 10 minutes of your reserved time',
                  'Cancellations must be made 30 minutes in advance',
                  'Outdoor tables are walk-in only',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-kan-dark/60">
                    <span className="text-kan-primary mt-0.5 flex-shrink-0">-</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right — FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <h3 className="text-xs font-medium tracking-widest text-kan-primary uppercase mb-6">
              Frequently Asked Questions
            </h3>
            <div>
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="mt-20 pt-10 border-t border-kan-light text-center"
        >
          <p className="font-display text-2xl font-bold text-kan-dark">
            Kan<span className="text-kan-primary">.</span>
          </p>
          <p className="text-xs text-kan-dark/40 mt-2 tracking-widest uppercase">
            I C - I Can - Est. 2025
          </p>
          <p className="text-xs text-kan-dark/30 mt-4">
            2025 Kan Coffee. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
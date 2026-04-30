'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Table } from '@/types/table'
import type { CreateBookingInput } from '@/types/booking'
import BookingForm from './BookingForm'

interface BookingModalProps {
  table: Table | null
  onClose: () => void
  onSubmit: (input: CreateBookingInput) => void
  isLoading: boolean
  isSuccess: boolean
}

export default function BookingModal({
  table,
  onClose,
  onSubmit,
  isLoading,
  isSuccess,
}: BookingModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (table) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [table])

  return (
    <AnimatePresence>
      {table && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-kan-dark/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 bg-kan-offwhite rounded-2xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-kan-light">
              <div>
                <h2 className="font-display text-xl font-bold text-kan-dark">
                  Reserve a Table
                </h2>
                <p className="text-xs text-kan-dark/50 mt-0.5">
                  Awaiting owner confirmation after submission
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-kan-light/50 transition-colors text-kan-dark/50 hover:text-kan-dark"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-kan-light/40 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">☕</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-kan-dark mb-2">
                    Booking Submitted!
                  </h3>
                  <p className="text-sm text-kan-dark/60 leading-relaxed">
                    We've received your reservation request.
                    You'll receive an email confirmation once the owner approves.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-3 bg-kan-primary text-white rounded-xl text-sm font-medium hover:bg-kan-dark transition-colors"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <BookingForm
                  table={table}
                  onSubmit={onSubmit}
                  isLoading={isLoading}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
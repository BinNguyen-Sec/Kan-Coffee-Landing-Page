'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRealtimeTables } from '@/hooks/useRealtimeTables'
import { useBooking } from '@/hooks/useBooking'
import TableMap from '@/components/booking/TableMap'
import BookingModal from '@/components/booking/BookingModal'
import type { Table } from '@/types/table'
import type { CreateBookingInput } from '@/types/booking'

const ease = [0.25, 0.1, 0.25, 1] as const

export default function FloorPlan() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const { tables, loading, error } = useRealtimeTables()
  const { state, errorMessage, submitBooking, reset } = useBooking()
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const handleTableClick = (table: Table) => {
    if (table.status !== 'available' || !table.is_bookable) return
    reset()
    setSelectedTable(table)
  }

  const handleModalClose = () => {
    setSelectedTable(null)
    reset()
  }

  const handleSubmit = async (input: CreateBookingInput) => {
    const success = await submitBooking(input)
    if (success) {
      // Modal stays open to show success state
    }
  }

  return (
    <section id="floorplan" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-14"
        >
          <p className="text-sm font-medium tracking-[0.2em] text-kan-primary uppercase mb-4">
            Reserve a Table
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-kan-dark">
            Find your perfect spot.
          </h2>
          <p className="mt-4 text-kan-dark/60 max-w-md mx-auto text-base leading-relaxed">
            Click any available table to reserve. Real-time availability —
            updated instantly.
          </p>
        </motion.div>

        {/* Map */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-kan-primary border-t-transparent animate-spin" />
              <p className="text-sm text-kan-dark/50">Loading floor plan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-500 text-sm">
            Failed to load floor plan. Please refresh.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <TableMap tables={tables} onTableClick={handleTableClick} />
          </motion.div>
        )}

        {/* Error message */}
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-red-500 mt-4"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        table={selectedTable}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        isLoading={state === 'loading'}
        isSuccess={state === 'success'}
      />
    </section>
  )
}   
'use client'

import { useState } from 'react'
import type { CreateBookingInput } from '@/types/booking'

type BookingState = 'idle' | 'loading' | 'success' | 'error'

export function useBooking() {
  const [state, setState] = useState<BookingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const submitBooking = async (input: CreateBookingInput) => {
    setState('loading')
    setErrorMessage(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error?.message ?? 'Something went wrong.')
        setState('error')
        return false
      }

      setState('success')
      return true
    } catch {
      setErrorMessage('Network error. Please try again.')
      setState('error')
      return false
    }
  }

  const reset = () => {
    setState('idle')
    setErrorMessage(null)
  }

  return { state, errorMessage, submitBooking, reset }
}   
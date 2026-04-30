'use client'

import { useState } from 'react'
import type { Table } from '@/types/table'
import type { CreateBookingInput, DurationMin } from '@/types/booking'
import { BOOKING_CONFIG } from '@/constants/config'

interface BookingFormProps {
  table: Table
  onSubmit: (input: CreateBookingInput) => void
  isLoading: boolean
}

export default function BookingForm({
  table,
  onSubmit,
  isLoading,
}: BookingFormProps) {
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    guest_name: '',
    phone: '',
    email: '',
    date: today,
    start_time: '09:00',
    duration_min: 90 as DurationMin,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof form, string>> = {}

    if (form.guest_name.length < 2)
      newErrors.guest_name = 'Name must be at least 2 characters.'
    if (!/^0\d{9,10}$/.test(form.phone))
      newErrors.phone = 'Phone must be 10–11 digits starting with 0.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format.'
    if (!form.date || form.date < today)
      newErrors.date = 'Date cannot be in the past.'

    const [h, m] = form.start_time.split(':').map(Number)
    const minutes = h * 60 + m
    if (minutes < 7 * 60 || minutes > 22 * 60 + 30)
      newErrors.start_time = 'Time must be between 07:00 and 22:30.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({ ...form, table_id: table.id })
  }

  const inputClass = (field: keyof typeof errors) =>
    `w-full px-4 py-3 rounded-xl border text-sm text-kan-dark bg-white outline-none transition-colors duration-200 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-kan-light focus:border-kan-primary'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Table info */}
      <div className="flex items-center gap-3 p-3 bg-kan-light/20 rounded-xl border border-kan-light">
        <div className="w-3 h-3 rounded-full bg-kan-primary" />
        <div>
          <p className="text-sm font-medium text-kan-dark">
            Table {table.name}
          </p>
          <p className="text-xs text-kan-dark/50">
            Floor {table.floor} · Indoor · Up to {table.capacity} guests
          </p>
        </div>
      </div>

      {/* Guest name */}
      <div>
        <label className="block text-xs font-medium text-kan-dark/60 mb-1">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Nguyen Van A"
          value={form.guest_name}
          onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
          className={inputClass('guest_name')}
        />
        {errors.guest_name && (
          <p className="text-xs text-red-500 mt-1">{errors.guest_name}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-medium text-kan-dark/60 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          placeholder="0909123456"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={inputClass('phone')}
        />
        {errors.phone && (
          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-kan-dark/60 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-kan-dark/60 mb-1">
            Date
          </label>
          <input
            type="date"
            min={today}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass('date')}
          />
          {errors.date && (
            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-kan-dark/60 mb-1">
            Time
          </label>
          <input
            type="time"
            min="07:00"
            max="22:30"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className={inputClass('start_time')}
          />
          {errors.start_time && (
            <p className="text-xs text-red-500 mt-1">{errors.start_time}</p>
          )}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-xs font-medium text-kan-dark/60 mb-1">
          Duration
        </label>
        <div className="flex gap-2">
          {BOOKING_CONFIG.durations.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm({ ...form, duration_min: d })}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                form.duration_min === d
                  ? 'bg-kan-primary text-white border-kan-primary'
                  : 'bg-white text-kan-dark border-kan-light hover:border-kan-primary'
              }`}
            >
              {d === 60 ? '1h' : d === 90 ? '1.5h' : '2h'}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-kan-primary text-white font-medium rounded-xl hover:bg-kan-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
      >
        {isLoading ? 'Submitting...' : 'Confirm Reservation'}
      </button>
    </form>
  )
}
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type DurationMin = 60 | 90 | 120

export interface Booking {
  id: string
  table_id: string
  guest_name: string
  phone: string
  email: string
  date: string
  start_time: string
  duration_min: DurationMin
  status: BookingStatus
  created_at: string
  expires_at: string
}

export interface CreateBookingInput {
  table_id: string
  guest_name: string
  phone: string
  email: string
  date: string
  start_time: string
  duration_min: DurationMin
}
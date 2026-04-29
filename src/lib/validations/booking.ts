import { z } from 'zod'

export const createBookingSchema = z.object({
  table_id: z
    .string()
    .uuid({ message: 'Invalid table ID.' }),

  guest_name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(100, { message: 'Name must be at most 100 characters.' }),

  phone: z
    .string()
    .regex(/^0\d{9,10}$/, {
      message: 'Phone number must be 10–11 digits starting with 0.',
    }),

  email: z
    .string()
    .email({ message: 'Invalid email format.' })
    .max(254, { message: 'Email is too long.' }),

  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be YYYY-MM-DD.' })
    .refine((val) => new Date(val) >= new Date(new Date().toDateString()), {
      message: 'Date cannot be in the past.',
    }),

  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be HH:MM.' })
    .refine(
      (val) => {
        const [h, m] = val.split(':').map(Number)
        const minutes = h * 60 + m
        return minutes >= 7 * 60 && minutes <= 22 * 60 + 30
      },
      { message: 'Booking time must be between 07:00 and 22:30.' }
    ),

  duration_min: z
    .number()
    .refine((val) => [60, 90, 120].includes(val), {
      message: 'Duration must be 60, 90, or 120 minutes.',
    }),
})

export type CreateBookingSchema = z.infer<typeof createBookingSchema>
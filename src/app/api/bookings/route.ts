import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createBookingSchema } from '@/lib/validations/booking'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const result = createBookingSchema.safeParse(body)
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed.',
            details: { fields },
          },
        },
        { status: 400 }
      )
    }

    const input = result.data

    // Check table is bookable
    const { data: table } = await supabaseAdmin
      .from('tables')
      .select('name, status, is_bookable')
      .eq('id', input.table_id)
      .single()

    if (!table) {
      return NextResponse.json(
        { success: false, error: { code: 'TABLE_NOT_FOUND', message: 'Table not found.' } },
        { status: 404 }
      )
    }

    if (!table.is_bookable) {
      return NextResponse.json(
        { success: false, error: { code: 'TABLE_NOT_BOOKABLE', message: 'This table is walk-in only.' } },
        { status: 400 }
      )
    }

    if (table.status !== 'available') {
      return NextResponse.json(
        { success: false, error: { code: 'TABLE_UNAVAILABLE', message: 'This table is no longer available.' } },
        { status: 409 }
      )
    }

    // Insert booking
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert(input)
      .select()
      .single()

    if (error) {
      // Double booking caught by DB trigger
      if (error.message.includes('already booked')) {
        return NextResponse.json(
          { success: false, error: { code: 'BOOKING_OVERLAP', message: 'This time slot is already booked.' } },
          { status: 409 }
        )
      }
      throw error
    }

    // Zalo Bot notification
try {
  const { notifyZaloGroup } = await import('@/lib/zalo/notify')
  await notifyZaloGroup({
    table_name: table.name,
    guest_name: input.guest_name,
    phone: input.phone,
    date: input.date,
    start_time: input.start_time,
    duration_min: input.duration_min,
  })
} catch (err) {
  // Non-blocking — booking still succeeds even if Zalo fails
  console.error('[Zalo] Notification failed:', err)
}

    return NextResponse.json(
      {
        success: true,
        data: booking,
        meta: { message: 'Booking submitted. Awaiting owner confirmation.' },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create booking.' } },
      { status: 500 }
    )
  }
}
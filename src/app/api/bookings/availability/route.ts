import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const table_id = searchParams.get('table_id')
    const date = searchParams.get('date')
    const start_time = searchParams.get('start_time')
    const duration_min = searchParams.get('duration_min')

    if (!table_id || !date || !start_time || !duration_min) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required parameters.' } },
        { status: 400 }
      )
    }

    // Check table exists and is bookable
    const { data: table } = await supabase
      .from('tables')
      .select('name, status, is_bookable')
      .eq('id', table_id)
      .single()

    if (!table || !table.is_bookable || table.status !== 'available') {
      return NextResponse.json({
        success: true,
        data: { available: false, reason: 'TABLE_UNAVAILABLE' },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        available: true,
        table_id,
        table_name: table.name,
        date,
        start_time,
        duration_min: parseInt(duration_min),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to check availability.' } },
      { status: 500 }
    )
  }
}
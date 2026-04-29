import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const floor = searchParams.get('floor')
    const zone = searchParams.get('zone')
    const bookable = searchParams.get('bookable')

    let query = supabase.from('tables').select('*')

    if (floor) query = query.eq('floor', parseInt(floor))
    if (zone) query = query.eq('zone', zone)
    if (bookable === 'true') query = query.eq('is_bookable', true)

    const { data, error } = await query.order('name')

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      meta: { total: data.length },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch tables.' } },
      { status: 500 }
    )
  }
}
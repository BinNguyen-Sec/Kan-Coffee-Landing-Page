interface BookingPayload {
  table_name: string
  guest_name: string
  phone: string
  date: string
  start_time: string
  duration_min: number
}

function formatBookingMessage(booking: BookingPayload): string {
  const endHour = (() => {
    const [h, m] = booking.start_time.split(':').map(Number)
    const total = h * 60 + m + booking.duration_min
    const endH = Math.floor(total / 60)
    const endM = total % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  })()

  return [
    '🔔 New Booking — Kan Coffee',
    '',
    `📋 Table:  ${booking.table_name}`,
    `👤 Guest:  ${booking.guest_name}`,
    `📞 Phone:  ${booking.phone}`,
    `📅 Date:   ${booking.date}`,
    `⏰ Time:   ${booking.start_time} – ${endHour} (${booking.duration_min} min)`,
    '',
    '⚠️  Please confirm or cancel in Supabase Studio.',
  ].join('\n')
}

export async function notifyZaloGroup(booking: BookingPayload): Promise<void> {
  const token = process.env.ZALO_BOT_ACCESS_TOKEN
  const groupId = process.env.ZALO_GROUP_ID

  if (!token || !groupId) {
    console.warn('[Zalo] Missing ZALO_BOT_ACCESS_TOKEN or ZALO_GROUP_ID')
    return
  }

  const message = formatBookingMessage(booking)

  try {
    const res = await fetch('https://openapi.zalo.me/v2.0/oa/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': token,
      },
      body: JSON.stringify({
        recipient: { group_id: groupId },
        message: { text: message },
      }),
    })

    const data = await res.json()

    if (data.error !== 0) {
      console.error('[Zalo] Failed to send notification:', data)
    } else {
      console.log('[Zalo] Notification sent successfully')
    }
  } catch (err) {
    console.error('[Zalo] Network error:', err)
  }
}
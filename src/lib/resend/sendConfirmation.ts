import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ConfirmationPayload {
  guest_name: string
  email: string
  table_name: string
  floor: number
  date: string
  start_time: string
  duration_min: number
}

interface OwnerNotificationPayload {
  table_name: string
  floor: number
  guest_name: string
  phone: string
  email: string
  date: string
  start_time: string
  duration_min: number
}

function getEndTime(start_time: string, duration_min: number): string {
  const [h, m] = start_time.split(':').map(Number)
  const total = h * 60 + m + duration_min
  const endH = Math.floor(total / 60)
  const endM = total % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

export async function sendConfirmationEmail(payload: ConfirmationPayload) {
  const endTime = getEndTime(payload.start_time, payload.duration_min)

  try {
    const { data, error } = await resend.emails.send({
      from: 'Kan Coffee <onboarding@resend.dev>',
      to: payload.email,
      subject: 'Your table at Kan Coffee is confirmed!',
      html: `
        <div style="font-family:Arial,sans-serif;background:#F9FBF6;padding:40px 20px;">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
            <div style="background:#4D8E00;padding:32px;text-align:center;">
              <p style="color:#fff;font-size:28px;font-weight:bold;margin:0;">Kan.</p>
              <p style="color:#A0C060;font-size:12px;letter-spacing:3px;margin:8px 0 0;">I C - I Can</p>
            </div>
            <div style="padding:40px 32px;">
              <p style="font-size:22px;font-weight:bold;color:#315D02;margin:0 0 8px;">Your table is confirmed!</p>
              <p style="font-size:14px;color:#666;margin:0 0 32px;">Hi ${payload.guest_name}, we are happy to confirm your reservation at Kan Coffee.</p>
              <div style="background:#F9FBF6;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Table</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.table_name} - Floor ${payload.floor} (Indoor AC)</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Date</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.date}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Time</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0;">${payload.start_time} to ${endTime} (${payload.duration_min} min)</p>
              </div>
              <div style="background:#FFF9E6;border-radius:8px;padding:16px;">
                <p style="font-size:13px;color:#856404;margin:0;">Please arrive within <strong>10 minutes</strong> of your reservation time.</p>
              </div>
            </div>
            <div style="background:#F9FBF6;padding:24px 32px;text-align:center;border-top:1px solid #E8F5D0;">
              <p style="font-size:12px;color:#999;margin:0;">Kan Coffee - 35 D5, Ward 25, Thanh My Tay, Ho Chi Minh City</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Resend] Failed to send confirmation email:', error)
      return false
    }

    console.log('[Resend] Confirmation email sent:', data?.id)
    return true
  } catch (err) {
    console.error('[Resend] Error:', err)
    return false
  }
}

export async function sendOwnerNotificationEmail(payload: OwnerNotificationPayload) {
  const endTime = getEndTime(payload.start_time, payload.duration_min)

  try {
    const { data, error } = await resend.emails.send({
      from: 'Kan Coffee <onboarding@resend.dev>',
      to: 'taodangbuon1602@gmail.com',
      subject: `New Booking - ${payload.table_name} | ${payload.date} ${payload.start_time}`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#F9FBF6;padding:40px 20px;">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
            <div style="background:#FFC107;padding:24px 32px;">
              <p style="color:#856404;font-size:13px;font-weight:bold;margin:0;text-transform:uppercase;letter-spacing:2px;">New Booking Request</p>
              <p style="color:#533f03;font-size:22px;font-weight:bold;margin:4px 0 0;">Kan Coffee</p>
            </div>
            <div style="padding:32px;">
              <p style="font-size:14px;color:#666;margin:0 0 24px;">A new reservation has been submitted. Please confirm or cancel in Supabase Studio.</p>
              <div style="background:#F9FBF6;border-radius:12px;padding:24px;margin-bottom:24px;">
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Table</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.table_name} - Floor ${payload.floor}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Guest</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.guest_name}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Phone</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.phone}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Email</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.email}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Date</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0 0 12px;">${payload.date}</p>
                <p style="font-size:11px;color:#80AE4A;text-transform:uppercase;letter-spacing:2px;margin:0 0 4px;">Time</p>
                <p style="font-size:15px;color:#315D02;font-weight:bold;margin:0;">${payload.start_time} to ${endTime} (${payload.duration_min} min)</p>
              </div>
              <div style="text-align:center;">
                <a href="https://supabase.com/dashboard" style="display:inline-block;background:#4D8E00;color:#fff;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:bold;text-decoration:none;">
                  Open Supabase Studio
                </a>
              </div>
            </div>
            <div style="background:#F9FBF6;padding:20px 32px;text-align:center;border-top:1px solid #E8F5D0;">
              <p style="font-size:12px;color:#999;margin:0;">Kan Coffee - Internal Notification</p>
            </div>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[Resend] Failed to send owner notification:', error)
      return false
    }

    console.log('[Resend] Owner notification sent:', data?.id)
    return true
  } catch (err) {
    console.error('[Resend] Error:', err)
    return false
  }
}
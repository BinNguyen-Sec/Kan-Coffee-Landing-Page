import { Resend } from 'resend'
import { BookingConfirmation } from '../../../emails/BookingConfirmation'

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

export async function sendConfirmationEmail(payload: ConfirmationPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Kan Coffee <onboarding@resend.dev>',
      to: payload.email,
      subject: 'Your table at Kan Coffee is confirmed!',
      react: BookingConfirmation(payload),
    })

    if (error) {
      console.error('[Resend] Failed to send email:', error)
      return false
    }

    console.log('[Resend] Email sent:', data?.id)
    return true
  } catch (err) {
    console.error('[Resend] Error:', err)
    return false
  }
}
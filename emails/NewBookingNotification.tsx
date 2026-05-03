import * as React from 'react'

interface NewBookingNotificationProps {
  table_name: string
  floor: number
  guest_name: string
  phone: string
  email: string
  date: string
  start_time: string
  duration_min: number
}

export function NewBookingNotification({
  table_name,
  floor,
  guest_name,
  phone,
  email,
  date,
  start_time,
  duration_min,
}: NewBookingNotificationProps) {
  const endTime = (() => {
    const [h, m] = start_time.split(':').map(Number)
    const total = h * 60 + m + duration_min
    const endH = Math.floor(total / 60)
    const endM = total % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  })()

  const supabaseUrl = 'https://supabase.com/dashboard'

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F9FBF6', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F9FBF6', padding: '40px 20px' }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: '#FFC107', padding: '24px 32px' }}>
                    <p style={{ color: '#856404', fontSize: '13px', fontWeight: 'bold', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
                      New Booking Request
                    </p>
                    <p style={{ color: '#533f03', fontSize: '22px', fontWeight: 'bold', margin: '4px 0 0' }}>
                      Kan Coffee
                    </p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '32px' }}>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px', lineHeight: '1.6' }}>
                      A new table reservation has been submitted. Please confirm or cancel in Supabase Studio.
                    </p>

                    {/* Booking details */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F9FBF6', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                      <tr>
                        <td style={{ paddingBottom: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Table</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>
                            {table_name} - Floor {floor} (Indoor AC)
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', borderTop: '1px solid #E8F5D0', paddingTop: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Guest</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>{guest_name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', borderTop: '1px solid #E8F5D0', paddingTop: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Phone</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>{phone}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', borderTop: '1px solid #E8F5D0', paddingTop: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Email</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>{email}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '12px', borderTop: '1px solid #E8F5D0', paddingTop: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Date</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>{date}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ borderTop: '1px solid #E8F5D0', paddingTop: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Time</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>
                            {start_time} to {endTime} ({duration_min} min)
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* CTA */}
                    <table width="100%" cellPadding={0} cellSpacing={0}>
                      <tr>
                        <td align="center">
                          <a
                            href={supabaseUrl}
                            style={{
                              display: 'inline-block',
                              backgroundColor: '#4D8E00',
                              color: '#ffffff',
                              padding: '14px 32px',
                              borderRadius: '50px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              textDecoration: 'none',
                            }}
                          >
                            Open Supabase Studio
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: '#F9FBF6', padding: '20px 32px', textAlign: 'center', borderTop: '1px solid #E8F5D0' }}>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Kan Coffee - Internal Notification
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
}
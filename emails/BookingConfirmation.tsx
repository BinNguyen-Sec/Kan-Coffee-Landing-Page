import * as React from 'react'

interface BookingConfirmationProps {
  guest_name: string
  table_name: string
  floor: number
  date: string
  start_time: string
  duration_min: number
}

export function BookingConfirmation({
  guest_name,
  table_name,
  floor,
  date,
  start_time,
  duration_min,
}: BookingConfirmationProps) {
  const endTime = (() => {
    const [h, m] = start_time.split(':').map(Number)
    const total = h * 60 + m + duration_min
    const endH = Math.floor(total / 60)
    const endM = total % 60
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
  })()

  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F9FBF6', margin: 0, padding: 0 }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F9FBF6', padding: '40px 20px' }}>
          <tr>
            <td align="center">
              <table width="560" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

                {/* Header */}
                <tr>
                  <td style={{ backgroundColor: '#4D8E00', padding: '32px', textAlign: 'center' }}>
                    <p style={{ color: '#ffffff', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                      Kan.
                    </p>
                    <p style={{ color: '#A0C060', fontSize: '12px', letterSpacing: '3px', margin: '8px 0 0', textTransform: 'uppercase' }}>
                      I C — I Can
                    </p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '40px 32px' }}>
                    <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#315D02', margin: '0 0 8px' }}>
                      Your table is confirmed!
                    </p>
                    <p style={{ fontSize: '14px', color: '#666', margin: '0 0 32px', lineHeight: '1.6' }}>
                      Hi {guest_name}, we are happy to confirm your reservation at Kan Coffee.
                    </p>

                    {/* Booking details */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#F9FBF6', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
                      <tr>
                        <td style={{ paddingBottom: '12px' }}>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 4px' }}>Table</p>
                          <p style={{ fontSize: '15px', color: '#315D02', fontWeight: 'bold', margin: 0 }}>
                            {table_name} — Floor {floor} (Indoor AC)
                          </p>
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
                            {start_time} – {endTime} ({duration_min} min)
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Address */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ borderTop: '1px solid #E8F5D0', paddingTop: '24px' }}>
                      <tr>
                        <td>
                          <p style={{ fontSize: '11px', color: '#80AE4A', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 8px' }}>Address</p>
                          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', margin: 0 }}>
                            35 D5, Ward 25, Thanh My Tay<br />
                            Ho Chi Minh City 700000, Vietnam
                          </p>
                        </td>
                      </tr>
                    </table>

                    {/* Notice */}
                    <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: '#FFF9E6', borderRadius: '8px', padding: '16px', marginTop: '24px' }}>
                      <tr>
                        <td>
                          <p style={{ fontSize: '13px', color: '#856404', margin: 0, lineHeight: '1.6' }}>
                            Please arrive within <strong>10 minutes</strong> of your reservation time.
                            Late arrivals may result in the table being released.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{ backgroundColor: '#F9FBF6', padding: '24px 32px', textAlign: 'center', borderTop: '1px solid #E8F5D0' }}>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                      Kan Coffee · 35 D5, Ward 25, Thanh My Tay, Ho Chi Minh City
                    </p>
                    <p style={{ fontSize: '11px', color: '#bbb', margin: '8px 0 0' }}>
                      2025 Kan Coffee. All rights reserved.
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
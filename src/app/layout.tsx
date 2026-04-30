import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Kan Coffee — I Can',
  description:
    'Kan Coffee is a café and co-working space in Ho Chi Minh City. Reserve your table online.',
  keywords: ['Kan Coffee', 'cafe', 'co-working', 'Ho Chi Minh City', 'coffee'],
  openGraph: {
    title: 'Kan Coffee — I Can',
    description: 'A café and co-working space in Ho Chi Minh City.',
    url: 'https://kan-coffee.vercel.app',
    siteName: 'Kan Coffee',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-kan-offwhite text-kan-dark font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portfolio App',
  description: 'Build and edit your portfolio, live, in the real design — no forms, no builder.',
  openGraph: {
    title: 'Portfolio App',
    description: 'Build and edit your portfolio, live, in the real design.',
    siteName: 'Portfolio App',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-900">{children}</body>
    </html>
  )
}

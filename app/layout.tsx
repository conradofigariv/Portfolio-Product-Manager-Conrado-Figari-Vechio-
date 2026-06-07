import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { LanguageProvider } from './context/LanguageContext'

export const metadata: Metadata = {
  title: 'Conrado Figari — Product Manager',
  description: 'Portfolio of Conrado Figari. Innovative products, digital strategy, and exceptional user experiences.',
  keywords: 'Product Manager, PM, Products, Digital Strategy',
  authors: [{ name: 'Conrado Figari' }],
  openGraph: {
    title: 'Conrado Figari — Product Manager',
    description: 'Discover my projects and case studies',
    siteName: 'Conrado Figari Portfolio',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-dark-900">
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}

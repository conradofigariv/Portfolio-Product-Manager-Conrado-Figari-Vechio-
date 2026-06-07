import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Conrado Figari - Product Manager',
  description: 'Portfolio de Conrado Figari. Productos innovadores, estrategia digital y experiencias de usuario excepcionales.',
  keywords: 'Product Manager, PM, Productos, Estrategia Digital',
  authors: [{ name: 'Conrado Figari', url: 'https://conradofigari.com' }],
  openGraph: {
    title: 'Conrado Figari - Product Manager',
    description: 'Descubre mis proyectos y casos de estudio',
    url: 'https://conradofigari.com',
    siteName: 'Conrado Figari Portfolio',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-dark-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}

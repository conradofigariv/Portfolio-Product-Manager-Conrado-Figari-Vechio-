import { LanguageProvider } from '../context/LanguageContext'
import type { Portfolio } from '../lib/portfolio'
import Navbar from './Navbar'
import Hero from './Hero'
import Journey from './Journey'
import ProjectTimeline from './ProjectTimeline'
import Skills from './Skills'
import Contact from './Contact'
import Footer from './Footer'

// A whole portfolio, rendered from one person's data. Lives here rather than in
// the root layout so each route supplies its own, and so the editor and login
// pages are not wrapped in someone's portfolio chrome.
export default function PortfolioShell({ portfolio }: { portfolio: Portfolio }) {
  return (
    <LanguageProvider portfolio={portfolio}>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <ProjectTimeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </LanguageProvider>
  )
}

import { LanguageProvider } from '../context/LanguageContext'
import type { Portfolio } from '../lib/portfolio'
import Navbar from './Navbar'
import Hero from './Hero'
import Journey from './Journey'
import ProjectTimeline from './ProjectTimeline'
import Skills from './Skills'
import Contact from './Contact'
import Footer from './Footer'
import EditBar from './EditBar'

// A whole portfolio, rendered from one person's data. The same components serve
// the public page and the editor — editing happens in place, so there is no
// second copy of the layout that could drift from this one.
export default function PortfolioShell({
  portfolio,
  editing = false,
  published = false,
}: {
  portfolio: Portfolio
  editing?: boolean
  published?: boolean
}) {
  return (
    <LanguageProvider portfolio={portfolio} editing={editing}>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <ProjectTimeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <EditBar published={published} />
    </LanguageProvider>
  )
}
